// Explicit parent-controlled, revision-checked snapshots. Never include sessions or audio.
export function snapshotProfile(storage, profileId) {
  const root = JSON.parse(storage.getItem("ala-adventure-v1") || "null");
  const p =
    /^[a-z0-9-]{3,60}$/.test(profileId) &&
    Object.hasOwn(root?.profiles || {}, profileId)
      ? root.profiles[profileId]
      : null;
  if (!p) throw Error("Choose a local explorer first.");
  const run =
    profileId === root.activeProfile
      ? { missionStep: root.missionStep, clues: root.clues, maths: root.maths }
      : p.run;
  const read = (k) => {
    try {
      return JSON.parse(storage.getItem(k) || "null");
    } catch {
      return null;
    }
  };
  const science = read("ala-science-lab-v1");
  const payload = {
    version: 1,
    profile: { ...p, run },
    words: read("ala-word-kingdom-v1")?.learners?.[profileId] || null,
    science:
      science?.version === 2
        ? science.learners?.[profileId] || null
        : profileId === "explorer"
          ? science
          : null,
    notebook: read("ala-notebook-v1")?.learners?.[profileId] || null,
  };
  if (JSON.stringify(payload).length > 750000)
    throw Error("Progress is too large for cloud snapshots. Export a backup.");
  if (!validateSnapshot(payload))
    throw Error(
      "Device progress needs repair before it can be saved. Export a backup first.",
    );
  return payload;
}
const object = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const strings = (value) =>
  Array.isArray(value) && value.every((x) => typeof x === "string");
const safeRun = (r) =>
  object(r) &&
  Object.keys(r).every((k) => ["missionStep", "clues", "maths"].includes(k)) &&
  Number.isInteger(r.missionStep) &&
  r.missionStep >= 0 &&
  r.missionStep <= 6 &&
  strings(r.clues) &&
  strings(r.maths);
export function validateSnapshot(value) {
  const p = value?.profile,
    r = p?.run;
  return (
    value?.version === 1 &&
    object(p) &&
    typeof p.displayName === "string" &&
    p.displayName.trim().length > 0 &&
    p.displayName.length <= 30 &&
    [4, 6].includes(p.year) &&
    Number.isFinite(p.xp) &&
    p.xp >= 0 &&
    Array.isArray(p.awards) &&
    p.awards.every((x) => typeof x === "string") &&
    object(p.skills) &&
    Object.values(p.skills).every(
      (x) =>
        object(x) &&
        [
          "independent",
          "assisted",
          "reviewCount",
          "last",
          "due",
          "lastIndependent",
          "reviewDue",
        ].every(
          (k) => x[k] === undefined || (Number.isFinite(x[k]) && x[k] >= 0),
        ),
    ) &&
    object(p.missions) &&
    Object.values(p.missions).every((x) => typeof x === "boolean") &&
    Array.isArray(p.events) &&
    p.events.every(
      (e) => object(e) && typeof e.type === "string" && Number.isFinite(e.at),
    ) &&
    safeRun(r) &&
    [value.words, value.science, value.notebook].every(
      (x) => x === null || (typeof x === "object" && !Array.isArray(x)),
    ) &&
    (value.science === null ||
      (Number.isInteger(value.science.step) &&
        value.science.step >= 0 &&
        value.science.step <= 4 &&
        object(value.science.tests) &&
        Number.isFinite(value.science.attempts))) &&
    (value.words === null ||
      (object(value.words.words) &&
        Number.isFinite(value.words.stars) &&
        value.words.stars >= 0 &&
        Object.values(value.words.words).every(
          (w) => object(w) && Object.values(w).every((f) => object(f)),
        ))) &&
    (value.notebook === null ||
      Object.values(value.notebook).every(
        (w) =>
          object(w) &&
          typeof w.term === "string" &&
          typeof w.definition === "string" &&
          typeof w.example === "string" &&
          strings(w.sources),
      )) &&
    JSON.stringify(value).length <= 750000
  );
}
export function restoreProfile(storage, profileId, payload) {
  if (!validateSnapshot(payload))
    throw Error("The cloud snapshot is incompatible. Local progress was kept.");
  const root = JSON.parse(storage.getItem("ala-adventure-v1") || "null");
  if (
    !/^[a-z0-9-]{3,60}$/.test(profileId) ||
    !Object.hasOwn(root?.profiles || {}, profileId)
  )
    throw Error("Choose a local explorer first.");
  // Prepare all writes before changing anything; roll back if storage quota fails.
  const keys = [
    "ala-adventure-v1",
    "ala-word-kingdom-v1",
    "ala-science-lab-v1",
    "ala-notebook-v1",
  ];
  const previous = keys.map((k) => storage.getItem(k));
  root.profiles[profileId] = structuredClone(payload.profile);
  if (root.activeProfile === profileId) {
    root.missionStep = payload.profile.run.missionStep;
    root.clues = [...payload.profile.run.clues];
    root.maths = [...payload.profile.run.maths];
  }
  const values = [JSON.stringify(root)];
  for (const [i, name] of ["words", "science", "notebook"].entries()) {
    let value;
    try {
      value = JSON.parse(previous[i + 1] || "null");
    } catch {}
    if (!object(value?.learners)) {
      const legacy =
        name === "science" && object(value) && Number.isInteger(value.step)
          ? structuredClone(value)
          : null;
      value = { version: name === "science" ? 2 : 1, learners: {} };
      if (legacy) value.learners.explorer = legacy;
    }
    if (payload[name] === null) delete value.learners[profileId];
    else value.learners[profileId] = payload[name];
    values.push(JSON.stringify(value));
  }
  try {
    keys.forEach((k, i) => storage.setItem(k, values[i]));
  } catch (error) {
    // Free newly written space first, so restoring a larger old root cannot itself hit quota.
    for (const key of keys) storage.removeItem(key);
    keys.forEach((k, i) => {
      if (previous[i] !== null) storage.setItem(k, previous[i]);
    });
    throw Error("Device storage is full. Previous progress was kept.");
  }
}
