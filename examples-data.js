window.CCOCR_EXAMPLES = {
  "recognition": [
    {
      "id": "86307ef9eb94",
      "title": "Text on crumpled paper",
      "description": "Transcribe printed text despite folds, perspective distortion, and pen marks.",
      "image": "assets/examples/86307ef9eb94.jpg",
      "width": 1920,
      "height": 1440,
      "prompt": "Please output only the text content from the image without any additional descriptions or formatting.",
      "promptAbridged": false,
      "answer": "ran ran gentle careful winter read mirror chance map but sighed wrote sudden ink dangerous everything someone dim something! after sharp noticed almost simple Noah library asked door ticket dusty laughed thunder... letter the until mirror hid stairs never strange room nearby and library winter someone Clara choice. opened the or wind asked while read read choice never noticed careful wide wrote morning waited waited laughed while? inside memory everyone promise narrow station hallway everything paper summer warm before summer warm! rain sighed garden bright closed truth thunder empty everyone because someone. remembered Maple Row waited laughed still coin hid read mirror wrote choice walked window when hallway ticket bright a... room opened window nothing noticed patient elsewhere key winter coin no one hallway midnight summer. after above map quietly clock laughed Northgate before nearby hallway! almost until relief Glasshill stared nearby Jonah hope asked answered quiet! paused regret Glasshill stairs paper Theo ran and the garden bridge! carried narrow before inside hid roof sighed silence patient after when. carried relief anyone when Elena strange light window library clock before noticed... library narrow patient paused asked silence empty a asked noticed closed careful laughed sudden until empty voice hallway closed ticket? door stared and above read everything almost mirror faint familiar hallway anyone... a restless together winter memory walked cold remembered river while mirror? faint wide photograph strange quiet forgot station carried bridge fear listened closed. nearby somewhere Greywater closed rain hallway somewhere forgot stared while paused the. memory asked paper cold warm again sudden hid or simple sudden while turned crowded noticed everything patient whispered gentle... asked closed summer room garden photograph asked secret hope warm fog warm key Clara together paused river empty curious. and dusty Mira morning stared river coin notebook door lamp someone careful key somewhere wind. familiar alone read anyone winter simple memory whispered sharp while above sudden rain choice after truth below cold! whispered careful together summer hope opened summer somewhere bridge curious listened promise crowded inside wonder above hid. silence while map door map noticed below thunder secret careful Iris stared mirror voice summer! walked library remembered light until before morning but somewhere choice garden but together! warm stairs stairs river wide above strange a ticket the library laughed choice room choice? relief shadow restless roof stairs a ink together silence crowded. wide coin sharp quietly opened and sighed wrote ticket light a river closed. secret morning stairs careful walked elsewhere remembered careful wind station fog sighed photograph because strange chance relief. anyone quiet everything ink thunder careful outside inside crowded turned almost stairs whispered stared thunder quiet careful river voice. somewhere coin still wrote quietly again paper voice or Glasshill something while photograph lamp stared map hope library bright? quiet opened together Northgate almost strange Mira empty river something. bright together mirror memory paused photograph before forgot closed dusty paused carried room morning! silence dangerous sighed dangerous ink elsewhere crowded ink roof never mirror Elena someone... rain hid alone gentle crowded summer warm fog relief walked ran sudden anyone simple narrow nearby Jonah wide... dangerous turned whispered anyone turned outside rain dusty photograph nearby promise rain? Evelyn midnight everyone wide when closed wonder relief closed again or street asked stared map careful thunder. hallway summer a noticed while warm below empty photograph Theo answered crowded narrow hope stared warm no one! outside regret above narrow station opened alone bridge rain warm nearby together whispered or and dangerous Theo someone. until patient hid sudden read wonder turned wind gentle fog chance. key laughed winter dusty Clara photograph dangerous map elsewhere simple everything. sudden alone anyone noticed ran walked quietly thunder warm chance carried shadow strange alone. but Old Harbor clock map roof remembered the walked map Elena something hid station narrow wind inside familiar voice. sighed wind or garden opened Elena listened thunder simple street sighed while whispered a... clock notebook together roof wonder somewhere stairs sudden while strange turned cold room window quietly everything still wrote. light regret paper key before midnight elsewhere fear mirror wrote voice bridge voice ticket window stared. whispered window truth inside nearby photograph no one bridge voice 2209-520697 gentle laughed ticket closed listened before... wide dim laughed because choice dusty still above turned clock outside walked quietly almost door sudden crowded garden. closed stairs turned bridge notebook library sudden nothing careful nothing opened asked choice. thunder notebook lamp choice dim ticket still truth quiet hallway never room door walked... laughed sharp cold dangerous asked 2509-532327 promise nearby rain street after careful summer still regret. gentle door bridge key warm alone Noah still forgot photograph ran. mirror and Greywater when asked whispered Elena no one midnight mirror. stairs elsewhere Rowan 5286-135717 hid sudden sighed asked summer faint because carried wide while lamp read crowded. bright or crowded wide room until asked letter opened hope silence answered wonder regret chance room ran until morning? still asked fog door elsewhere everything somewhere wonder remembered curious everyone narrow sharp because stared wrote. quiet because whispered Glasshill coin choice ran wind stairs regret opened hallway room. or regret or sighed sharp a dim familiar station again dusty Theo before garden wonder patient sighed... photograph ran",
      "answerLabel": "Reference answer",
      "promptFile": "assets/examples/86307ef9eb94-prompt.txt",
      "answerFile": "assets/examples/86307ef9eb94-answer.txt",
      "sourceTask": "recognition/multi_lan_recognition",
      "sourceSubset": "multi_lan_ocr_English_English_20",
      "categoryKey": "1-Books & Academic",
      "categoryLabel": "Books & Academic",
      "tags": [
        { "label": "Dense Small Text", "diagnostic": "geometry", "axis": "Dense Small Text" },
        { "label": "Shadows", "diagnostic": "lighting", "axis": "Shadows" },
        { "label": "Smearing / Marks", "diagnostic": "interference", "axis": "Smearing" }
      ]
    },
    {
      "id": "6f34713fd0c8",
      "title": "Circular seal text",
      "description": "Read curved seal characters that overlap handwritten signatures at low resolution.",
      "image": "assets/examples/6f34713fd0c8.jpg",
      "width": 98,
      "height": 95,
      "prompt": "Recognize the circular text on the seal in the image without any additional descriptions or formatting",
      "promptAbridged": false,
      "answer": "上蔡县水利局",
      "answerLabel": "Reference answer",
      "promptFile": "assets/examples/6f34713fd0c8-prompt.txt",
      "answerFile": "assets/examples/6f34713fd0c8-answer.txt",
      "sourceTask": "recognition/natural_scene_recognition",
      "sourceSubset": "multi_scene_ocr_document_text_seal_200",
      "categoryKey": "8-Handwritten Pages",
      "categoryLabel": "Handwritten Pages",
      "tags": [
        { "label": "Curved Text", "diagnostic": "font", "axis": "Irregularly Curved Text" },
        { "label": "Stamp Overlay", "diagnostic": "interference", "axis": "Stamp Overlay" },
        { "label": "Low Resolution", "diagnostic": "quality", "axis": "Low Resolution" },
        { "label": "East Asian", "diagnostic": "language", "axis": "East Asian Text" }
      ]
    }
  ],
  "parsing": [
    {
      "id": "7b65e06967aa",
      "title": "Handwritten molecular structure",
      "description": "Recover atoms, bonds, and ring connectivity as a SMILES string.",
      "image": "assets/examples/7b65e06967aa.jpg",
      "width": 2607,
      "height": 1473,
      "prompt": "Extract the chemical molecular structure and return it in SMILES format.",
      "promptAbridged": true,
      "answer": "[C-]#[N+]c1ccc(-c2nc(N3CCC(NC)CC3)n(C)c(=O)c2-c2ccc(CCO)cc2)cc1F",
      "answerLabel": "Reference SMILES",
      "promptFile": "assets/examples/7b65e06967aa-prompt.txt",
      "answerFile": "assets/examples/7b65e06967aa-answer.txt",
      "sourceTask": "parsing/molecular_parsing",
      "sourceSubset": "doc_parsing_molecular_molecular_handwriting_100",
      "categoryKey": "8-Handwritten Pages",
      "categoryLabel": "Handwritten Pages",
      "tags": [
        { "label": "Handwriting (Neat)", "diagnostic": "font", "axis": "Handwriting (Neat)" },
        { "label": "Multi-direction", "diagnostic": "geometry", "axis": "Multi-direction" },
        { "label": "Complex Background", "diagnostic": "interference", "axis": "Complex Background" }
      ]
    },
    {
      "id": "a61e9a1e847d",
      "title": "Handwritten formula",
      "description": "Preserve block-matrix structure, superscripts, and subscripts in LaTeX.",
      "image": "assets/examples/a61e9a1e847d.jpg",
      "width": 4032,
      "height": 3024,
      "prompt": "Extract and output the LaTeX representation of the formula from the image, without any additional text or descriptions.",
      "promptAbridged": false,
      "answer": "\\begin{align*}\n&\\frac{1}{2}\\begin{bmatrix}\\mathbf{0}^{F_0}\\\\\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\end{bmatrix}^\\top\\begin{bmatrix}\\mathbf{Q}^{F_0F_0}&\\mathbf{Q}^{F_0U}&\\mathbf{Q}^{F_0F_1}\\\\\\mathbf{Q}^{UF_0}&\\mathbf{Q}^{UU}&\\mathbf{Q}^{UF_1}\\\\\\mathbf{Q}^{F_1F_0}&\\mathbf{Q}^{F_1U}&\\mathbf{Q}^{F_1F_1}\\\\\\end{bmatrix}\\begin{bmatrix}\\mathbf{0}^{F_0}\\\\\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\end{bmatrix}+\\begin{bmatrix}\\mathbf{c}^{F_0}\\\\\\mathbf{c}^{U}\\\\\\mathbf{c}^{F_1}\\end{bmatrix}^\\top\\begin{bmatrix}\\mathbf{0}^{F_0}\\\\\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\end{bmatrix}\\\\\n&=\\frac{1}{2}\\begin{bmatrix}\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\\\\\end{bmatrix}^\\top\\begin{bmatrix}\\mathbf{Q}^{UU}&\\mathbf{Q}^{UF_1}\\\\(\\mathbf{Q}^{UF_1})^\\top&\\mathbf{Q}^{F_1F_1}\\\\\\end{bmatrix}\\begin{bmatrix}\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\\\\\end{bmatrix}+\\begin{bmatrix}\\mathbf{c}^{U}\\\\\\mathbf{c}^{F_1}\\end{bmatrix}^\\top\\begin{bmatrix}\\mathbf{x}^{U}\\\\\\mathbf{1}^{F_1}\\end{bmatrix}\\\\\n&=\\frac{1}{2}(\\mathbf{x}^U)^\\top\\mathbf{Q}^{UU}\\mathbf{x}^U+(\\mathbf{x}^U)^\\top\\mathbf{Q}^{UF_1}\\mathbf{1}^{F_1}+(\\mathbf{c}^U)^\\top\\mathbf{x}^U+\\xi^{F_1,U},\n\\end{align*}",
      "answerLabel": "Reference LaTeX",
      "promptFile": "assets/examples/a61e9a1e847d-prompt.txt",
      "answerFile": "assets/examples/a61e9a1e847d-answer.txt",
      "sourceTask": "parsing/formula_parsing",
      "sourceSubset": "doc_parsing_formula_formula_handwriting_100",
      "categoryKey": "8-Handwritten Pages",
      "categoryLabel": "Handwritten Pages",
      "tags": [
        { "label": "Handwriting (Neat)", "diagnostic": "font", "axis": "Handwriting (Neat)" },
        { "label": "Rotation / Tilt", "diagnostic": "geometry", "axis": "Rotation" },
        { "label": "Tables / Matrices", "diagnostic": "layout", "axis": "Tables" }
      ]
    }
  ],
  "grounding": [
    {
      "id": "547448bdff7c",
      "title": "Locate a total on a receipt",
      "description": "Return a precise bounding box for the requested amount among nearby numeric fields.",
      "image": "assets/examples/547448bdff7c.jpg",
      "width": 958,
      "height": 1922,
      "prompt": "Locate the text ‘94.60’. Return (x1, y1, x2, y2) normalized to 0–1000.",
      "promptAbridged": true,
      "answer": "(786.013, 673.777, 886.221, 695.63)",
      "answerLabel": "Reference bounding box",
      "promptFile": "assets/examples/547448bdff7c-prompt.txt",
      "answerFile": "assets/examples/547448bdff7c-answer.txt",
      "sourceTask": "grounding/text_grounding",
      "sourceSubset": "multi_scene_ocr_document_text_SROIE_98",
      "box": [786.013, 673.777, 886.221, 695.63],
      "answerNote": "Coordinates are normalized to 0–1000. The blue highlight marks the target region; the raw annotation stores pixel coordinates.",
      "categoryKey": "6-Receipts & Transactions",
      "categoryLabel": "Receipts & Transactions",
      "tags": [
        { "label": "Dot-matrix / Thermal", "diagnostic": "font", "axis": "Dot-matrix" },
        { "label": "Tables", "diagnostic": "layout", "axis": "Tables" },
        { "label": "Photograph", "diagnostic": "imaging", "axis": "Photo" }
      ]
    },
    {
      "id": "5195b863ef86",
      "title": "Locate handwritten digits",
      "description": "Find the handwritten postal code strip and return its bounding box.",
      "image": "assets/examples/5195b863ef86.jpg",
      "width": 2460,
      "height": 350,
      "prompt": "Locate the text ‘58701’. Return (x1, y1, x2, y2) normalized to 0–1000.",
      "promptAbridged": true,
      "answer": "(747.967, 648.571, 818.699, 797.143)",
      "answerLabel": "Reference bounding box",
      "promptFile": "assets/examples/5195b863ef86-prompt.txt",
      "answerFile": "assets/examples/5195b863ef86-answer.txt",
      "sourceTask": "grounding/text_grounding",
      "sourceSubset": "multi_scene_ocr_document_text_HandWriting_92",
      "box": [747.967, 648.571, 818.699, 797.143],
      "answerNote": "Coordinates are normalized to 0–1000. The blue highlight marks the target region; the raw annotation stores pixel coordinates.",
      "categoryKey": "5-Forms & Personal Records",
      "categoryLabel": "Forms & Personal Records",
      "tags": [
        { "label": "Forms", "diagnostic": "layout", "axis": "Forms" },
        { "label": "Handwriting (Neat)", "diagnostic": "font", "axis": "Handwriting (Neat)" },
        { "label": "Smearing / Marks", "diagnostic": "interference", "axis": "Smearing" }
      ]
    }
  ],
  "extraction": [
    {
      "id": "d23dac841321",
      "title": "Nutrition label",
      "description": "Associate each nutrient with the correct serving column and schema field.",
      "image": "assets/examples/d23dac841321.jpg",
      "width": 404,
      "height": 403,
      "prompt": "Fill the provided JSON schema using the values in the nutrition label.",
      "promptAbridged": true,
      "answer": "{\n  \"CE-PS\": \"32075\",\n  \"CE-P1\": \"1895450\",\n  \"PRO-PS\": \"0.9g\",\n  \"PRO-P1\": \"5.7g\",\n  \"CAR-PS\": \"11.3g\",\n  \"CAR-P1\": \"67.3g\",\n  \"TF-PS\": \"2.9g\",\n  \"TF-P1\": \"17.6g\",\n  \"SO-PS\": \"0.04g\",\n  \"SO-P1\": \"0.27g\"\n}",
      "answerLabel": "Reference JSON",
      "promptFile": "assets/examples/d23dac841321-prompt.txt",
      "answerFile": "assets/examples/d23dac841321-answer.txt",
      "sourceTask": "extraction/regulated_records",
      "sourceSubset": "kie_nutrition_label_100",
      "categoryKey": "10-Labels & Screens",
      "categoryLabel": "Labels & Screens",
      "tags": [
        { "label": "Tables", "diagnostic": "layout", "axis": "Tables" },
        { "label": "Rotation / Tilt", "diagnostic": "geometry", "axis": "Rotation" },
        { "label": "Photograph", "diagnostic": "imaging", "axis": "Photo" }
      ]
    },
    {
      "id": "586400ae521c",
      "title": "Handwritten name field",
      "description": "Extract the requested name while distinguishing visually similar handwritten characters.",
      "image": "assets/examples/586400ae521c.jpg",
      "width": 3033,
      "height": 190,
      "prompt": "Extract the 姓名 (name) field and return JSON matching {\"姓名\": \"\"}.",
      "promptAbridged": true,
      "answer": "{\n  \"姓名\": \"朱孝圣\"\n}",
      "answerLabel": "Reference JSON",
      "promptFile": "assets/examples/586400ae521c-prompt.txt",
      "answerFile": "assets/examples/586400ae521c-answer.txt",
      "sourceTask": "extraction/public_services",
      "sourceSubset": "kie_education_100",
      "categoryKey": "5-Forms & Personal Records",
      "categoryLabel": "Forms & Personal Records",
      "tags": [
        { "label": "Forms", "diagnostic": "layout", "axis": "Forms" },
        { "label": "East Asian", "diagnostic": "language", "axis": "East Asian Text" },
        { "label": "Scanned Image", "diagnostic": "imaging", "axis": "Scan" }
      ]
    }
  ],
  "qa": [
    {
      "id": "0d15957d7148",
      "title": "Read the relevant chart",
      "description": "Select the relevant chart within a long infographic and compare its categories.",
      "image": "assets/examples/0d15957d7148.jpg",
      "width": 689,
      "height": 3346,
      "prompt": "Which is the most demanded job in Australia?",
      "promptAbridged": false,
      "answer": "Hospitality, retail and service managers",
      "answerLabel": "Reference answer",
      "promptFile": "assets/examples/0d15957d7148-prompt.txt",
      "answerFile": "assets/examples/0d15957d7148-answer.txt",
      "sourceTask": "qa/dashboards_numeric_qa",
      "sourceSubset": "vqa_dashboards_numeric_500",
      "focusY": 0.81,
      "categoryKey": "3-Marketing & Editorial",
      "categoryLabel": "Marketing & Editorial",
      "tags": [
        { "label": "Charts", "diagnostic": "layout", "axis": "Charts" },
        { "label": "Complex Background", "diagnostic": "interference", "axis": "Complex Background" },
        { "label": "Reproduced Image", "diagnostic": "imaging", "axis": "Reproduced Image" }
      ]
    },
    {
      "id": "001061f11835",
      "title": "Count infographic symbols",
      "description": "Count the requested cursor symbol across a multi-panel infographic.",
      "image": "assets/examples/001061f11835.jpg",
      "width": 580,
      "height": 4472,
      "prompt": "How many cursor arrows are shown in the infographic?",
      "promptAbridged": false,
      "answer": "13",
      "answerLabel": "Reference answer",
      "promptFile": "assets/examples/001061f11835-prompt.txt",
      "answerFile": "assets/examples/001061f11835-answer.txt",
      "sourceTask": "qa/dashboards_numeric_qa",
      "sourceSubset": "vqa_dashboards_numeric_500",
      "focusY": 0.77,
      "categoryKey": "3-Marketing & Editorial",
      "categoryLabel": "Marketing & Editorial",
      "tags": [
        { "label": "Charts", "diagnostic": "layout", "axis": "Charts" },
        { "label": "Reproduced Image", "diagnostic": "imaging", "axis": "Reproduced Image" }
      ]
    }
  ]
};
