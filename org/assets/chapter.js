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
    "Board / Employment Policies":"سياسات مجلس الإدارة والتوظيف"
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