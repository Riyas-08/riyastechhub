// Placement page content, shared by the page and the AI assistant tools.
export type BranchId =
  | "ece"
  | "eee"
  | "mech"
  | "civil"
  | "robotics"
  | "mechatronics"
  | "automobile"
  | "instrumentation"
  | "biomedical"
  | "aerospace";

export interface CompanyCategory {
  category: string;
  companies: string[];
  roles: string[];
  skills: string[];
}

export const PLACEMENT_BRANCHES: { id: BranchId; name: string }[] = [
  { id: "ece", name: "ECE" },
  { id: "eee", name: "EEE" },
  { id: "mech", name: "Mechanical Engineering" },
  { id: "civil", name: "Civil Engineering" },
  { id: "robotics", name: "Robotics & Automation" },
  { id: "mechatronics", name: "Mechatronics" },
  { id: "automobile", name: "Automobile Engineering" },
  { id: "instrumentation", name: "Instrumentation Engineering" },
  { id: "biomedical", name: "Biomedical Engineering" },
  { id: "aerospace", name: "Aerospace Engineering" },
];

export const COMPANIES: Record<BranchId, CompanyCategory[]> = {
  ece: [
    {
      category: "Semiconductor & VLSI",
      companies: ["Qualcomm", "Intel", "Texas Instruments", "Samsung"],
      roles: ["VLSI Engineer", "Design Verification Engineer", "Physical Design Engineer"],
      skills: ["Verilog", "Digital Electronics", "SystemVerilog", "CMOS Fundamentals"],
    },
    {
      category: "Embedded & Electronics",
      companies: ["Bosch", "Honeywell", "Tata Elxsi", "HCL Technologies (ERS)"],
      roles: ["Embedded Engineer", "Hardware Engineer", "Firmware Engineer"],
      skills: ["C Programming", "Microcontrollers", "Embedded C", "RTOS"],
    },
    {
      category: "Automation & Industrial",
      companies: ["Siemens", "Schneider Electric", "ABB", "Rockwell Automation"],
      roles: ["Automation Engineer", "PLC Programmer", "Control Systems Engineer"],
      skills: ["PLC", "SCADA", "Sensors", "Industrial Communication"],
    },
    {
      category: "Communication & Networks",
      companies: ["Ericsson", "Nokia", "Jio Platforms", "Tejas Networks"],
      roles: ["RF Engineer", "Network Engineer", "5G Test Engineer"],
      skills: ["Wireless Communication", "Antenna Theory", "Signal Processing"],
    },
  ],
  eee: [
    {
      category: "Power & Energy",
      companies: ["Siemens Energy", "GE Vernova", "BHEL", "L&T Power"],
      roles: ["Power Systems Engineer", "Design Engineer", "Testing Engineer"],
      skills: ["Power Systems", "ETAP", "Protection Relays", "Transformers"],
    },
    {
      category: "Automation & Drives",
      companies: ["ABB", "Schneider Electric", "Mitsubishi Electric", "Danfoss"],
      roles: ["Drives Engineer", "Automation Engineer", "Commissioning Engineer"],
      skills: ["VFD & Drives", "PLC", "Motor Control", "SCADA"],
    },
    {
      category: "Electric Vehicles",
      companies: ["Tata Motors", "Ola Electric", "Ather Energy", "Bosch"],
      roles: ["BMS Engineer", "Motor Design Engineer", "EV Test Engineer"],
      skills: ["Battery Systems", "BLDC Motors", "MATLAB/Simulink", "Power Electronics"],
    },
    {
      category: "Renewables",
      companies: ["Adani Green", "Tata Power Solar", "ReNew", "Vestas"],
      roles: ["Solar Design Engineer", "Wind Site Engineer", "O&M Engineer"],
      skills: ["PVsyst", "SCADA", "Grid Integration", "AutoCAD Electrical"],
    },
  ],
  mech: [
    {
      category: "Automotive & Manufacturing",
      companies: ["Tata Motors", "Ashok Leyland", "TVS Motor", "Bharat Forge"],
      roles: ["Design Engineer", "Production Engineer", "Quality Engineer"],
      skills: ["SolidWorks", "GD&T", "Manufacturing Processes", "CNC"],
    },
    {
      category: "Core Engineering Services",
      companies: ["L&T", "Siemens", "Bosch", "Caterpillar"],
      roles: ["Graduate Engineer Trainee", "R&D Engineer", "CAE Engineer"],
      skills: ["Ansys", "AutoCAD", "Thermodynamics", "FEA"],
    },
    {
      category: "Heavy Machinery & Energy",
      companies: ["BHEL", "GE", "Vestas", "Siemens Gamesa"],
      roles: ["Mechanical Maintenance Engineer", "Turbine Engineer", "Project Engineer"],
      skills: ["Rotating Machinery", "Piping", "ASME Standards", "NDT"],
    },
    {
      category: "HVAC & Product Design",
      companies: ["Blue Star", "Voltas", "Daikin", "Havells"],
      roles: ["Product Design Engineer", "HVAC Engineer", "Application Engineer"],
      skills: ["SolidWorks", "Thermal Analysis", "Refrigeration Cycles"],
    },
  ],
  civil: [
    {
      category: "Construction & Infrastructure",
      companies: ["L&T Construction", "Tata Projects", "Shapoorji Pallonji", "Afcons"],
      roles: ["Site Engineer", "Planning Engineer", "Quantity Surveyor"],
      skills: ["AutoCAD", "MS Project", "Estimation & Costing", "RCC Design"],
    },
    {
      category: "Design & Consulting",
      companies: ["AECOM", "AtkinsRéalis", "Ramboll", "Systra"],
      roles: ["Structural Design Engineer", "Highway Engineer", "Geotechnical Engineer"],
      skills: ["STAAD Pro", "ETABS", "Revit", "IS Codes"],
    },
    {
      category: "PSUs & Government",
      companies: ["NHAI", "CPWD", "PWD", "Metro Rail Corporations"],
      roles: ["Junior Engineer", "Assistant Engineer", "Surveyor"],
      skills: ["Surveying", "AutoCAD Civil 3D", "GATE Preparation"],
    },
  ],
  robotics: [
    {
      category: "Industrial Robotics",
      companies: ["ABB Robotics", "FANUC", "KUKA", "Yaskawa"],
      roles: ["Robotics Engineer", "Robot Programmer", "Applications Engineer"],
      skills: ["Robot Programming", "PLC", "Machine Vision", "Kinematics"],
    },
    {
      category: "Automation & Controls",
      companies: ["Siemens", "Omron", "Rockwell Automation", "Schneider Electric"],
      roles: ["Controls Engineer", "Automation Engineer", "Commissioning Engineer"],
      skills: ["PLC/HMI", "SCADA", "Industrial Networks", "Servo Systems"],
    },
    {
      category: "AI & Mobile Robotics",
      companies: ["Addverb", "GreyOrange", "Systemantics", "Asimov Robotics"],
      roles: ["Robotics Software Engineer", "ROS Developer", "Embedded Engineer"],
      skills: ["ROS/ROS2", "Python", "Embedded C", "Sensor Fusion"],
    },
  ],
  mechatronics: [
    {
      category: "Automation & Manufacturing",
      companies: ["Bosch", "Siemens", "Festo", "Mitsubishi Electric"],
      roles: ["Mechatronics Engineer", "Automation Engineer", "Test Engineer"],
      skills: ["PLC", "Pneumatics", "Embedded C", "Sensors & Actuators"],
    },
    {
      category: "Automotive Electronics",
      companies: ["Continental", "Valeo", "Bosch", "ZF Group"],
      roles: ["ECU Test Engineer", "Hardware Engineer", "Validation Engineer"],
      skills: ["CAN Protocol", "HIL Testing", "MATLAB/Simulink", "Embedded Systems"],
    },
    {
      category: "Product & IoT",
      companies: ["Honeywell", "Schneider Electric", "Eaton", "Emerson"],
      roles: ["Product Engineer", "IoT Engineer", "Field Engineer"],
      skills: ["Microcontrollers", "PCB Basics", "IoT Protocols", "SolidWorks"],
    },
  ],
  automobile: [
    {
      category: "OEMs",
      companies: ["Tata Motors", "Mahindra & Mahindra", "TVS Motor", "Hyundai"],
      roles: ["Design Engineer", "Vehicle Dynamics Engineer", "NVH Engineer"],
      skills: ["SolidWorks/CATIA", "GD&T", "Vehicle Dynamics", "IC Engines"],
    },
    {
      category: "EV & Mobility",
      companies: ["Ola Electric", "Ather Energy", "Bajaj Auto", "Raptee"],
      roles: ["EV Powertrain Engineer", "BMS Engineer", "Homologation Engineer"],
      skills: ["Battery Technology", "MATLAB/Simulink", "CAN", "Motor Controllers"],
    },
    {
      category: "Component & Tier-1",
      companies: ["Bosch", "Valeo", "Delphi-TVS", "Motherson"],
      roles: ["Manufacturing Engineer", "Quality Engineer", "Supplier Quality Engineer"],
      skills: ["IATF 16949", "Lean Manufacturing", "APQP/PPAP", "CNC"],
    },
  ],
  instrumentation: [
    {
      category: "Process & Industrial",
      companies: ["Emerson", "Honeywell", "Yokogawa", "Endress+Hauser"],
      roles: ["Instrumentation Engineer", "Calibration Engineer", "DCS Engineer"],
      skills: ["DCS/PLC", "HART Protocol", "Control Valves", "Transmitters"],
    },
    {
      category: "Oil, Gas & Energy",
      companies: ["Reliance Industries", "ONGC", "L&T Hydrocarbon", "Petrofac"],
      roles: ["E&I Engineer", "Field Instrument Engineer", "Project Engineer"],
      skills: ["P&ID", "Loop Diagrams", "SIL/HAZOP", "SCADA"],
    },
    {
      category: "Automation Solutions",
      companies: ["Siemens", "ABB", "Rockwell Automation", "Schneider Electric"],
      roles: ["Controls Engineer", "Commissioning Engineer", "Application Engineer"],
      skills: ["PLC Programming", "SCADA", "Industrial Networking"],
    },
  ],
  biomedical: [
    {
      category: "Medical Devices",
      companies: ["GE Healthcare", "Philips Healthcare", "Siemens Healthineers", "Medtronic"],
      roles: ["Biomedical Engineer", "Service Engineer", "R&D Engineer"],
      skills: ["Medical Instrumentation", "IEC 60601", "Embedded Systems", "Signal Processing"],
    },
    {
      category: "Imaging & Diagnostics",
      companies: ["BPL Medical", "Trivitron", "Skanray", "Agappe"],
      roles: ["Application Specialist", "QA/RA Engineer", "Design Engineer"],
      skills: ["Imaging Systems", "Biomedical Sensors", "Regulatory (ISO 13485)"],
    },
    {
      category: "Healthcare IT & Robotics",
      companies: ["Cerner", "Philips", "Wipro GE", "Perfint Healthcare"],
      roles: ["Clinical Engineer", "Software Test Engineer", "Field Engineer"],
      skills: ["MATLAB", "Python", "Biomechanics", "Medical Robotics"],
    },
  ],
  aerospace: [
    {
      category: "Aerospace & Defence",
      companies: ["HAL", "DRDO Labs", "Bharat Electronics", "L&T Defence"],
      roles: ["Design Engineer", "Avionics Engineer", "Structural Analyst"],
      skills: ["CATIA", "ANSYS", "Aerodynamics", "Avionics Systems"],
    },
    {
      category: "Global Aerospace",
      companies: ["Boeing India", "Airbus India", "Collins Aerospace", "Safran"],
      roles: ["Stress Engineer", "Systems Engineer", "Manufacturing Engineer"],
      skills: ["FEA", "CAD (NX/CATIA)", "AS9100", "Composite Materials"],
    },
    {
      category: "Space Tech",
      companies: ["ISRO", "Skyroot Aerospace", "Agnikul Cosmos", "Pixxel"],
      roles: ["Propulsion Engineer", "GNC Engineer", "Embedded Engineer"],
      skills: ["Orbital Mechanics", "Embedded C", "MATLAB", "Control Systems"],
    },
  ],
};

