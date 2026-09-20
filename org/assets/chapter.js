
(function(){
  const saved=localStorage.getItem("orgLang")||"ar";
  function setLang(lang){
    document.documentElement.lang=lang;
    document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    localStorage.setItem("orgLang",lang);
    document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
    const title=document.querySelector("title");
    if(title && title.dataset.ar) title.textContent=lang==="ar"?title.dataset.ar:title.dataset.en;
  }
  document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
  setLang(saved);
})();
