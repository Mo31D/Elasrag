(function(){
  const saved=localStorage.getItem("orgLang")||"ar";

  const arTerms={
    "Family Institution":"مؤسسة العائلة",
    "Draft v0.1":"مسودة أولى",
    "BOARD":"مجلس الإدارة",
    "EXECUTIVE":"الإدارة التنفيذية",
    "CONTROL":"السيطرة",
    "INCOME":"الدخل",
    "CAPITAL":"رأس المال",
    "OWNER":"المالك",
    "FAMILY":"العائلة",
    "DIRECTOR":"عضو مجلس الإدارة",
    "EMPLOYEE":"الموظف",
    "SHAREHOLDERS":"المساهمون",
    "MANAGEMENT":"الإدارة",
    "Family Council":"مجلس العائلة",
    "Founder Board":"مجلس المؤسس",
    "Professional Board":"مجلس احترافي",
    "Independent NED":"عضو مجلس مستقل غير تنفيذي",
    "WILL":"الوصية",
    "ARTICLES":"النظام الأساسي",
    "LPA":"التوكيل الدائم",
    "GOVERNANCE":"نظام الإدارة",
    "Valuation":"التقييم",
    "CORP":"ضريبة الشركات",
    "IHT":"ضريبة الميراث",
    "CGT":"ضريبة الأرباح الرأسمالية",
    "PROPERTY":"العقار",
    "VALUE":"التقييم",
    "Family Constitution / /org":"دستور العائلة / /org",
    "Articles of Association":"النظام الأساسي للشركة",
    "Shareholders’ Agreement":"اتفاق المساهمين",
    "Will + LPA + Trust deeds":"الوصية + التوكيل الدائم + وثائق الترتيب الائتماني",
    "Board / Employment Policies":"سياسات مجلس الإدارة والتوظيف",
    "ELASRAG FAMILY HOLDINGS LTD":"الشركة الأم لمؤسسة الأسرج",
    "Business A Ltd":"شركة نشاط أ",
    "Business B Ltd":"شركة نشاط ب",
    "Property / Land Ltd":"شركة العقارات والأراضي",
    "SPV when justified":"شركة مستقلة عند الحاجة",
    "Investment Co.":"شركة الاستثمار",
    "Cash / Portfolio":"السيولة ومحفظة الاستثمارات",
    "Family Holdings":"الشركة الأم",
    "VOTE":"التصويت",
    "Class":"نوع السهم",
    "F · Founder":"سهم المؤسس",
    "B · Family Growth":"أسهم نمو العيلة",
    "G · Guardian":"سهم الحماية",
    "M · Management":"أسهم الإدارة",
    "IHT / BR":"ضريبة الميراث / إعفاء الأعمال",
    "Settlements":"قواعد تحويل الدخل داخل العيلة",
    "PSC":"صاحب سيطرة مؤثرة",
    "L1 · EXECUTIVE":"١ · الإدارة اليومية",
    "L2 · BOARD":"٢ · مجلس الإدارة",
    "L3 · OWNERS":"٣ · الملاك",
    "L4 · PROTECTED":"٤ · القرارات المحمية",
    "EXECUTIVE":"الإدارة التنفيذية",
    "PROTECTED":"قرار محمي",
    "SHARES":"حقوق الأسهم",
    "R1":"١",
    "R2":"٢",
    "R3":"٣",
    "R4":"٤",
    "I · FOUNDER":"المرحلة الأولى · المؤسس",
    "II · SIBLINGS":"المرحلة الثانية · الإخوة",
    "III · COUSINS+":"المرحلة الثالثة · الأجيال الأوسع",
    "CEO":"المدير التنفيذي",
    "Director":"عضو مجلس الإدارة",
    "01 · OWNERSHIP":"١ · الملكية",
    "02 · CONTROL":"٢ · السيطرة",
    "03 · BOARD":"٣ · مجلس الإدارة",
    "04 · EXECUTIVE":"٤ · الإدارة التنفيذية",
    "ECONOMIC":"الاستفادة الاقتصادية",
    "GOVERNANCE":"الإدارة والرقابة",
    "Articles":"النظام الأساسي",
    "Corporation Tax":"ضريبة الشركات",
    "i":"!"
  };

  const networkLabels={
    "purpose/":"01 · الهدف والاستمرار",
    "structure/":"02 · شكل المؤسسة والشركات",
    "ownership/":"03 · الملكية وأنواع الأسهم",
    "control/":"04 · مين يقرر وإيه اللي لازم يتحمى",
    "capital/":"05 · الأرباح واستخدام الفلوس",
    "risk/":"06 · الاستثمار والديون والمخاطر",
    "governance/":"07 · إدارة شؤون العيلة",
    "board/":"08 · مجلس الإدارة وإدارة الشغل",
    "family-employment/":"09 · شغل أفراد العيلة",
    "succession/":"10 · مين يكمل القيادة بعد المؤسس",
    "inheritance/":"11 · الوفاة والعجز والميراث",
    "marriage/":"12 · الزواج والطلاق وحدود العيلة",
    "exit/":"13 · البيع والسيولة والتقييم",
    "legal-tax/":"14 · القانون والضرائب وتغيير القواعد"
  };

  function translateStaticTerms(lang){
    document.querySelectorAll("span,strong,b,small,h3,td,th").forEach(el=>{
      if(el.childElementCount) return;
      if(!el.dataset.orgOriginal) el.dataset.orgOriginal=el.textContent.trim();
      const original=el.dataset.orgOriginal;
      if(lang==="ar" && arTerms[original]) el.textContent=arTerms[original];
      else if(lang==="en" && el.dataset.orgOriginal) el.textContent=el.dataset.orgOriginal;
    });
    const brandSub=document.querySelector(".brand span");
    if(brandSub){
      if(!brandSub.dataset.orgOriginal) brandSub.dataset.orgOriginal=brandSub.textContent.trim();
      brandSub.textContent=lang==="ar"?"مؤسسة العائلة":brandSub.dataset.orgOriginal;
    }
    const status=document.querySelector(".status .label");
    if(status){
      if(!status.dataset.orgOriginal) status.dataset.orgOriginal=status.textContent.trim();
      status.textContent=lang==="ar"?"مسودة أولى":status.dataset.orgOriginal;
    }

    document.querySelectorAll(".network .nodes a").forEach(a=>{
      if(!a.dataset.orgOriginal) a.dataset.orgOriginal=a.textContent.trim();
      if(lang==="ar"){
        const href=(a.getAttribute("href")||"").replace("../","");
        const key=Object.keys(networkLabels).find(k=>href.endsWith(k));
        if(key) a.textContent=networkLabels[key];
        else if(a.dataset.orgOriginal==="Conflict") a.textContent="حل الخلافات";
      } else {
        a.textContent=a.dataset.orgOriginal;
      }
    });

    document.querySelectorAll(".sources a").forEach(a=>{
      if(!a.dataset.orgOriginal) a.dataset.orgOriginal=a.textContent.trim();
      if(lang==="ar"){
        const href=a.getAttribute("href")||"";
        if(href.includes("legislation.gov.uk")) a.textContent="النص الرسمي للقانون البريطاني";
        else if(href.includes("supremecourt.uk")) a.textContent="حكم المحكمة العليا البريطانية";
        else if(href.includes("lawcom.gov.uk")) a.textContent="هيئة إصلاح القانون البريطانية";
        else if(href.includes("ifc.org")) a.textContent="دليل دولي لإدارة الشركات العائلية";
        else if(href.includes("gov.uk")) a.textContent="مصدر حكومي بريطاني رسمي";
        else a.textContent="المصدر الرسمي";
      } else {
        a.textContent=a.dataset.orgOriginal;
      }
    });
  }

  function setLang(lang){
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    localStorage.setItem("orgLang",lang);
    document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
    const title=document.querySelector("title");
    if(title && title.dataset.ar) title.textContent=lang==="ar"?title.dataset.ar:title.dataset.en;
    translateStaticTerms(lang);
  }

  document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
  setLang(saved);
})();