export const TIER_MAP: Record<string, string> = {
  "Semiconductor & VLSI": "Tier 1 · Global MNC",
  "Embedded & Electronics": "Tier 1 · Global MNC",
  "Automation & Industrial": "Tier 1 · Global MNC",
  "Communication & Networks": "Tier 2 · National Leader",
  "Power & Energy": "Tier 1 · Global & PSU",
  "Automation & Drives": "Tier 1 · Global MNC",
  "Electric Vehicles": "Tier 2 · National Leader",
  Renewables: "Tier 2 · National Leader",
  "Automotive & Manufacturing": "Tier 2 · National Leader",
  "Core Engineering Services": "Tier 1 · Global MNC",
  "Heavy Machinery & Energy": "Tier 1 · Global & PSU",
  "HVAC & Product Design": "Tier 2 · National Leader",
  "Construction & Infrastructure": "Tier 2 · National Leader",
  "Design & Consulting": "Tier 1 · Global MNC",
  "PSUs & Government": "Tier 3 · PSU & Govt",
  "Industrial Robotics": "Tier 1 · Global MNC",
  "Automation & Controls": "Tier 1 · Global MNC",
  "AI & Mobile Robotics": "Tier 3 · Emerging",
  "Automation & Manufacturing": "Tier 1 · Global MNC",
  "Automotive Electronics": "Tier 1 · Global MNC",
  "Product & IoT": "Tier 2 · National Leader",
  OEMs: "Tier 2 · National Leader",
  "EV & Mobility": "Tier 3 · Emerging",
  "Component & Tier-1": "Tier 2 · National Leader",
  "Process & Industrial": "Tier 1 · Global MNC",
  "Oil, Gas & Energy": "Tier 2 · National Leader",
  "Automation Solutions": "Tier 1 · Global MNC",
  "Medical Devices": "Tier 1 · Global MNC",
  "Imaging & Diagnostics": "Tier 2 · National Leader",
  "Healthcare IT & Robotics": "Tier 2 · National Leader",
  "Aerospace & Defence": "Tier 3 · PSU & Govt",
  "Global Aerospace": "Tier 1 · Global MNC",
  "Space Tech": "Tier 3 · Emerging",
};

