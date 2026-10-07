import { REQUIRED_COURSES } from "../../wf/model.js";
export const OWNER_PROFILE = {
  "displayName": "Mo",
  "role": "Team Member – Filling Station (Nights)",
  "site": "Tebay Services",
  "manager": "Emma Cash",
  "managerEmail": "emma.cash@tebayservices.com",
  "startDate": "2026-10-07",
  "shiftDays": "Friday & Saturday",
  "shiftStart": "22:45",
  "shiftEnd": "07:15",
  "hours": "17",
  "hourlyRate": "14.25",
  "paidBreak": "Paid",
  "annualHoliday": "11.5",
  "minibusNote": "Minibus unavailable for Friday/Saturday night shifts.",
  "firstDayTime": "09:30–15:30",
  "firstDayLocation": "Westmorland Hotel, Northbound",
  "firstDayPostcode": "CA10 3SB"
};
const COMPLETED_COURSES = [
  {
    "id": "completed-1",
    "titleEN": "Colleague Meal Procedure",
    "titleAR": "إجراء وجبات الموظفين",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-2",
    "titleEN": "NEW Seasonal Cakes from Westmorland Kitchen – Tebay…",
    "titleAR": "الكيك الموسمي الجديد من مطبخ Westmorland – Tebay",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-3",
    "titleEN": "How to… Learn Page",
    "titleAR": "طريقة استخدام صفحة التعلّم",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-4",
    "titleEN": "How to… Add Content",
    "titleAR": "طريقة إضافة المحتوى",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-5",
    "titleEN": "How to… Homepage & Explore",
    "titleAR": "طريقة استخدام الصفحة الرئيسية والاستكشاف",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-6",
    "titleEN": "My Westmorland Learn",
    "titleAR": "منصة My Westmorland Learn",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-7",
    "titleEN": "Cookery School Booklet",
    "titleAR": "كتيّب مدرسة الطبخ",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-8",
    "titleEN": "Careers Book",
    "titleAR": "كتيّب المسار الوظيفي",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-9",
    "titleEN": "Ops Development Road Map",
    "titleAR": "خريطة طريق تطوير العمليات",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-10",
    "titleEN": "Our Family Values",
    "titleAR": "قيم عائلة Westmorland",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-11",
    "titleEN": "Our Antlers Story",
    "titleAR": "قصة Antlers",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-12",
    "titleEN": "Our sites",
    "titleAR": "مواقعنا",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-13",
    "titleEN": "Welcome Antlers – Colleague Overview",
    "titleAR": "Welcome Antlers – نظرة عامة للموظف",
    "due": "",
    "status": "completed",
    "required": false
  },
  {
    "id": "completed-14",
    "titleEN": "Launch Pack 'Food To Go' & 'Salads' Oct 26",
    "titleAR": "حزمة إطلاق «الأكل الجاهز والسلطات» – أكتوبر 2026",
    "due": "",
    "status": "completed",
    "required": false
  }
];
export function initialCompanion(owner) { return {tasks:[],courses:owner ? [...REQUIRED_COURSES.map((course,index)=>({...course,due:index<3?"2026-10-16":index===3?"2026-10-18":"2026-11-01",status:index===0?"in-progress":"not-started"})),...COMPLETED_COURSES].map(course=>({...course})) : REQUIRED_COURSES.map(course=>({...course}))}; }
