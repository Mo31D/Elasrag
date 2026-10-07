export const REQUIRED_COURSES = [
  {
    "id": "required-1",
    "titleEN": "Welcome Antlers – Colleague Induction",
    "titleAR": "تعريف الزملاء الجدد",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-2",
    "titleEN": "Food Safety Training",
    "titleAR": "سلامة الغذاء",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-3",
    "titleEN": "Health & Safety Training",
    "titleAR": "الصحة والسلامة",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-4",
    "titleEN": "Allergy Awareness Recap",
    "titleAR": "مراجعة الوعي بالحساسية",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-5",
    "titleEN": "Customer Experience – The Westmorland Way",
    "titleAR": "تجربة العميل – طريقة Westmorland",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-6",
    "titleEN": "CBE Procedures – Filling Station Colleagues",
    "titleAR": "إجراءات CBE – موظفي محطة الوقود",
    "due": "",
    "status": "not-started",
    "required": true
  },
  {
    "id": "required-7",
    "titleEN": "Prevention of Sexual Harassment",
    "titleAR": "منع التحرش الجنسي",
    "due": "",
    "status": "not-started",
    "required": true
  }
];
export function initialCompanion() { return {tasks:[],courses:REQUIRED_COURSES.map(course=>({...course}))}; }