export const INTERVIEW_PREP: { title: string; items: string[] }[] = [
  {
    title: "Core Technical Subjects",
    items: [
      "Revise 3–4 branch core subjects in depth",
      "Practice GATE-level problem solving",
      "Master domain topics — VLSI, machines, SOM, structures",
      "Be able to explain every project on your resume",
    ],
  },
  {
    title: "Problem Solving & Tests",
    items: [
      "Aptitude — quantitative, logical and verbal",
      "Technical MCQs from core subjects",
      "Basic coding round in C or Python",
      "Solve company-specific previous papers",
    ],
  },
  {
    title: "HR & Soft Skills",
    items: [
      "Prepare a crisp 90-second self-introduction",
      "Answer 'why core engineering, why this company'",
      "Show willingness for site or location flexibility",
      "Explain projects clearly with diagrams and results",
    ],
  },
];

export const SKILL_CATEGORIES: { title: string; skills: string[] }[] = [
  {
    title: "Technical Fundamentals",
    skills: ["Engineering Mathematics", "Basic Electronics", "Electrical Fundamentals", "Core Subject Knowledge"],
  },
  { title: "Programming", skills: ["C", "C++", "Python", "Embedded C"] },
  {
    title: "Hardware",
    skills: ["Microcontrollers", "Sensors", "PCB Basics", "Circuit Design"],
  },
  {
    title: "Software Tools",
    skills: ["MATLAB", "Simulink", "Proteus", "AutoCAD", "SolidWorks", "ANSYS", "Revit", "Keil"],
  },
  {
    title: "Advanced Technologies",
    skills: ["IoT", "VLSI", "Embedded Systems", "Robotics", "Automation"],
  },
];

