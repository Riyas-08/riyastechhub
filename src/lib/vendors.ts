export type Vendor = {
  id: string;
  name: string;
  note: string;
  factor: number;
  search: (q: string) => string;
};

export const VENDORS: Vendor[] = [
  {
    id: "robu",
    name: "Robu.in",
    note: "Fast Pune dispatch, huge robotics catalogue",
    factor: 1,
    search: (q) => `https://robu.in/?s=${encodeURIComponent(q)}&post_type=product`,
  },
  {
    id: "amazon",
    name: "Amazon.in",
    note: "Next-day delivery, mixed sellers",
    factor: 1.18,
    search: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q + " electronics component")}`,
  },
  {
    id: "evelta",
    name: "Evelta",
    note: "Genuine branded ICs and modules",
    factor: 1.09,
    search: (q) => `https://evelta.com/search/?q=${encodeURIComponent(q)}`,
  },
  {
    id: "probots",
    name: "Probots",
    note: "Strong on motors, drivers and dev boards",
    factor: 1.04,
    search: (q) => `https://probots.co.in/?s=${encodeURIComponent(q)}&post_type=product`,
  },
  {
    id: "thinkrobotics",
    name: "ThinkRobotics",
    note: "Sensors, IoT modules, student kits",
    factor: 1.12,
    search: (q) => `https://thinkrobotics.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "electronicscomp",
    name: "ElectronicsComp",
    note: "Cheapest for passives and bulk parts",
    factor: 0.93,
    search: (q) =>
      `https://www.electronicscomp.com/catalogsearch/result/?q=${encodeURIComponent(q)}`,
  },
];

export const vendorPrice = (base: number, factor: number) => Math.max(3, Math.round(base * factor));

export const DISTRICTS = [
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode",
  "Kallakurichi","Kancheepuram","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam",
  "Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivagangai",
  "Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur",
  "Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar",
];

export const DEPARTMENTS = [
  "ECE — Electronics & Communication",
  "EEE — Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Mechatronics",
  "Instrumentation & Control",
  "Robotics & Automation",
  "Biomedical Engineering",
  "Electronics & Instrumentation",
];

export const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "12th Grade / School Student",
];