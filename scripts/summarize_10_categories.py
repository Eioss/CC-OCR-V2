import pandas as pd
import json
import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

def main():
    print("Loading CSV mapping...")
    repo_root = Path(__file__).resolve().parent.parent
    csv_path = repo_root / 'classification_taxonomy.csv'
    df_excel = pd.read_csv(str(csv_path))
    
    mapping = {}
    for idx, row in df_excel.iterrows():
        l2 = str(row['L2'])
        cat = str(row['A-1小类_合并10类'])
        if pd.isna(l2) or pd.isna(cat) or l2 == 'nan':
            continue
            
        paths = []
        if l2.startswith('['):
            try:
                paths = json.loads(l2)
            except:
                paths = [l2]
        else:
            paths = [l2]
            
        for p in paths:
            parts = p.split('/')
            dataset = None
            stem = None
            
            for i, part in enumerate(parts):
                if part in ['images', 'answer', 'txt', 'jsonl', 'question']:
                    if i + 1 < len(parts):
                        dataset = parts[i+1]
                    if i + 2 < len(parts):
                        name_part = parts[i+2]
                        if '.' in name_part:
                            stem = name_part.rsplit('.', 1)[0]
                        else:
                            stem = name_part
                    break
                    
            if dataset and stem:
                mapping[(dataset, stem)] = cat

    print(f"Built mapping with {len(mapping)} entries.")
    
    print("Loading scores...")
    scores_path = REPO_ROOT / 'all_models_all_tasks_sample_scores.csv'
    if not scores_path.exists():
        print(f"Error: {scores_path} not found.")
        return
        
    df_scores = pd.read_csv(scores_path)
    
    def get_cat(row):
        dataset = str(row['Dataset'])
        file_stem = str(row['File']).rsplit('.', 1)[0]
        
        # Some special cases:
        # In parsing, the dataset was merged (e.g. doc_parsing_doc_doc_photo_150)
        # But in Excel, the L2 path was updated to the new dataset name and the filename got 'chn_' or 'eng_' prefix.
        # Let's check if it matches directly.
        cat = mapping.get((dataset, file_stem))
        if cat:
            return cat
            
        # Fallback: maybe the dataset name has a suffix difference?
        # Try to find any key in mapping where dataset matches and stem matches
        return "Unknown"

    df_scores['Category_10'] = df_scores.apply(get_cat, axis=1)
    
    unknown_count = (df_scores['Category_10'] == 'Unknown').sum()
    print(f"Mapped {len(df_scores) - unknown_count} rows. Unknown: {unknown_count}")
    
    if unknown_count > 0:
        print("Sample of Unknowns:")
        print(df_scores[df_scores['Category_10'] == 'Unknown'][['Dataset', 'File']].head())
    
    # Filter out Unknown
    df_valid = df_scores[df_scores['Category_10'] != 'Unknown'].copy()
    
    # Group by Model and Category_10, calculate mean
    summary = df_valid.groupby(['Model', 'Category_10'])['Score'].mean().reset_index()
    
    # Pivot
    pivot = summary.pivot(index='Model', columns='Category_10', values='Score')
    
    # Multiply by 100 for percentage
    pivot = pivot * 100
    
    # Calculate Average
    pivot['Average'] = pivot.mean(axis=1)
    
    # Add Category (Device vs Server)
    def get_model_category(model_name):
        model_lower = model_name.lower()
        if "10b" in model_lower or "8b" in model_lower or "9b" in model_lower or "minicpm" in model_lower:
            return "On-Device LMMs"
        return "On-Server LMMs"
        
    pivot['Model_Category'] = [get_model_category(m) for m in pivot.index]
    
    # Sort
    pivot = pivot.sort_values(by=['Model_Category', 'Average'], ascending=[True, True])
    
    # Reorder columns
    cols = pivot.columns.tolist()
    cols.remove('Model_Category')
    cols.remove('Average')
    cols = ['Model_Category'] + cols + ['Average']
    pivot = pivot[cols]
    
    # Format
    for col in cols:
        if col != 'Model_Category':
            pivot[col] = pivot[col].apply(lambda x: f"{x:.2f}" if pd.notnull(x) else "-")
            
    print("\n" + "="*120)
    print("🏆 10类分类体系评测结果汇总 (百分制)")
    print("="*120 + "\n")
    
    pivot_reset = pivot.reset_index()
    
    df_device = pivot_reset[pivot_reset['Model_Category'] == 'On-Device LMMs'].drop(columns=['Model_Category'])
    if not df_device.empty:
        print("### On-Device LMMs")
        print(df_device.to_markdown(index=False))
        print("\n")
        
    df_server = pivot_reset[pivot_reset['Model_Category'] == 'On-Server LMMs'].drop(columns=['Model_Category'])
    if not df_server.empty:
        print("### On-Server LMMs")
        print(df_server.to_markdown(index=False))
        print("\n")
        
    out_csv = REPO_ROOT / "all_models_summary_10_categories.csv"
    pivot_reset.to_csv(out_csv, index=False)
    print(f"✅ 结果已保存至: {out_csv}")

if __name__ == "__main__":
    main()