export const ROADMAP = [
  {
    year: "Year 1",
    title: "Foundation Building",
    focus: [
      "Understand Engineering Fundamentals",
      "Learn Basic Programming",
      "Improve Mathematics",
      "Explore Core Engineering Domains",
    ],
    learn: [
      "C Programming Basics",
      "Python Basics",
      "MATLAB Fundamentals",
      "Engineering Drawing",
      "Basic Electronics",
      "Basic Electrical Concepts",
    ],
    activities: ["Join Technical Clubs", "Attend Workshops", "Participate in Competitions", "Build Simple Projects"],
    projects: [
      "Breadboard power supply & basic circuits",
      "Line follower robot (club project)",
      "CAD model of a simple mechanical part",
    ],
    goal: "Build Strong Fundamentals",
  },
  {
    year: "Year 2",
    title: "Technical Skill Development",
    focus: ["Choose a preferred Core Domain", "Learn industry software", "Start technical projects"],
    learn: [
      "Core Subject Fundamentals",
      "Embedded C & Microcontrollers",
      "MATLAB & Simulink",
      "AutoCAD / Proteus (branch-wise)",
      "Data Interpretation Basics",
    ],
    activities: ["Complete Certifications", "Build Mini Projects", "Participate in Hackathons", "Create LinkedIn Profile"],
    projects: [
      "IoT sensor monitoring node (ESP32)",
      "Two-layer PCB designed in Proteus/KiCad",
      "Structural or machine component draft in AutoCAD",
    ],
    goal: "Discover Your Specialization",
  },
  {
    year: "Year 3",
    title: "Industry Specialization",
    focus: [
      "Select a specific career domain — Embedded Systems, VLSI, Robotics, Automation, Electric Vehicles, Manufacturing or Structural Engineering",
      "Learn advanced skills based on the selected specialization",
    ],
    learn: [
      "Advanced domain tools — ANSYS, Revit, ETAP, Verilog, PLC/SCADA (branch-wise)",
      "Industry standards & codes",
      "Version control (Git)",
      "Technical Documentation",
    ],
    activities: [
      "Build Advanced Projects",
      "Apply for Internships",
      "Create Technical Portfolio",
      "Upload Projects to GitHub",
      "Participate in Industry Events",
    ],
    projects: [
      "Flagship domain project — BLDC controller, STAAD Pro building model, PLC automation cell or RTL IP block",
      "Internship project with documented outcomes",
      "GitHub portfolio with 3+ well-documented repos",
    ],
    goal: "Become Industry Ready",
  },
  {
    year: "Year 4",
    title: "Placement Preparation",
    focus: [
      "Core Technical Interview Preparation",
      "Company-specific preparation",
      "Aptitude",
      "Resume",
      "Mock Interviews",
    ],
    learn: ["Core Subject Revision", "Technical Interview Questions", "Aptitude", "Reasoning", "HR Interview Questions"],
    activities: [
      "Resume Ready",
      "Projects Ready",
      "Certifications Ready",
      "Internship Experience",
      "LinkedIn Profile Updated",
      "Technical Skills Verified",
    ],
    projects: [
      "Capstone project with clear industry relevance",
      "Published project report or paper",
      "Polished technical resume & project portfolio",
    ],
    goal: "Get Placed in Your Dream Core Company",
  },
];

