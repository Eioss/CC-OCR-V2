window.CCOCR_DIAGNOSTICS = {
  models: [
    { id: "doubao-seed-2-0-pro-260215", name: "Seed 2.0 Pro", color: "#df4f73" },
    { id: "gemini-3_1-pro-preview", name: "Gemini 3.1 Pro", color: "#4175d0" },
    { id: "gpt-5_5", name: "GPT-5.5", color: "#1baf95" },
    { id: "qwen3_7-plus", name: "Qwen3.7-Plus", color: "#8b6bd0" },
    { id: "claude-opus-4-8", name: "Claude Opus 4.8", color: "#e99639" },
    { id: "kimi-k2_6", name: "Kimi K2.6", color: "#966457" }
  ],
  dimensions: {
    layout: {
      title: "Layout Structure",
      description: "Tables, forms, paragraphs, lists, and other content structures.",
      takeaway: "Models handle Paragraphs (71.6–88.1) and Charts (74.9–85.3) reliably, but drop sharply on Monospace Text (37.2–74.2) and structured Forms (46.8–75.1).",
      axes: ["Charts", "Forms", "Lists", "Mixed Text & Images", "Monospace Text", "Paragraphs", "Tables"],
      counts: [843, 1560, 371, 747, 169, 1020, 1649],
      scores: {
        "doubao-seed-2-0-pro-260215": [81.87, 70.03, 75.74, 73.06, 61.61, 86.71, 74.77],
        "gemini-3_1-pro-preview": [82.77, 61.79, 74.52, 69.35, 55.68, 88.09, 71.58],
        "gpt-5_5": [74.85, 58.50, 67.72, 64.05, 48.48, 71.56, 70.18],
        "qwen3_7-plus": [85.28, 75.10, 78.10, 79.01, 74.16, 86.01, 78.53],
        "claude-opus-4-8": [78.50, 46.78, 65.14, 56.56, 37.20, 81.10, 66.17],
        "kimi-k2_6": [84.37, 67.92, 76.57, 72.50, 68.88, 85.24, 73.38]
      }
    },
    imaging: {
      title: "Imaging Method",
      description: "Photographs, scans, screenshots, and reproduced images.",
      takeaway: "Camera Photos (59.9–76.4) and UI Screenshots (52.0–80.8) reduce accuracy by 10–26 points compared with clean Reproduced Images (73.6–86.3).",
      axes: ["Photo", "Reproduced Image", "Scan", "Screenshot"],
      counts: [2575, 1030, 2313, 441],
      scores: {
        "doubao-seed-2-0-pro-260215": [73.45, 81.51, 75.15, 76.09],
        "gemini-3_1-pro-preview": [70.51, 82.98, 70.50, 64.86],
        "gpt-5_5": [61.47, 73.62, 67.17, 71.59],
        "qwen3_7-plus": [76.37, 86.34, 79.53, 80.84],
        "claude-opus-4-8": [59.89, 77.89, 60.91, 51.95],
        "kimi-k2_6": [70.50, 84.06, 75.89, 74.79]
      }
    },
    font: {
      title: "Font & Text Form",
      description: "Printed, handwritten, decorative, thermal, and curved text.",
      takeaway: "Dot-matrix / thermal print (39.0–68.8) is universally difficult, while Irregularly Curved Text exposes a 52-point spread across models (36.6 to 88.9).",
      axes: ["Artistic", "Dot-matrix", "Handwriting (Cursive)", "Handwriting (Messy)", "Handwriting (Neat)", "Irregularly Curved Text", "Printed Text"],
      counts: [108, 761, 265, 131, 493, 193, 4408],
      scores: {
        "doubao-seed-2-0-pro-260215": [82.74, 61.52, 75.86, 84.80, 73.63, 77.19, 78.07],
        "gemini-3_1-pro-preview": [86.01, 56.29, 73.73, 82.07, 69.43, 87.71, 74.05],
        "gpt-5_5": [78.42, 49.13, 72.96, 80.16, 66.14, 48.98, 69.24],
        "qwen3_7-plus": [87.67, 68.77, 80.81, 91.34, 74.75, 88.93, 81.04],
        "claude-opus-4-8": [87.78, 39.03, 60.00, 74.46, 58.01, 36.59, 67.82],
        "kimi-k2_6": [87.81, 64.53, 75.95, 82.41, 70.56, 59.61, 77.44]
      }
    },
    geometry: {
      title: "Geometry & Arrangement",
      description: "Rotation, perspective distortion, dense text, and text direction.",
      takeaway: "Horizontal and Multi-direction pages separate top models by ~18–20 points, while severe Rotation triggers a steep drop in GPT-5.5 (54.1 vs. 84.7 best).",
      axes: ["Dense Small Text", "Horizontal Layout", "Multi-direction", "Perspective Distortion", "Rotation"],
      counts: [134, 4050, 1085, 844, 246],
      scores: {
        "doubao-seed-2-0-pro-260215": [80.84, 74.37, 76.89, 76.06, 84.63],
        "gemini-3_1-pro-preview": [80.27, 69.27, 75.35, 76.64, 84.74],
        "gpt-5_5": [72.19, 66.63, 66.27, 65.81, 54.14],
        "qwen3_7-plus": [80.08, 78.75, 82.09, 78.45, 80.51],
        "claude-opus-4-8": [68.37, 60.47, 62.02, 67.97, 73.66],
        "kimi-k2_6": [80.07, 75.28, 72.78, 73.73, 76.47]
      }
    },
    quality: {
      title: "Image Quality",
      description: "Clear images, low resolution, and motion or defocus blur.",
      takeaway: "Motion and defocus blur (54.6–70.9) degrades nearly all models by 8–11 points vs. Clear Images, while Low Resolution widens the gap from 50.0 to 82.4.",
      axes: ["Blur (Motion / Defocus)", "Clear Image", "Low Resolution"],
      counts: [157, 5802, 400],
      scores: {
        "doubao-seed-2-0-pro-260215": [67.77, 75.71, 74.90],
        "gemini-3_1-pro-preview": [70.86, 71.35, 80.68],
        "gpt-5_5": [58.16, 66.98, 56.53],
        "qwen3_7-plus": [68.29, 79.44, 82.44],
        "claude-opus-4-8": [54.62, 63.29, 49.98],
        "kimi-k2_6": [65.97, 75.60, 66.44]
      }
    },
    lighting: {
      title: "Lighting & Screen",
      description: "Shadows, reflections, uneven exposure, and screen capture moiré.",
      takeaway: "Shadows and uneven exposure (53.2–73.2, n = 930) are the primary lighting bottleneck, costing 7–11 points relative to evenly lit documents.",
      axes: ["Moire", "No Issue", "Reflection", "Shadows"],
      counts: [16, 5289, 124, 930],
      scores: {
        "doubao-seed-2-0-pro-260215": [78.16, 76.56, 73.14, 69.73],
        "gemini-3_1-pro-preview": [81.99, 72.92, 73.28, 66.01],
        "gpt-5_5": [85.63, 67.74, 64.73, 57.33],
        "qwen3_7-plus": [79.48, 80.63, 72.58, 73.20],
        "claude-opus-4-8": [78.37, 63.78, 67.44, 53.21],
        "kimi-k2_6": [70.47, 76.20, 73.32, 67.52]
      }
    },
    interference: {
      title: "Natural Interference",
      description: "Background clutter, occlusion, smearing, stamps, and watermarks.",
      takeaway: "Smearing / privacy redaction (31.3–66.1) and Stamp Overlays (50.7–78.0) cause severe attribution failures—dropping up to 38 points below clean pages.",
      axes: ["Complex Background", "No Issue", "Occlusion", "Smearing", "Stamp Overlay", "Strong UI Interference", "Ticket Overlap", "Watermark Overlay"],
      counts: [337, 3104, 747, 909, 345, 41, 146, 730],
      scores: {
        "doubao-seed-2-0-pro-260215": [80.57, 78.37, 77.16, 60.79, 73.23, 74.63, 79.31, 84.08],
        "gemini-3_1-pro-preview": [79.35, 76.04, 75.73, 52.02, 67.47, 61.67, 76.60, 82.65],
        "gpt-5_5": [72.54, 71.83, 61.02, 47.88, 57.06, 70.61, 73.41, 78.38],
        "qwen3_7-plus": [82.48, 82.40, 81.97, 66.11, 77.96, 75.35, 83.59, 84.50],
        "claude-opus-4-8": [74.98, 69.21, 63.68, 31.26, 50.72, 54.10, 69.98, 83.23],
        "kimi-k2_6": [83.70, 78.91, 76.55, 56.51, 68.89, 71.81, 77.07, 85.32]
      }
    },
    adversarial: {
      title: "Adversarial / Misleading Factors",
      description: "Distracting text, misleading visual annotations, and competing candidates.",
      takeaway: "Distracting Text Injection (41.7–74.2, n = 363) hurts every model, while misleading visual marks and adversarial occlusions drop weaker grounding models below 56.",
      axes: ["Adversarial Occlusion Injection", "Distracting Text Injection", "Multiple-candidate Confusion", "No Interference", "Misleading Visual Annotation"],
      counts: [19, 363, 19, 5841, 117],
      scores: {
        "doubao-seed-2-0-pro-260215": [83.34, 68.97, 86.13, 75.72, 83.94],
        "gemini-3_1-pro-preview": [86.73, 58.63, 84.83, 72.62, 80.36],
        "gpt-5_5": [46.16, 61.13, 82.95, 66.91, 45.95],
        "qwen3_7-plus": [85.76, 74.24, 85.83, 79.56, 85.31],
        "claude-opus-4-8": [55.29, 41.67, 81.30, 63.67, 65.56],
        "kimi-k2_6": [72.36, 67.11, 85.44, 75.23, 80.50]
      }
    },
    language: {
      title: "Language",
      description: "Performance across language families and writing-system groups.",
      takeaway: "Models perform consistently on Latin (68.5–79.9), but diverge sharply on East Asian documents (51.8–78.3, n = 2,267) and Arabic script (45.6–87.2).",
      axes: ["Arabic-script Text", "Cyrillic-script Text", "East Asian Text", "Latin-script Text", "Other Scripts"],
      counts: [21, 19, 2267, 4038, 14],
      scores: {
        "doubao-seed-2-0-pro-260215": [85.68, 93.92, 73.11, 76.71, 89.58],
        "gemini-3_1-pro-preview": [87.23, 85.05, 66.85, 74.79, 84.20],
        "gpt-5_5": [45.64, 63.40, 61.35, 69.19, 53.51],
        "qwen3_7-plus": [79.79, 93.36, 78.26, 79.91, 87.47],
        "claude-opus-4-8": [64.09, 91.67, 51.75, 68.50, 75.36],
        "kimi-k2_6": [60.63, 85.72, 68.39, 78.72, 77.70]
      }
    },
    "mixed-layout": {
      title: "Mixed Layout",
      description: "Mixed languages, text directions, multilingual blocks, and annotations.",
      takeaway: "Block-based Multilingual (44.5–71.7) and Same-line Mixed layouts (46.9–76.9) cut performance by up to 22 points compared with single-style pages.",
      axes: ["Annotation-style Layout", "Block-based Multilingual Layout", "Non-mixed Layout", "Parallel Layout", "Direction-mixed Layout", "Same-line Mixed Layout"],
      counts: [218, 146, 4819, 92, 12, 1072],
      scores: {
        "doubao-seed-2-0-pro-260215": [85.85, 68.20, 76.52, 69.17, 92.71, 70.98],
        "gemini-3_1-pro-preview": [85.16, 57.88, 74.88, 60.73, 84.32, 60.99],
        "gpt-5_5": [76.24, 51.53, 67.72, 58.72, 73.35, 60.94],
        "qwen3_7-plus": [86.96, 71.71, 80.06, 71.66, 92.48, 76.90],
        "claude-opus-4-8": [80.65, 44.48, 66.26, 53.72, 86.14, 46.88],
        "kimi-k2_6": [84.97, 65.43, 76.99, 68.45, 87.02, 66.45]
      }
    }
  }
};
