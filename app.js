'use strict';
const names={
  'kimi-k3.1-pro':'Kimi K3.1 Pro',
  'Step3-VL-10B':'Step3-VL-10B','InternVL3_5-8B':'InternVL3.5-8B','MiniCPM-o-4_5':'MiniCPM-o 4.5','Qwen3_5-9B':'Qwen3.5-9B',
  'gpt-5_4-0305-global':'GPT-5.4','qwen-vl-max-latest':'Qwen-VL-Max','claude-opus-4-6-20260205':'Claude Opus 4.6','claude-sonnet-4-6':'Claude Sonnet 4.6',
  'claude-opus-4-8':'Claude Opus 4.8','gemini-3_1-flash-lite-preview':'Gemini 3.1 Flash Lite','gpt-5_5':'GPT-5.5','gemini-3_1-pro-preview':'Gemini 3.1 Pro',
  'kimi-k2_6':'Kimi K2.6','doubao-seed-2-0-pro-260215':'Seed 2.0 Pro','kimi-k2_5':'Kimi K2.5','gpt-6-sol':'GPT-6 Sol',
  'qwen3_5-plus':'Qwen3.5-Plus','qwen3_8-flash':'Qwen3.8-Flash','qwen3_7-plus':'Qwen3.7-Plus','qwen3_6-plus':'Qwen3.6-Plus','qwen3_8-max':'Qwen3.8-Max',
  'grok-4_7':'Grok-4.7','deepseek-v4_1-flash-1017':'DeepSeek-V4.1-Flash-1017','gpt-6_1-sol':'GPT-6.1-Sol',
  'claude-opus-5_5':'Claude Opus 5.5','gemini-4-hydrogen':'Gemini 4 Hydrogen','qwen4-max':'Qwen4 Max'
};
const columns={tasks:[['Recognition','Recognition'],['Parsing','Parsing'],['Grounding','Grounding'],['Extraction','Extraction'],['QA','QA'],['Average','Average']],categories:[['1-Books & Academic','Books'],['2-Reports & Memos','Reports'],['3-Marketing & Editorial','Marketing'],['4-Legal & Public Notices','Legal'],['5-Forms & Personal Records','Forms'],['6-Receipts & Transactions','Receipts'],['7-Certificates & Medical','Medical'],['8-Handwritten Pages','Handwriting'],['9-Charts & Diagrams','Charts'],['10-Labels & Screens','Screens'],['Average','Average']]};
const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let scoreData=null;
const state={view:'tasks',filter:'all',query:'',sort:'Average',direction:'desc'};
const modelType=row=>row.Category||row.Model_Category;
const modelIconFiles=[
  [/^gpt-/i,'openai.svg'],[/^qwen/i,'qwen.svg'],[/^claude-/i,'claude.svg'],
  [/^gemini-/i,'gemini.svg'],[/^kimi-/i,'kimi-mark.svg'],[/^doubao-/i,'seed.svg'],
  [/^step/i,'stepfun.svg'],[/^internvl/i,'internvl.svg'],[/^minicpm/i,'minicpm.webp'],
  [/^grok-/i,'grok.svg'],[/^deepseek-/i,'deepseek.svg']
];
const modelIcon=model=>modelIconFiles.find(([pattern])=>pattern.test(model))?.[1];
function renderScores(){
  if(!scoreData)return;
  const all=scoreData[state.view];
  const group=all.filter(row=>state.filter==='all'||modelType(row).includes(state.filter==='device'?'On-Device':'On-Server'));
  const visible=group.filter(row=>((names[row.Model]||row.Model)+' '+row.Model).toLowerCase().includes(state.query));
  visible.sort((a,b)=>(state.direction==='desc'?1:-1)*((b[state.sort]??-1)-(a[state.sort]??-1))||(names[a.Model]||a.Model).localeCompare(names[b.Model]||b.Model));
  const cols=[['Average','Average'], ...columns[state.view].filter(([key])=>key!=='Average')];
  document.getElementById('view-summary').textContent=state.view==='tasks'
    ? `Five tasks · ${all.length} models. Average gives equal weight to recognition, parsing, grounding, extraction and QA.`
    : `Ten document categories · ${all.length} models. Average gives equal weight to each document category.`;
  document.getElementById('score-columns').innerHTML='<col class="rank-width"><col class="model-width"><col class="average-width">'+cols.slice(1).map(()=>'<col>').join('');
  const scoreHeading=([key,label],rowspan=1)=>`<th scope="col" rowspan="${rowspan}" class="${key==='Average'?'average-heading':''}" aria-sort="${state.sort===key?(state.direction==='desc'?'descending':'ascending'):'none'}"><button type="button" data-sort="${escapeHtml(key)}" title="Sort by ${escapeHtml(key.replace(/^\d+-/,''))}">${label}<span class="sort-icon ${state.sort===key?'is-active':''}" aria-hidden="true">${state.sort===key?(state.direction==='asc'?'↑':'↓'):'↕'}</span></button></th>`;
  document.getElementById('score-head').innerHTML=`<tr class="score-group-row"><th scope="col" rowspan="2" class="rank-col" title="Rank by the selected score within the model group">#</th><th scope="col" rowspan="2" class="model-col">Model</th>${scoreHeading(cols[0],2)}<th scope="colgroup" colspan="${cols.length-1}" class="score-group-heading">${state.view==='tasks'?'Document Processing Tasks':'Document Categories'}</th></tr><tr class="score-column-row">${cols.slice(1).map(col=>scoreHeading(col)).join('')}</tr>`;
  const leaders=Object.fromEntries(cols.map(([key])=>[key,[...new Set(group.map(row=>row[key]).filter(Number.isFinite))].sort((a,b)=>b-a).slice(0,2)]));
  document.getElementById('score-body').innerHTML=visible.length?visible.map(row=>{
    const rank=1+group.filter(other=>other[state.sort]>row[state.sort]).length;
    const device=modelType(row).includes('Device');
    const icon=modelIcon(row.Model);
    return `<tr class="${device?'model-device':'model-server'}"><td class="rank-col"><span class="rank-number ${rank<=3?'rank-leading':''}">${rank}</span></td><th scope="row" class="model-col"><span class="model-name" title="${escapeHtml(row.Model)}">${icon?`<img class="model-icon" src="assets/model-icons/${icon}" width="20" height="20" alt="" aria-hidden="true">`:''}<span class="model-label">${escapeHtml(names[row.Model]||row.Model)}</span></span><span class="sr-only">, ${device?'On-device':'On-server'}</span></th>`+cols.map(([key])=>{
      const value=row[key];
      const top=Number.isFinite(value)&&value===leaders[key][0];
      const second=Number.isFinite(value)&&value===leaders[key][1];
      const formatted=Number.isFinite(value)?value.toFixed(2):'—';
      return `<td class="score-cell ${key==='Average'?'average':''} ${top?'best':second?'second-best':''}"><span class="score-value">${formatted}</span>${top?'<span class="sr-only">, best score</span>':second?'<span class="sr-only">, second-best score</span>':''}</td>`;
    }).join('')+'</tr>';
  }).join(''):`<tr><td class="empty" colspan="${cols.length+2}">No models match “${escapeHtml(state.query)}”. Try another name or choose All models.</td></tr>`;
  document.getElementById('score-table').classList.toggle('category-table',state.view==='categories');
  document.getElementById('model-count').textContent=`${visible.length}${visible.length!==group.length?` of ${group.length}`:''} models · Higher is better`;
  document.getElementById('score-updated').textContent='Updated Nov 20, 2026';
  document.getElementById('download-scores').href=state.view==='tasks'?'assets/task-scores.csv':'assets/category-scores.csv';
  document.getElementById('score-panel').setAttribute('aria-labelledby',state.view==='tasks'?'task-tab':'category-tab');
  document.querySelector('#score-panel>.table-scroll').scrollTop=0;
}
function setView(button){
  state.view=button.dataset.view;state.sort='Average';state.direction='desc';
  document.querySelector('#score-panel>.table-scroll').scrollLeft=0;
  document.querySelectorAll('[data-view]').forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1;});renderScores();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button)));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  state.filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',b===button));renderScores();
}));
document.getElementById('model-search').addEventListener('input',event=>{state.query=event.target.value.toLowerCase().trim();renderScores();});
document.getElementById('score-head').addEventListener('click',event=>{const button=event.target.closest('[data-sort]');if(!button)return;state.direction=state.sort===button.dataset.sort&&state.direction==='desc'?'asc':'desc';state.sort=button.dataset.sort;renderScores();
  [...document.querySelectorAll('[data-sort]')].find(control=>control.dataset.sort===state.sort)?.focus({preventScroll:true});
});
if(window.CCOCR_SCORES){scoreData=window.CCOCR_SCORES;renderScores();}
else{document.getElementById('score-body').innerHTML='<tr><td class="empty">Scores could not load. Use Download CSV to view the results.</td></tr>';document.getElementById('model-count').textContent='Score data unavailable';}
document.querySelectorAll('[role="tablist"]').forEach(list=>list.addEventListener('keydown',event=>{
  const tabs=[...list.querySelectorAll('[role="tab"]')];const current=tabs.indexOf(document.activeElement);if(current<0)return;
  let next=current;const vertical=list.getAttribute('aria-orientation')==='vertical';
  if(event.key===(vertical?'ArrowDown':'ArrowRight'))next=(current+1)%tabs.length;else if(event.key===(vertical?'ArrowUp':'ArrowLeft'))next=(current-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
  event.preventDefault();tabs[next].focus();tabs[next].click();
}));
document.getElementById('copy-citation').addEventListener('click',async()=>{
  const button=document.getElementById('copy-citation');const text=document.getElementById('bibtex').textContent;
  try{await navigator.clipboard.writeText(text);button.textContent='Copied';document.getElementById('copy-status').textContent='BibTeX citation copied to clipboard';setTimeout(()=>{button.textContent='Copy citation';},2200);}
  catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(document.getElementById('bibtex'));selection.removeAllRanges();selection.addRange(range);button.textContent='Select & copy';document.getElementById('copy-status').textContent='Citation selected. Press Command+C or Control+C to copy.';}
});