export const CAREER_PATHS: { domain: string; steps: string[] }[] = [
  {
    domain: "Embedded Systems",
    steps: ["C Programming", "Embedded C", "Microcontrollers", "ARM", "RTOS", "Build Projects", "Internship", "Core Company Placement"],
  },
  {
    domain: "VLSI / Semiconductor",
    steps: ["Digital Electronics", "Verilog", "SystemVerilog", "CMOS Design", "Physical Design", "Build Projects", "Internship", "Core Company Placement"],
  },
  {
    domain: "Robotics & Automation",
    steps: ["Python", "Sensors & Actuators", "ROS", "PLC & SCADA", "Machine Vision", "Build Projects", "Internship", "Core Company Placement"],
  },
  {
    domain: "Electric Vehicles",
    steps: ["Power Electronics", "MATLAB/Simulink", "Battery Systems", "BMS Design", "Motor Control", "Build Projects", "Internship", "Core Company Placement"],
  },
];

export const PROJECTS = [
  {
    level: "Beginner",
    name: "Smart Street Light",
    skills: ["Arduino", "Sensors"],
    relevance: "Automation & Smart Cities",
  },
  {
    level: "Beginner",
    name: "Automatic Water Level Controller",
    skills: ["Sensors", "Relay Circuits"],
    relevance: "Industrial Instrumentation",
  },
  {
    level: "Intermediate",
    name: "IoT Monitoring System",
    skills: ["ESP32", "Cloud", "Sensors"],
    relevance: "IoT & Industry 4.0",
  },
  {
    level: "Intermediate",
    name: "BLDC Motor Speed Controller",
    skills: ["Power Electronics", "Embedded C"],
    relevance: "Electric Vehicles",
  },
  {
    level: "Advanced",
    name: "Autonomous Robot",
    skills: ["Robotics", "Embedded Systems", "Sensors"],
    relevance: "Robotics & Manufacturing",
  },
  {
    level: "Advanced",
    name: "FPGA-based Signal Processor",
    skills: ["Verilog", "VLSI", "DSP"],
    relevance: "Semiconductor Industry",
  },
];

export const CHECKLIST_ITEMS = [
  "Strong Core Fundamentals",
  "Programming Knowledge",
  "Technical Projects",
  "Certifications",
  "Internship Experience",
  "Resume",
  "LinkedIn Profile",
  "Aptitude Preparation",
  "Mock Interviews",
];
