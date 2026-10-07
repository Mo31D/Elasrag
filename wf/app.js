import { TRANSLATIONS } from "./content.js";
import { REQUIRED_COURSES, initialCompanion, WEEKDAYS, shiftDays, shiftState, upcomingAlerts } from "./model.js";
(() => {
  if(location.protocol!=="https:")return;
  const META_KEY = "wf-vault-meta-v1";
  const DATA_KEY = "wf-vault-data-v1";
  const LANG_KEY = "wf-language-v1";
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const CANONICAL_ORIGIN = "https://mo.elasrag.com";
  const PREVIOUS_ORIGINS = new Set(["https://www.elasrag.com", "https://elasrag.com"]);
  const migrationMode = PREVIOUS_ORIGINS.has(location.origin) && new URLSearchParams(location.search).get("migrate") === "1";
  if (PREVIOUS_ORIGINS.has(location.origin) && navigator.onLine && (!migrationMode || !(localStorage.getItem(META_KEY) && localStorage.getItem(DATA_KEY)))) return;
  const API_BASE = (location.origin === CANONICAL_ORIGIN ? "" : CANONICAL_ORIGIN) + "/api";
  const PROFILE_KEYS = ["colleagueNumber", "kioskId", "kioskPin", "workPin", "thriveUsername", "displayName", "role", "site", "manager", "managerEmail", "startDate", "shiftDays", "shiftStart", "shiftEnd", "hours", "hourlyRate", "paidBreak", "annualHoliday", "minibusNote"];
  let safeWorkerReady = Promise.resolve(true);
  let authenticated = false;
  let serverSessionKnown = false;
  let account = null;
  let authMode = localStorage.getItem("wf-account-hint") ? "login" : "owner";
  let editingCourseId = null;
  let editingTaskId = null;
  const returnTargets = new Map();
  let privateData = null;
  let navigationVersion = 0;
  let activePage = "home";
  let editingIndex = null;
  let saving = false;
  let vaultItems = [];
  let pendingPrivatePage = null;
  let pendingDraft = null;
  const conflictedEditors = new Set();
  const PROTECTED_PAGES = new Set(["details","vault","tasks"]);
  let lang = new URLSearchParams(location.search).get("lang") || localStorage.getItem(LANG_KEY) || "ar";

  const T = TRANSLATIONS;
  const $ = id => document.getElementById(id);
  const t = key => (T[lang] && T[lang][key]) || key;
  const fromB64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));

  function applyLanguage(next, preservePosition = true) {
    const reading = preservePosition ? captureReadingPosition() : null;
    const focusId = document.activeElement?.id;
    lang = next === "en" ? "en" : "ar";
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = t("appTitle");
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });
    document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
    document.querySelectorAll(".official").forEach(el => {
      el.style.display = "none";
    });
    document.querySelectorAll('[data-weekday]').forEach(el=>el.textContent=WEEKDAYS[Number(el.dataset.weekday)][lang==='ar'?1:0]);
    updateOnline();
    updateTrainingDeadlines();
    renderVault();
    renderPrivateProfile();
    renderCompanion();
    document.querySelectorAll("[data-placeholder]").forEach(el => el.placeholder = t(el.dataset.placeholder));
    $('homeSearch').setAttribute('aria-label',t('findReference'));
    document.querySelectorAll("[data-error-key]").forEach(el => { el.textContent = el.dataset.errorKey ? t(el.dataset.errorKey) : ""; });
    if (focusId && $(focusId)) $(focusId).focus({preventScroll:true});
    $("logoutBtn").setAttribute("aria-label",t("logout"));$("logoutBtn").title=t("logout");
    $("otherAccountBtn").textContent=t(authMode==="owner"?"otherAccount":"ownerAccount");
    updateBackButton();
    restoreReadingPosition(reading);
  }

  async function deriveKey(passphrase, salt) {
    const base = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      {name:"PBKDF2", salt, iterations:250000, hash:"SHA-256"},
      base,
      {name:"AES-GCM", length:256},
      false,
      ["encrypt","decrypt"]
    );
  }

  async function decryptText(payload, key) {
    const plain = await crypto.subtle.decrypt({name:"AES-GCM", iv:fromB64(payload.iv)}, key, fromB64(payload.data));
    return dec.decode(plain);
  }

  function errorKey(error) {
    if(error.stage==="data")return "privateDataError";if(error.stage==="session")return "sessionError";
    return error.status === 400 ? 'invalidEntry' : error.status === 401 ? "wrongPass" : error.status === 429 ? "tooMany" : error.status === 409 ? "conflict" : "apiError";
  }

  function message(id, key) {
    const el = $(id);
    el.dataset.errorKey = key || "";
    el.textContent = key ? t(key) : "";
  }

  async function api(path, options = {}) {
    if (!(await safeWorkerReady)) throw new Error();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API_BASE + path, {
        ...options, credentials: "include", cache: "no-store", redirect: "error",
        signal: controller.signal,
        headers: { ...(options.body ? { "content-type": "application/json" } : {}), ...options.headers },
      });
      if (!response.ok) throw Object.assign(new Error(), { status: response.status });
      return { body: await response.json(), revision: response.headers.get("etag") };
    } finally { clearTimeout(timer); }
  }

  function clearPrivateData() {
    authenticated = false;
    account = null;
    privateData = null;
    vaultItems = [];
    editingIndex = null; editingTaskId = null;
    conflictedEditors.clear();
    $("vaultList").replaceChildren();
    document.querySelectorAll("[data-private]").forEach(el => { el.textContent = ""; el.closest(".row").hidden = true; });
    document.querySelectorAll("[data-private-copy]").forEach(el => delete el.dataset.copy);
    ["secretDialog", "profileDialog", "migrationDialog", "courseDialog", "recoveryDialog"].forEach(id => { if ($(id).open) $(id).close(); });
    ["secretLabel", "secretValue", "secretNote", "oldPass", "passInput", "courseEN", "courseAR", "courseDue", "newRecoveryCode", "taskInput"].forEach(id => $(id).value = "");
    $("profileFields").replaceChildren();
    document.querySelectorAll("[data-private-card]").forEach(el => el.hidden = true);
    document.querySelectorAll("[data-job]").forEach(el => { el.textContent = ""; const row = el.closest(".row"); if (row) row.hidden = true; });
    document.querySelectorAll("[data-profile-content]").forEach(card=>card.hidden=[...card.querySelectorAll(".row")].every(row=>row.hidden));
    document.querySelectorAll("[data-job-copy]").forEach(el => delete el.dataset.copy);
    $("travelNote").hidden=true;
    renderCompanion();
    $("logoutBtn").classList.add("hidden");
  }

  function rememberDraft() {
    if(!authenticated || !account)return;
    const task=$('taskInput').value;
    const profileOpen=$('profileDialog').open;
    const courseOpen=$('courseDialog').open;
    const secretOpen=$('secretDialog').open;
    if(!task && !profileOpen && !courseOpen && !secretOpen)return;
    pendingDraft={accountId:account.id,task,editingTaskId,
      profile:profileOpen?{
        values:Object.fromEntries([...document.querySelectorAll('[data-profile]')].map(input=>[input.dataset.profile,input.value])),
        original:{...privateData.profile},
        days:[...document.querySelectorAll('[data-shift-day]:checked')].map(input=>input.value),
        expanded:[...$('profileFields').querySelectorAll('details')].map(group=>group.open)
      }:null,
      course:courseOpen?{id:editingCourseId,original:privateData.companion.courses.find(item=>item.id===editingCourseId),values:Object.fromEntries(['courseEN','courseAR','courseDue','courseStatus'].map(id=>[id,$(id).value])),required:$('courseRequired').checked}:null,
      secret:secretOpen?{item:editingIndex==null?null:vaultItems[editingIndex],values:['secretLabel','secretValue','secretNote'].map(id=>$(id).value)}:null};
  }

  function restoreDraft() {
    if(!pendingDraft)return;
    const draft=pendingDraft;pendingDraft=null;
    if(draft.accountId!==account?.id)return;
    $('taskInput').value=draft.task;
    editingTaskId=draft.editingTaskId && privateData.companion.tasks.some(item=>item.id===draft.editingTaskId)?draft.editingTaskId:null;
    if(draft.profile){
      editProfile();
      document.querySelectorAll('[data-profile]').forEach(input=>{
        const key=input.dataset.profile;
        if(draft.profile.values[key] !== (draft.profile.original[key]??''))input.value=draft.profile.values[key]??'';
      });
      if(JSON.stringify(draft.profile.days.slice().sort())!==JSON.stringify(shiftDays(draft.profile.original.shiftDays).map(String).sort()))
        document.querySelectorAll('[data-shift-day]').forEach(input=>{input.checked=draft.profile.days.includes(input.value);});
      $('profileFields').querySelectorAll('details').forEach((group,index)=>{group.open=Boolean(draft.profile.expanded[index]);});
    }else if(draft.course){
      const found=privateData.companion.courses.some(item=>item.id===draft.course.id);
      openCourse(found?draft.course.id:null);
      const keys={courseEN:'titleEN',courseAR:'titleAR',courseDue:'due',courseStatus:'status'};
      for(const [id,value] of Object.entries(draft.course.values))if(!draft.course.original || value!==draft.course.original[keys[id]])$(id).value=value;
      if(!draft.course.original || draft.course.required!==draft.course.original.required)$('courseRequired').checked=draft.course.required;
      if(draft.course.id && !found){conflictedEditors.add('course');message('courseError','conflict');}
    }else if(draft.secret){
      const index=draft.secret.item?vaultItems.findIndex(item=>JSON.stringify(item)===JSON.stringify(draft.secret.item)):-1;
      openEntry(index<0?null:index);
      ['secretLabel','secretValue','secretNote'].forEach((id,i)=>$(id).value=draft.secret.values[i]);
      if(draft.secret.item && index<0){conflictedEditors.add('secret');message('secretError','conflict');}
    }
  }

  function renderPrivateProfile() {
    document.querySelectorAll("[data-private]").forEach(el => {
      const value = privateData?.profile?.[el.dataset.private] || (el.dataset.private === "thriveUsername" ? privateData?.profile?.colleagueNumber : "") || "";
      el.textContent = value;
      el.closest(".row").hidden = !value;
    });
    document.querySelectorAll("[data-private-copy]").forEach(el => {
      const value = privateData?.profile?.[el.dataset.privateCopy] || (el.dataset.privateCopy === "thriveUsername" ? privateData?.profile?.colleagueNumber : "");
      if (value) el.dataset.copy = value;
      else delete el.dataset.copy;
    });
    document.querySelectorAll("[data-private-card]").forEach(el => el.hidden = Array.from(el.querySelectorAll(".row")).every(row => row.hidden));
    document.querySelectorAll("[data-job]").forEach(el => {
      const value = jobValue(el.dataset.job);
      el.textContent = value;
      const row = el.closest(".row"); if (row) row.hidden = !value;
      else el.hidden = !value;
    });
    document.querySelectorAll("[data-profile-content]").forEach(card=>card.hidden=[...card.querySelectorAll(".row")].every(row=>row.hidden));
    $("travelNote").hidden=!jobValue("minibusNote");
    document.querySelectorAll("[data-job-copy]").forEach(el => { const value = privateData?.profile[el.dataset.jobCopy]; if (value) el.dataset.copy = value; else delete el.dataset.copy; });
  }

  function openPrivateGate(pageId) {
    pendingPrivatePage = pageId || "details";
    rememberDraft();
    clearPrivateData();
    displayPage("home");
    message("unlockError", "");
    $("lockScreen").classList.remove("hidden");
    setAuthMode(authMode);
    $("passInput").focus();
  }

  function closePrivateGate() {
    navigationVersion++;
    $("lockScreen").classList.add("hidden");
    $("passInput").value = "";
    pendingPrivatePage = null;
    displayPage("home");
    history.replaceState(null, "", "#home");
  }

  function setAuthMode(mode) {
    authMode = mode;
    const owner = mode === "owner";
    $("usernameField").classList.toggle("hidden", owner || serverSessionKnown);
    $("passwordField").hidden=serverSessionKnown;
    $("unlockIntro").dataset.i18n=serverSessionKnown?"retryIntro":"enterPass";$("unlockIntro").textContent=t($("unlockIntro").dataset.i18n);
    $("recoveryField").classList.toggle("hidden", mode !== "recover");
    $("passwordHint").classList.toggle("hidden", mode !== "register" && mode !== "recover");
    $("recoverBtn").classList.toggle("hidden", owner);
    $("usernameInput").value = owner ? "" : $("usernameInput").value || localStorage.getItem("wf-account-hint") || "";
    $("passInput").autocomplete = mode === "register" || mode === "recover" ? "new-password" : "current-password";
    $("unlockBtn").dataset.i18n = serverSessionKnown ? "retry" : mode === "register" ? "createAccount" : mode === "recover" ? "recoverAccount" : "unlock";
    $("unlockBtn").textContent = t($("unlockBtn").dataset.i18n);
    $("otherAccountBtn").textContent = t(owner ? "otherAccount" : "ownerAccount");
    $("passInput").value = "";
    $("recoveryInput").value = "";
    message("unlockError", "");
  }

  async function loadPrivateSession(version = navigationVersion) {
    const session = await api("/session");
    if (version !== navigationVersion) return false;
    serverSessionKnown=Boolean(session.body.authenticated);
    if (!serverSessionKnown) return false;
    let loaded;try{loaded=await api("/private");}catch(error){error.stage="data";throw error;}
    if (version !== navigationVersion) return false;
    if (!loaded.body.data?.companion || !loaded.revision || !session.body.account) throw new Error();
    privateData = loaded.body.data;
    account = session.body.account;
    authenticated = true;
    vaultItems = privateData.items;
    renderPrivateProfile(); renderVault(); renderCompanion();
    restoreDraft();
    $("importLegacyBtn").classList.toggle("hidden", account.id !== "owner" || !(localStorage.getItem(META_KEY) && localStorage.getItem(DATA_KEY)));
    $("previousVaultLink").classList.toggle("hidden", account.id !== "owner" || location.origin !== CANONICAL_ORIGIN);
    $("returnCompanion").classList.toggle("hidden", !migrationMode);
    $("logoutBtn").classList.remove("hidden");
    return true;
  }

  async function unlock() {
    if ($("unlockBtn").disabled) return;
    const destination = pendingPrivatePage || "details";
    const version = navigationVersion;
    const password = $("passInput").value;
    const name = $("usernameInput").value.trim().toLowerCase();
    if (!serverSessionKnown && authMode !== "owner" && !/^[a-z0-9][a-z0-9._-]{2,39}$/.test(name)) return message("unlockError", "accountNameHint");
    if (!serverSessionKnown && ["register","recover"].includes(authMode) && password.length < 12) return message("unlockError", "newPasswordHint");
    message("unlockError", ""); $("unlockBtn").disabled = true;
    try {
      const path = authMode === "register" ? "/register" : authMode === "recover" ? "/recover" : "/login";
      const retrying=serverSessionKnown;
      const result = retrying ? {body:{}} : await api(path, { method:"POST", body:JSON.stringify({ password, ...(authMode !== "owner" ? {username:name} : {}), ...(authMode === "recover" ? {recoveryCode:$("recoveryInput").value.trim()} : {}) }) });
      if (version !== navigationVersion) return;
      if(!retrying){if (authMode === "owner") localStorage.removeItem("wf-account-hint"); else localStorage.setItem("wf-account-hint", name);}
      $("passInput").value = ""; $("recoveryInput").value = "";
      if (!(await loadPrivateSession(version))) throw Object.assign(new Error(), {stage:"session"});
      await showPage(destination);
      if (result.body.recoveryCode && authenticated) {
        $("newRecoveryCode").value = result.body.recoveryCode;
        $("recoveryDialog").showModal();
      }
    } catch (error) {
      if (version === navigationVersion || !authenticated){setAuthMode(authMode);message("unlockError", authMode === "register" && error.status === 409 ? "accountUnavailable" : errorKey(error));}
    } finally { $("unlockBtn").disabled = false; }
  }

  function displayPage(id) {
    const changed = activePage !== id;
    activePage = id;
    document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === id));
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.page === (["tasks","training"].includes(id) ? id : "home")));
    document.querySelector('.emergency-strip').hidden=id==='home';
    if(changed)window.scrollTo({top:0, behavior:"auto"});
    updateBackButton();
  }

  function updateBackButton() {
    const button=$(activePage)?.querySelector('[data-back]');
    if(!button)return;
    const target=(returnTarget(activePage).route).split('/')[0];
    const label={home:'home',training:'trainingNav',tasks:'myTasks',fire:'fire',benefits:'benefits',uniform:'uniformDress',access:'accountHelp',details:'workDetails',vault:'privateVault'}[target] || 'home';
    button.textContent=(lang==='ar'?'→ ':'← ')+t(label);
  }

  function returnTarget(page) {
    return returnTargets.get(page) || (history.state?.wfPage===page && history.state.wfFrom ? {route:history.state.wfFrom} : null) || {route:'home'};
  }

  function selectTab(page,name,updateHistory=false){
    if(!page?.querySelector(`[data-tab="${name}"]`))return;
    page.querySelectorAll("[data-tab]").forEach(button=>{const selected=button.dataset.tab===name;button.setAttribute("aria-selected",String(selected));button.tabIndex=selected?0:-1;});
    page.querySelectorAll("[data-tab-panel]").forEach(panel=>panel.hidden=panel.dataset.tabPanel!==name);
    if(updateHistory)history.replaceState(history.state,"","#"+page.id+"/"+name);
  }
  document.addEventListener("keydown",event=>{const tab=event.target.closest?.("[data-tab]");if(!tab || !["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;event.preventDefault();const tabs=[...tab.parentElement.querySelectorAll("[data-tab]")].filter(button=>!button.hidden && !button.disabled);let index=tabs.indexOf(tab);if(event.key==="Home")index=0;else if(event.key==="End")index=tabs.length-1;else index=(index+(event.key==="ArrowRight"?(lang==="ar"?-1:1):(lang==="ar"?1:-1))+tabs.length)%tabs.length;tabs[index].click();tabs[index].focus();});
  async function showPage(id, historyMode = "push") {
    const [routePage,routeTab]=String(id).split("/");id=routePage;
    if (!$(id)?.classList.contains("page")) id = "home";
    const source=activePage;
    const selected=$(source)?.querySelector('[data-tab][aria-selected="true"]')?.dataset.tab;
    const previous={route:source+(selected?'/'+selected:''),reading:captureReadingPosition()};
    const version = ++navigationVersion;
    message("privateMessage", "");
    if (PROTECTED_PAGES.has(id)) {
      try {
        if (!authenticated && !(await loadPrivateSession(version))) {
          if (version === navigationVersion) openPrivateGate(id);
          return;
        }
        if (version !== navigationVersion) return;
        $("lockScreen").classList.add("hidden"); $("passInput").value = ""; pendingPrivatePage = null;
      } catch (error) {
        if (version !== navigationVersion) return;
        openPrivateGate(id); message("unlockError", error.status === 401 ? "" : errorKey(error)); return;
      }
    } else { $("lockScreen").classList.add("hidden"); pendingPrivatePage = null; }
    displayPage(id);
    if(routeTab)selectTab($(id),routeTab);
    if(historyMode==='push' && id!==source) returnTargets.set(id,previous);
    updateBackButton();
    const tab=$(id).querySelector('[data-tab][aria-selected="true"]')?.dataset.tab;const hash=id==="home"?"":"#"+id+(tab?"/"+tab:"");
    if(location.hash!==hash)history[historyMode === "replace" ? "replaceState" : "pushState"](
      historyMode==='push' ? {wfPage:id,wfFrom:previous.route} : history.state?.wfPage===id ? history.state : null,
      "",hash || location.pathname+location.search);
  }

  function privateChanges(before, proposed) {
    const changes=[];
    const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    for(const key of new Set([...Object.keys(before.profile),...Object.keys(proposed.profile)])) {
      const old=before.profile[key]??null, after=proposed.profile[key]??null;
      if(old!==after)changes.push({section:'profile',key,before:old,after});
    }
    for(const section of ['tasks','courses']) {
      const original=before.companion[section], updated=proposed.companion[section];
      for(const old of original) {
        const next=updated.find(item=>item.id===old.id);
        if(!next){changes.push({section,type:'remove',id:old.id,before:old});continue;}
        const fields={};
        for(const key of Object.keys(old))if(key!=='id' && !same(old[key],next[key]))fields[key]={before:old[key],after:next[key]};
        if(Object.keys(fields).length)changes.push({section,type:'update',id:old.id,fields});
      }
      for(const item of updated.filter(item=>!original.some(old=>old.id===item.id)))changes.push({section,type:'add',after:item});
    }
    const original=before.items,updated=proposed.items;
    if(!same(original,updated)) {
      if(updated.length>=original.length && original.every((item,index)=>same(item,updated[index]))) {
        for(const item of updated.slice(original.length))changes.push({section:'items',type:'add',after:item});
      } else if(updated.length===original.length) {
        const indices=original.flatMap((item,index)=>same(item,updated[index])?[]:[index]);
        if(indices.length!==1)throw Object.assign(new Error(),{status:400});
        const index=indices[0];changes.push({section:'items',type:'update',index,before:original[index],after:updated[index]});
      } else if(updated.length===original.length-1) {
        const index=original.findIndex((_,i)=>original.filter((__,j)=>j!==i).every((item,j)=>same(item,updated[j])));
        if(index<0)throw Object.assign(new Error(),{status:400});
        changes.push({section:'items',type:'remove',index,before:original[index]});
      } else throw Object.assign(new Error(),{status:400});
    }
    return changes;
  }
  async function persistVault(nextItems, nextProfile = privateData?.profile, nextCompanion = privateData?.companion) {
    if (!authenticated || !privateData || saving) throw new Error();
    if (nextItems.length > 200 || nextItems.some(item => item.label.length > 200 || item.value.length > 4096 || item.note.length > 4096)) {
      throw Object.assign(new Error(), { status: 400 });
    }
    const mutationAccount=account?.id;
    saving = true;
    try {
      const before=privateData;
      const proposed = { version: 1, profile: nextProfile, items: nextItems, companion: nextCompanion };
      const changes=privateChanges(before,proposed);
      if(!changes.length)return true;
      const result=await api("/private/changes",{method:"POST",body:JSON.stringify({changes})});
      if (mutationAccount !== account?.id || !authenticated) return false;
      if (!result.body.data?.companion || !result.revision) throw new Error();
      privateData = result.body.data;
      vaultItems = privateData.items;
      saving=false;
      message("privateMessage", "");
      renderPrivateProfile();
      renderVault();
      renderCompanion();
      return true;
    } catch (error) {
      if (error.status === 409 && mutationAccount === account?.id && authenticated) {
        for(const [id,button] of [['profileDialog','profile'],['secretDialog','secret'],['courseDialog','course']])if($(id).open)conflictedEditors.add(button);
        try {
          const latest = await api('/private');
          if (mutationAccount === account?.id && authenticated && latest.body.data?.companion) {
            privateData = latest.body.data;
            vaultItems = privateData.items;
            renderPrivateProfile();renderVault();renderCompanion();
          }
        } catch {}
      }
      if (error.status === 401 && mutationAccount===account?.id) {
        const destination = PROTECTED_PAGES.has(activePage) ? activePage : "vault";
        navigationVersion++;
        openPrivateGate(destination);
      }
      throw error;
    } finally { saving = false; }
  }

  async function logout() {
    serverSessionKnown=false;
    navigationVersion++;
    pendingDraft=null;
    clearPrivateData();
    $("lockScreen").classList.add("hidden");
    pendingPrivatePage = null;
    returnTargets.clear();
    displayPage("home");
    history.replaceState(null, "", location.pathname+location.search);
    try { await api("/logout", { method: "POST" }); message("privateMessage", ""); }
    catch { message("privateMessage", "logoutFailed"); $("logoutBtn").classList.remove("hidden"); }
  }

  function renderVault() {
    const host = $("vaultList");
    if (!host) return;
    const revealed = new Set(Array.from(host.querySelectorAll(".secret:not(.masked)")).map(el => el.dataset.entry));
    host.replaceChildren();
    if (!vaultItems.length) {
      const p = document.createElement("p");
      p.className = "tiny";
      p.textContent = t("noPrivateEntries");
      host.appendChild(p);
      return;
    }
    vaultItems.forEach((item, index) => {
      const wrap = document.createElement("div");
      wrap.className = "vault-item";
      const top = document.createElement("div");
      top.className = "vault-top";
      const label = document.createElement("div");
      label.className = "vault-label";
      label.textContent = item.label;
      top.appendChild(label);
      wrap.appendChild(top);

      const secret = document.createElement("div");
      secret.className = revealed.has(String(index)) ? "secret" : "secret masked";
      secret.dataset.entry = String(index);
      secret.textContent = item.value;
      wrap.appendChild(secret);

      if (item.note) {
        const note = document.createElement("div");
        note.className = "tiny";
        note.style.marginTop = "7px";
        note.textContent = item.note;
        wrap.appendChild(note);
      }

      const actions = document.createElement("div");
      actions.className = "mini-actions";
      const reveal = document.createElement("button");
      reveal.textContent = t(secret.classList.contains("masked") ? "reveal" : "hide");
      reveal.addEventListener("click", () => {
        const masked = secret.classList.toggle("masked");
        reveal.textContent = masked ? t("reveal") : t("hide");
      });
      const copy = document.createElement("button");
      copy.textContent = t("copy");
      copy.addEventListener("click", async () => {
        await navigator.clipboard.writeText(item.value);
        copy.textContent = t("copied");
        setTimeout(() => copy.textContent = t("copy"), 1000);
      });
      const del = document.createElement("button");
      del.textContent = t("delete");
      del.className = "danger-text";
      del.addEventListener("click", async () => {
        if (!confirm(t("deleteConfirm"))) return;
        if (saving) return;
        del.disabled = true;
        try { await persistVault(vaultItems.filter((_, i) => i !== index)); }
        catch (error) { message("privateMessage", errorKey(error)); }
        finally { del.disabled = false; }
      });
      const edit = document.createElement("button");
      edit.textContent = t("edit");
      edit.addEventListener("click", () => openEntry(index));
      actions.append(reveal, copy, edit, del);
      wrap.appendChild(actions);
      host.appendChild(wrap);
    });
  }

  const CHECK_PREFIX = "wf-check-";

  function checklistState(id) {
    try {
      const raw = localStorage.getItem(CHECK_PREFIX + id);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      if (parsed.updatedAt && Date.now() - parsed.updatedAt > 2 * 60 * 60 * 1000) {
        localStorage.removeItem(CHECK_PREFIX + id);
        return {};
      }
      return parsed.items || {};
    } catch {
      return {};
    }
  }

  function restoreChecklists() {
    document.querySelectorAll("[data-checklist]").forEach(card => {
      const id = card.dataset.checklist;
      const state = checklistState(id);
      card.querySelectorAll("[data-check]").forEach(box => {
        box.checked = !!state[box.dataset.check];
      });
      updateChecklistProgress(id);
    });
  }

  function saveChecklist(id) {
    const card = document.querySelector('[data-checklist="' + id + '"]');
    if (!card) return;
    const items = {};
    card.querySelectorAll("[data-check]").forEach(box => {
      items[box.dataset.check] = box.checked;
    });
    localStorage.setItem(CHECK_PREFIX + id, JSON.stringify({updatedAt:Date.now(), items}));
    updateChecklistProgress(id);
  }

  function updateChecklistProgress(id) {
    const card = document.querySelector('[data-checklist="' + id + '"]');
    const pill = document.querySelector('[data-check-progress="' + id + '"]');
    if (!card || !pill) return;
    const boxes = [...card.querySelectorAll("[data-check]")];
    const done = boxes.filter(b => b.checked).length;
    pill.textContent = done + " / " + boxes.length;
  }

  function resetChecklist(id) {
    const card = document.querySelector('[data-checklist="' + id + '"]');
    if (!card) return;
    card.querySelectorAll("[data-check]").forEach(box => box.checked = false);
    localStorage.removeItem(CHECK_PREFIX + id);
    updateChecklistProgress(id);
  }

  function updateTrainingDeadlines() {
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const locale = lang === "ar" ? "ar-EG" : "en-GB";
    const formatter = new Intl.DateTimeFormat(locale, {day:"numeric", month:"short", year:"numeric"});

    document.querySelectorAll(".training-item[data-due]").forEach(row => {
      const [y,m,d] = row.dataset.due.split("-").map(Number);
      const due = new Date(y, m - 1, d);
      const diff = Math.round((due - todayLocal) / 86400000);
      const dueEl = row.querySelector(".due-date");
      const leftEl = row.querySelector(".days-left");

      dueEl.textContent = t("duePrefix") + " " + formatter.format(due);
      leftEl.classList.remove("urgent","overdue");

      if (diff > 1) {
        leftEl.textContent = t("daysLeftMany").replace("{n}", diff);
        if (diff <= 3) leftEl.classList.add("urgent");
      } else if (diff === 1) {
        leftEl.textContent = t("daysLeftOne");
        leftEl.classList.add("urgent");
      } else if (diff === 0) {
        leftEl.textContent = t("dueToday");
        leftEl.classList.add("urgent");
      } else if (diff === -1) {
        leftEl.textContent = t("overdueOne");
        leftEl.classList.add("overdue");
      } else {
        leftEl.textContent = t("overdueMany").replace("{n}", Math.abs(diff));
        leftEl.classList.add("overdue");
      }
    });
  }

  let lastTrainingDay = "";
  function refreshTrainingDateIfNeeded() {
    const now = new Date();
    const dayKey = [now.getFullYear(), now.getMonth()+1, now.getDate()].join("-");
    if (dayKey !== lastTrainingDay) {
      lastTrainingDay = dayKey;
      updateTrainingDeadlines();
      renderCompanion();
    }
  }

  function updateOnline() {
    if (!$("offlineStatus")) return;
    $("offlineStatus").textContent = navigator.onLine ? t("online") : t("offline");
  }

  $("unlockBtn").addEventListener("click", unlock);
  $("passInput").addEventListener("keydown", e => { if (e.key === "Enter") unlock(); });
  document.querySelectorAll(".private-cancel").forEach(btn => btn.addEventListener("click", closePrivateGate));

  document.addEventListener("click", e => {
    const langBtn = e.target.closest("[data-lang]");
    if (langBtn) {
      applyLanguage(langBtn.dataset.lang);
      return;
    }
    const reset = e.target.closest("[data-reset-checklist]");
    if (reset) {
      resetChecklist(reset.dataset.resetChecklist);
      return;
    }
    if(e.target.closest('[data-back]')){
      const previous=returnTarget(activePage);
      showPage(previous.route,'replace').then(()=>restoreReadingPosition(previous.reading));
      return;
    }
    const tab=e.target.closest("[data-tab]");if(tab){selectTab(tab.closest(".page"),tab.dataset.tab,true);return;}
    const target = e.target.closest("[data-page]");
    if (target) {
      showPage(target.dataset.page);
    }
    const copy = e.target.closest("[data-copy]");
    if (copy) {
      navigator.clipboard.writeText(copy.dataset.copy).then(() => {
        const old = copy.textContent;
        copy.textContent = t("copied");
        setTimeout(() => copy.textContent = t("copy"), 900);
      });
    }
  });

  document.addEventListener("change", e => {
    const box = e.target.closest("[data-check]");
    if (!box) return;
    const card = box.closest("[data-checklist]");
    if (card) saveChecklist(card.dataset.checklist);
  });

  function openEntry(index = null) {
    if (!authenticated || saving) return;
    conflictedEditors.delete('secret');
    editingIndex = index;
    const item = index == null ? {} : vaultItems[index];
    $("secretLabel").value = item.label || "";
    $("secretValue").value = item.value || "";
    $("secretNote").value = item.note || "";
    message("secretError", "");
    $("secretDialog").showModal();
    $("secretLabel").focus();
  }
  $("addSecretBtn").addEventListener("click", () => openEntry());
  $("cancelSecret").addEventListener("click", () => $("secretDialog").close());
  $("saveSecret").addEventListener("click", async () => {
    if (saving || !authenticated || conflictedEditors.has('secret')) return;
    const label = $("secretLabel").value.trim();
    const value = $("secretValue").value.trim();
    const note = $("secretNote").value.trim();
    if (!label || !value) return;
    const next = vaultItems.map(item => ({ ...item }));
    if (editingIndex == null) next.push({label,value,note});
    else next[editingIndex] = {label,value,note};
    $("saveSecret").disabled = true;
    try { if (await persistVault(next)) $("secretDialog").close(); }
    catch (error) { message("secretError", error.status === 400 ? "invalidEntry" : errorKey(error)); }
    finally { $("saveSecret").disabled = false; }
  });
  $("secretDialog").addEventListener("close", () => {
    ["secretLabel", "secretValue", "secretNote"].forEach(id => $(id).value = "");
  });
  $("logoutBtn").addEventListener("click", logout);

  function editProfile() {
    if (!authenticated) return openPrivateGate("details");
    if (saving) return;
    conflictedEditors.delete('profile');
    $("profileFields").replaceChildren();
    const groups = [{title:"shiftDays",keys:["shiftDays","shiftStart","shiftEnd"]},{ title:"myProfile", keys:["displayName","role","site","manager","managerEmail","startDate","hours","hourlyRate","paidBreak","annualHoliday","minibusNote"] },{title:"accountHelp",keys:["colleagueNumber","kioskId","kioskPin","workPin","thriveUsername"]},{title:"firstDay",keys:["firstDayTime","firstDayLocation","firstDayPostcode"]}];
    groups.forEach((group,index) => {
      const box = document.createElement("details"); box.className="profile-group"; box.open=index===0;
      const heading=document.createElement("summary");heading.dataset.i18n=group.title;heading.textContent=t(group.title);box.append(heading);
      group.keys.forEach(key => {
        const field=document.createElement("div");field.className="field";
        const label=document.createElement("label");label.textContent=t(key);label.dataset.i18n=key;label.htmlFor="profile-"+key;
        if(key==='shiftDays') {
          const days=document.createElement('fieldset');days.className='weekday-picker';
          const legend=document.createElement('legend');legend.dataset.i18n=key;legend.textContent=t(key);days.append(legend);
          const selected=shiftDays(privateData.profile.shiftDays);
          [1,2,3,4,5,6,0].forEach(day=>{
            const option=document.createElement('label');const check=document.createElement('input');check.type='checkbox';check.value=day;check.dataset.shiftDay=day;check.checked=selected.includes(day);
            const name=document.createElement('span');name.dataset.weekday=day;name.textContent=WEEKDAYS[day][lang==='ar'?1:0];option.append(check,name);days.append(option);
          });box.append(days);return;
        }
        const input=document.createElement("input");input.id="profile-"+key;input.dataset.profile=key;input.maxLength=256;input.autocomplete="off";
        input.value=privateData.profile[key] || "";
        if (key.toLowerCase().includes("pin")) {input.type="password";input.dir="ltr";}
        if (["shiftStart","shiftEnd"].includes(key)) {input.type="time";input.dir="ltr";}
        if (key==="startDate") input.type="date";
        if (["hours","hourlyRate","annualHoliday"].includes(key)) {input.type="number";input.min="0";input.step="0.01";input.inputMode="decimal";}
        if(key==="managerEmail")input.type="email";
        field.append(label,input);box.append(field);
      });
      $("profileFields").append(box);
    });
    message("profileError", "");$("profileDialog").showModal();
  }
  $("editProfileBtn").addEventListener("click",editProfile);
  document.querySelectorAll("[data-edit-profile]").forEach(button=>button.addEventListener("click",editProfile));
  $("cancelProfile").addEventListener("click", () => $("profileDialog").close());
  $("profileDialog").addEventListener("close", () => $("profileFields").replaceChildren());
  $("saveProfile").addEventListener("click",async()=>{
    if(saving || !authenticated || conflictedEditors.has('profile'))return;
    const profile={...privateData.profile};
    const selected=[...document.querySelectorAll('[data-shift-day]:checked')].map(input=>Number(input.value));
    if(JSON.stringify(selected.slice().sort())!==JSON.stringify(shiftDays(privateData.profile.shiftDays).slice().sort()))profile.shiftDays=selected.join(',');
    const inputs=[...document.querySelectorAll("[data-profile]")];
    if(inputs.some(input=>!input.reportValidity()))return;
    inputs.forEach(input=>{if(input.value.trim())profile[input.dataset.profile]=input.value.trim();else delete profile[input.dataset.profile];});
    $("saveProfile").disabled=true;
    try{if(await persistVault(vaultItems,profile))$("profileDialog").close();}
    catch(error){message("profileError",errorKey(error));}
    finally{$("saveProfile").disabled=false;}
  });

  $("importLegacyBtn").addEventListener("click", () => {
    if (!authenticated || saving) return;
    $("oldPass").value = "";
    message("migrationError", "");
    $("migrationDialog").showModal();
    $("oldPass").focus();
  });
  $("cancelMigration").addEventListener("click", () => $("migrationDialog").close());
  $("migrationDialog").addEventListener("close", () => $("oldPass").value = "");
  $("migrateVault").addEventListener("click", async () => {
    if (saving || !authenticated || $("migrateVault").disabled) return;
    const version = navigationVersion;
    $("migrateVault").disabled = true;
    let entries;
    try {
      const meta = JSON.parse(localStorage.getItem(META_KEY));
      const key = await deriveKey($("oldPass").value, fromB64(meta.salt));
      if (await decryptText(meta.verifier, key) !== "wf-ok-v1") throw new Error();
      entries = JSON.parse(await decryptText(JSON.parse(localStorage.getItem(DATA_KEY)), key));
      if (!Array.isArray(entries) || entries.some(item => !item || typeof item.label !== "string" || typeof item.value !== "string" || (item.note != null && typeof item.note !== "string"))) throw new Error();
    } catch {
      message("migrationError", "importFailed");
      $("migrateVault").disabled = false;
      return;
    }
    try {
      if (!authenticated || version !== navigationVersion) return;
      if (!entries.length) { message("migrationError", "emptyOldVault"); return; }
      const next = vaultItems.map(item => ({ ...item }));
      entries.forEach(item => {
        const normalized = {label:item.label, value:item.value, note:item.note || ""};
        if (!next.some(existing => JSON.stringify(existing) === JSON.stringify(normalized))) next.push(normalized);
      });
      if (await persistVault(next)) {
        $("migrationDialog").close();
        message("privateMessage", "importDone");
        if (migrationMode) location.replace(CANONICAL_ORIGIN + "/#vault");
      }
    } catch (error) { message("migrationError", errorKey(error)); }
    finally { $("oldPass").value = ""; $("migrateVault").disabled = false; }
  });

  async function checkActiveSession() {
    if (!authenticated || document.hidden) return;
    const page = activePage;
    const version = navigationVersion;
    try {
      const result = await api("/session");
      if(!result.body.authenticated)serverSessionKnown=false;
      if (version === navigationVersion && !result.body.authenticated) { navigationVersion++; if(PROTECTED_PAGES.has(page))openPrivateGate(page);else{rememberDraft();clearPrivateData();renderPrivateProfile();} }
    } catch {
      if (version === navigationVersion) message("privateMessage", "apiError");
    }
  }
  addEventListener("focus", checkActiveSession);
  const conceal=()=>{if(authenticated)$("privacyShield").classList.remove("hidden");};
  const resume=async()=>{
    if($("privacyShield").classList.contains("hidden"))return;
    try{await checkActiveSession();}finally{$("privacyShield").classList.add("hidden");}
  };
  document.addEventListener("visibilitychange",()=>document.hidden?conceal():resume());
  addEventListener("hashchange", () => showPage(location.hash.slice(1),"replace"));
  addEventListener("pageshow",event=>{if(event.persisted)resume();});
  addEventListener("pagehide",conceal);
  setInterval(checkActiveSession, 60000);

  function readingLine(){const header=document.querySelector("header")?.getBoundingClientRect().bottom || 0;const tabs=$(activePage)?.querySelector(".section-tabs")?.getBoundingClientRect();return (tabs && tabs.top<=header+4 && tabs.bottom>header ? tabs.bottom : header)+12;}
  function captureReadingPosition() {
    const page=document.querySelector('.page.active');
    if(!page)return null;
    const line=readingLine();
    let index=0;
    page.querySelectorAll('h1,h2,p,summary,.value,.task-text,.course-copy,.guide-card,.work-overview,.focus-card').forEach(el=>{if(!el.dataset.readAnchor)el.dataset.readAnchor=page.id+'-read-'+index;index++;});
    const blocks=[...page.querySelectorAll('[data-read-anchor]')];
    const el=blocks.find(block=>{const r=block.getBoundingClientRect();return r.height>0 && r.top<=line && r.bottom>line;}) || blocks.find(block=>{const r=block.getBoundingClientRect();return r.height>0 && r.top>=line;});
    if(!el)return {page:page.id,scroll:window.scrollY};
    const r=el.getBoundingClientRect();
    return {page:page.id,key:el.dataset.readAnchor,line,offset:r.top-line,fraction:r.top<line?(line-r.top)/r.height:null,scroll:window.scrollY};
  }
  function restoreReadingPosition(reading) {
    if(!reading || activePage!==reading.page)return;
    const restore=()=>{
      if(activePage!==reading.page)return;
      const el=[...document.querySelectorAll('[data-read-anchor]')].find(block=>block.dataset.readAnchor===reading.key);
      if(!el){window.scrollTo({top:reading.scroll,behavior:'auto'});return;}
      const r=el.getBoundingClientRect();
      const line=readingLine();
      const delta=reading.fraction==null?r.top-line-reading.offset:r.top+reading.fraction*r.height-line;
      window.scrollBy({top:delta,behavior:'auto'});
    };
    restore();
    if(window.requestAnimationFrame)window.requestAnimationFrame(restore);
  }
  function jobValue(key) {
    if(!authenticated || !privateData)return '';
    const profile=privateData.profile;
    if(key==='weeklyGross'){if(!profile.hours || !profile.hourlyRate)return '';const amount=Number(profile.hours)*Number(profile.hourlyRate);return Number.isFinite(amount)?new Intl.NumberFormat(lang==='ar'?'ar-EG':'en-GB',{style:'currency',currency:'GBP'}).format(amount):'';}
    if(key==='shiftTime')return [profile.shiftStart,profile.shiftEnd].filter(Boolean).join(' – ');
    if(key==='shiftDays'){const days=shiftDays(profile.shiftDays);if(days.length)return days.map(day=>WEEKDAYS[day][lang==='ar'?1:0]).join(lang==='ar'?'، ':', ');}
    const value=profile[key] || '';
    if(!value)return '';
    const translated={role:'roleValue',shiftDays:'regularShiftsValue',paidBreak:'breakValue',minibusNote:'nightMinibusNote',firstDayLocation:'inductionLocation'};
    if(account?.id==='owner' && translated[key] && value===({role:'Team Member – Filling Station (Nights)',shiftDays:'Friday & Saturday',paidBreak:'Paid',minibusNote:'Minibus unavailable for Friday/Saturday night shifts.',firstDayLocation:'Westmorland Hotel, Northbound'})[key])return t(translated[key]);
    if(key==='startDate' && /^\d{4}-\d{2}-\d{2}$/.test(value))return new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{dateStyle:'medium'}).format(new Date(value+'T12:00:00'));
    if(key==='hourlyRate' && Number.isFinite(Number(value)))return new Intl.NumberFormat(lang==='ar'?'ar-EG':'en-GB',{style:'currency',currency:'GBP'}).format(Number(value));
    if(key==='hours')return value+' '+t('hoursUnit');
    return value;
  }
  function renderShift() {
    const time=date=>new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit'}).format(date);
    const date=date=>new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{timeZone:'Europe/London',weekday:'long',day:'numeric',month:'short'}).format(date);
    const interval=shift=>time(shift.start)+' – '+time(shift.end);
    const state=authenticated && privateData?shiftState(privateData.profile):{status:'locked'};
    $('shiftHero').dataset.shiftStatus=state.status;
    $('shiftStatus').textContent=t({locked:'myShift',unset:'setShift',active:'onShift',today:'workingToday',off:'dayOff'}[state.status]);
    $('shiftHeadline').textContent=state.current?t('endsAt').replace('{time}',time(state.current.end)):state.next?date(state.next.start):t(state.status==='locked'?'signInShift':'setSchedule');
    $('shiftDetail').textContent=state.current?date(state.current.start):state.next?interval(state.next):'';
    $('shiftCountdown').textContent=state.current?t('timeRemaining').replace('{time}',duration(state.current.end-new Date())):state.next?t('startsIn').replace('{time}',duration(state.next.start-new Date())):'';
    renderAlerts();
  }
  function duration(ms) {
    const total=Math.max(0,Math.ceil(ms/60000));const days=Math.floor(total/1440),hours=Math.floor(total%1440/60),minutes=total%60;
    const parts=[];if(days)parts.push(days+' '+t('durationDays'));if(hours)parts.push(hours+' '+t('durationHours'));if(!days && (minutes || !parts.length))parts.push(minutes+' '+t('durationMinutes'));return parts.join(lang==='ar'?' و ':' ');
  }
  function courseTitle(course){return lang==='ar'?(course.titleAR || course.titleEN):course.titleEN;}
  function companionData(){return privateData?.companion || initialCompanion(false);}
  function deadlineText(due) {
    if(!due)return '';
    const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(part=>[part.type,part.value]));
    const today=Date.UTC(+parts.year,+parts.month-1,+parts.day);
    const diff=Math.round((Date.parse(due+'T00:00:00Z')-today)/86400000);
    const key=diff===0?'dueToday':diff===1?'daysLeftOne':diff>1?'daysLeftMany':diff===-1?'overdueOne':'overdueMany';
    return t(key).replace('{n}',Math.abs(diff));
  }
  function renderAlerts() {
    const alerts=authenticated && privateData?upcomingAlerts(privateData.profile,privateData.companion.courses):[];
    const badge=$('alertsCount');badge.hidden=!alerts.length;badge.textContent=alerts.length>9?'9+':String(alerts.length);
    $('alertsBtn').setAttribute('aria-label',t('alertsTitle')+(alerts.length?' · '+alerts.length:''));
    const list=$('alertsList');list.replaceChildren();
    if(!alerts.length){const empty=document.createElement('p');empty.className='alerts-empty';empty.textContent=t('noAlerts');list.append(empty);return;}
    for(const alert of alerts){
      const button=document.createElement('button');button.type='button';button.className='alert-item';
      const title=document.createElement('strong');title.textContent=alert.kind==='training'?courseTitle(alert.course):t(alert.kind==='shift-active'?'shiftAlertActive':'shiftAlertSoon');
      const detail=document.createElement('span');detail.textContent=alert.kind==='training'?deadlineText(alert.course.due):new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{timeZone:'Europe/London',weekday:'long',hour:'2-digit',minute:'2-digit'}).format(alert.when);
      button.append(title,detail);button.addEventListener('click',()=>{$('alertsDialog').close();showPage(alert.kind==='training'?'training':'details');});list.append(button);
    }
  }
  $('alertsBtn').addEventListener('click',()=>{renderAlerts();$('alertsDialog').showModal();});
  $('closeAlerts').addEventListener('click',()=>$('alertsDialog').close());
  function renderCompanion() {
    if(!$('courseList'))return;
    const data=companionData();
    const remaining=data.courses.filter(course=>course.status!=='completed').sort((a,b)=>Number(b.required)-Number(a.required)||(a.due||'9999').localeCompare(b.due||'9999'));
    const completed=data.courses.filter(course=>course.status==='completed');
    for(const [host,courses] of [[$('courseList'),remaining],[$('completedCourses'),completed]]){
      host.replaceChildren();
      courses.forEach(course=>{
        const row=document.createElement('div');row.className='course-row';row.dataset.course=course.id;
        const check=document.createElement('input');check.type='checkbox';check.className='task-check';check.checked=course.status==='completed';check.setAttribute('aria-label',t('completed')+' — '+courseTitle(course));
        check.addEventListener('change',async()=>{
          if(!authenticated){check.checked=false;openPrivateGate('training');return;}
          if(saving){check.checked=course.status==='completed';return;}
          check.disabled=true;
          const next=structuredClone(privateData.companion);next.courses.find(item=>item.id===course.id).status=check.checked?'completed':'not-started';
          try{await saveCompanion(next);}catch(error){check.checked=course.status==='completed';message('privateMessage',errorKey(error));}finally{check.disabled=false;}
        });
        const copy=document.createElement('div');
        const title=document.createElement('label');check.id='course-check-'+course.id;title.htmlFor=check.id;title.className='course-copy';title.textContent=courseTitle(course);title.dataset.readAnchor='course-'+course.id;copy.append(title);
        const meta=document.createElement('div');meta.className='course-meta';
        if(course.due){const due=document.createElement('span');due.textContent=new Intl.DateTimeFormat(lang==='ar'?'ar-EG':'en-GB',{day:'numeric',month:'short'}).format(new Date(course.due+'T12:00:00'))+' · '+deadlineText(course.due);due.className=new Date(course.due+'T23:59:59')<new Date()?'overdue':'urgent';meta.append(due);}
        const state=document.createElement('span');state.textContent=t(course.status==='completed'?'completed':course.status==='in-progress'?'inProgress':'notStarted');if(authenticated && course.status==='in-progress')meta.append(state);
        if(!course.required && course.status!=='completed'){const optional=document.createElement('span');optional.textContent=t('optionalLearning');meta.append(optional);}
        copy.append(meta);
        const edit=document.createElement('button');edit.className='course-edit';edit.textContent='⋯';edit.setAttribute('aria-label',t('edit')+' — '+courseTitle(course));edit.addEventListener('click',()=>openCourse(course.id));
        row.append(check,copy,edit);host.append(row);
      });
    }
    $('completedCount').textContent=String(completed.length);$('training-tab-completed').hidden=!completed.length;if(!completed.length && $('training-tab-completed').getAttribute('aria-selected')==='true')selectTab($('training'),'pending');
    $('learningProgress').textContent=authenticated?completed.length+' / '+data.courses.length:t('courseCount').replace('{n}',data.courses.length);
    const next=remaining.find(course=>course.required) || remaining[0];
    $('nextCourseTitle').textContent=next?courseTitle(next):t('learningClear');
    $('nextCourseMeta').textContent=next?.due?deadlineText(next.due):t(authenticated?'myProgress':'requiredTraining');
    $('greeting').textContent=authenticated?(privateData.profile.displayName || account.username):'';
    renderShift();
    $('accountBtn').textContent=authenticated?(privateData.profile.displayName || t('myProfile')):t('myProfile');
    $('personalTasks').replaceChildren();
    data.tasks.forEach(task=>{
      const row=document.createElement('li');row.className='task personal-task'+(task.done?' task-done':'');
      const check=document.createElement('input');check.type='checkbox';check.className='task-check';check.checked=task.done;check.setAttribute('aria-label',task.label);
      const label=document.createElement('label');check.id='personal-check-'+task.id;label.htmlFor=check.id;label.className='task-text';label.textContent=task.label;label.dataset.readAnchor='task-'+task.id;
      check.addEventListener('change',async()=>{
        if(saving){check.checked=task.done;return;}
        check.disabled=true;const next=structuredClone(privateData.companion);next.tasks.find(item=>item.id===task.id).done=check.checked;
        try{await saveCompanion(next);}catch(error){message('privateMessage',errorKey(error));check.checked=task.done;}finally{check.disabled=false;}
      });
      const del=document.createElement('button');del.className='course-edit danger-text';del.textContent='×';del.setAttribute('aria-label',t('delete')+' — '+task.label);
      del.addEventListener('click',async()=>{if(saving || !confirm(t('deleteTaskConfirm')))return;const next=structuredClone(privateData.companion);next.tasks=next.tasks.filter(item=>item.id!==task.id);try{await saveCompanion(next);}catch(error){message('privateMessage',errorKey(error));}});
      const actions=document.createElement('div');actions.className='task-actions';const edit=document.createElement('button');edit.textContent='⋯';edit.setAttribute('aria-label',t('edit')+' — '+task.label);edit.addEventListener('click',()=>{editingTaskId=task.id;$('taskInput').value=task.label;$('taskInput').focus();});actions.append(edit,del);row.append(check,label,actions);$('personalTasks').append(row);
    });
    if(!data.tasks.length){const empty=document.createElement('li');empty.className='empty-personal';empty.textContent=t('addFirstTask');$('personalTasks').append(empty);}
    const done=data.tasks.filter(task=>task.done).length;
    $('homeTaskCount').textContent=done+' / '+data.tasks.length;
    $('taskProgress').textContent=done+' / '+data.tasks.length;
    $('resetTasks').hidden=!data.tasks.some(task=>task.done);
  }
  async function saveCompanion(next){return persistVault(vaultItems,privateData.profile,next);}
  function openCourse(id=null){
    if(!authenticated)return openPrivateGate('training');
    if(saving)return;
    conflictedEditors.delete('course');
    editingCourseId=id;
    const course=privateData.companion.courses.find(item=>item.id===id);
    $('courseEN').value=course?.titleEN || '';$('courseAR').value=course?.titleAR || '';$('courseDue').value=course?.due || '';
    $('courseStatus').value=course?.status || 'not-started';$('courseRequired').checked=course?.required || false;
    $('deleteCourse').hidden=!course;message('courseError','');$('courseDialog').showModal();$('courseEN').focus();
  }
  $('addCourseBtn').addEventListener('click',()=>openCourse());
  $('cancelCourse').addEventListener('click',()=>$('courseDialog').close());
  $('courseDialog').addEventListener('close',()=>{for(const id of ['courseEN','courseAR','courseDue'])$(id).value='';editingCourseId=null;});
  $('saveCourse').addEventListener('click',async()=>{
    if(saving || !authenticated || conflictedEditors.has('course') || !$('courseEN').value.trim())return;
    const next=structuredClone(privateData.companion);
    const course={id:editingCourseId || crypto.randomUUID(),titleEN:$('courseEN').value.trim(),titleAR:$('courseAR').value.trim(),due:$('courseDue').value,status:$('courseStatus').value,required:$('courseRequired').checked};
    if(editingCourseId)next.courses[next.courses.findIndex(item=>item.id===editingCourseId)]=course;else next.courses.push(course);
    $('saveCourse').disabled=true;
    try{if(await saveCompanion(next))$('courseDialog').close();}catch(error){message('courseError',errorKey(error));}finally{$('saveCourse').disabled=false;}
  });
  $('deleteCourse').addEventListener('click',async()=>{
    if(saving || conflictedEditors.has('course') || !editingCourseId || !confirm(t('deleteCourseConfirm')))return;
    const next=structuredClone(privateData.companion);next.courses=next.courses.filter(item=>item.id!==editingCourseId);
    try{if(await saveCompanion(next))$('courseDialog').close();}catch(error){message('courseError',errorKey(error));}
  });
  $('taskForm').addEventListener('submit',async event=>{
    event.preventDefault();
    if(!authenticated)return openPrivateGate('tasks');
    if(saving || !$('taskInput').value.trim())return;
    const next=structuredClone(privateData.companion);const existing=next.tasks.find(task=>task.id===editingTaskId);if(existing)existing.label=$('taskInput').value.trim();else next.tasks.push({id:crypto.randomUUID(),label:$('taskInput').value.trim(),done:false});
    const submit=$('taskForm').querySelector('button');submit.disabled=true;
    try{if(await saveCompanion(next)){editingTaskId=null;$('taskInput').value='';$('taskInput').focus({preventScroll:true});}}catch(error){message('privateMessage',errorKey(error));}finally{submit.disabled=false;}
  });
  $('resetTasks').addEventListener('click',async()=>{if(saving || !authenticated)return;const next=structuredClone(privateData.companion);next.tasks.forEach(task=>task.done=false);try{await saveCompanion(next);}catch(error){message('privateMessage',errorKey(error));}});
  $('homeSearch').addEventListener('input',()=>{
    const normalize=text=>text.normalize('NFKD').replace(/[\u064b-\u065f]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
    const query=normalize($('homeSearch').value.trim());
    let shown=0;
    document.querySelectorAll('#home .home-searchable').forEach(button=>{const key=button.querySelector('[data-i18n]')?.dataset.i18n;const text=button.dataset.search+' '+(T.en[key]||'')+' '+(T.ar[key]||'');button.hidden=!!query && !normalize(text).includes(query);if(!button.hidden)shown++;});
    for(const [title,grid] of [['situationsTitle','situationsGrid'],['guidesTitle','guidesGrid']]){
      const visible=[...$(grid).querySelectorAll('.home-searchable')].some(button=>!button.hidden);
      $(title).hidden=!visible;$(grid).hidden=!visible;
    }
    $('homeSearchEmpty').hidden=!!shown;
  });

  $("otherAccountBtn").addEventListener("click",()=>{serverSessionKnown=false;setAuthMode(authMode==="owner"?"login":"owner" );});
  $("registerBtn").addEventListener("click",()=>{serverSessionKnown=false;setAuthMode("register" );});
  $("recoverBtn").addEventListener("click",()=>{serverSessionKnown=false;setAuthMode("recover" );});
  $("usernameInput").addEventListener("keydown",event=>{if(event.key==="Enter")$("passInput").focus();});
  $("copyRecovery").addEventListener("click",async()=>{await navigator.clipboard.writeText($("newRecoveryCode").value);$("copyRecovery").textContent=t("copied");});
  $("closeRecovery").addEventListener("click",()=>$("recoveryDialog").close());
  $("recoveryDialog").addEventListener("close",()=>{$("newRecoveryCode").value="";$("copyRecovery").textContent=t("copy");});
  addEventListener("online", updateOnline);
  addEventListener("offline", updateOnline);
  addEventListener("focus", renderShift);
  const tickShift=()=>{renderShift();setTimeout(tickShift,60000-Date.now()%60000);};
  setTimeout(tickShift,60000-Date.now()%60000);
  addEventListener("focus", refreshTrainingDateIfNeeded);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) {refreshTrainingDateIfNeeded();renderShift();} });
  setInterval(refreshTrainingDateIfNeeded, 10 * 60 * 1000);

  if ("serviceWorker" in navigator) {
    safeWorkerReady = navigator.serviceWorker.register("./sw.js?v=30").then(() => {
      const safeController = () => navigator.serviceWorker.controller && new URL(navigator.serviceWorker.controller.scriptURL).searchParams.get("v") === "30";
      if (safeController()) return true;
      return new Promise(resolve => {
        const finish = value => { clearTimeout(timer); navigator.serviceWorker.removeEventListener("controllerchange", changed); resolve(value); };
        const changed = () => { if (safeController()) finish(true); };
        const timer = setTimeout(() => finish(!navigator.serviceWorker.controller), 15000);
        navigator.serviceWorker.addEventListener("controllerchange", changed);
        changed();
      });
    }).catch(() => !navigator.serviceWorker.controller);
  }

  const sizeHeader=()=>document.documentElement.style.setProperty("--header-height",document.querySelector("header").offsetHeight+"px");
  if(window.ResizeObserver)new ResizeObserver(sizeHeader).observe(document.querySelector("header"));
  sizeHeader();
  applyLanguage(lang,false);
  refreshTrainingDateIfNeeded();
  document.querySelectorAll('[data-check]').forEach(check=>{check.id=check.dataset.check;const text=check.closest('.task').querySelector('.task-text');const label=document.createElement('label');label.className=text.className;if(text.dataset.i18n)label.dataset.i18n=text.dataset.i18n;label.htmlFor=check.id;while(text.firstChild)label.append(text.firstChild);text.replaceWith(label);});
  restoreChecklists();
  $("lockScreen").classList.add("hidden");
  const initialPage=location.hash.slice(1)||"home";
  showPage(initialPage,"replace");
  if(!PROTECTED_PAGES.has(initialPage.split("/")[0]))loadPrivateSession().catch(()=>{});
})();
