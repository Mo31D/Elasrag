// Explicit parent-controlled, revision-checked snapshots. Never include sessions or audio.
export function snapshotProfile(storage, profileId) {
  const root = JSON.parse(storage.getItem("ala-adventure-v1") || "null");
  const p = root?.profiles?.[profileId];
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
  return payload;
}
export function validateSnapshot(value) {
  const p = value?.profile,
    r = p?.run;
  return (
    value?.version === 1 &&
    p &&
    typeof p.displayName === "string" &&
    p.displayName.length <= 30 &&
    [4, 6].includes(p.year) &&
    Number.isFinite(p.xp) &&
    p.xp >= 0 &&
    Array.isArray(p.awards) &&
    p.awards.every((x) => typeof x === "string") &&
    p.skills &&
    typeof p.skills === "object" &&
    p.missions &&
    typeof p.missions === "object" &&
    Array.isArray(p.events) &&
    r &&
    Number.isInteger(r.missionStep) &&
    r.missionStep >= 0 &&
    r.missionStep <= 6 &&
    Array.isArray(r.clues) &&
    Array.isArray(r.maths) &&
    [value.words, value.science, value.notebook].every(
      (x) => x === null || (typeof x === "object" && !Array.isArray(x)),
    ) &&
    JSON.stringify(value).length <= 750000
  );
}
export function restoreProfile(storage, profileId, payload) {
  if (!validateSnapshot(payload))
    throw Error("The cloud snapshot is incompatible. Local progress was kept.");
  const root = JSON.parse(storage.getItem("ala-adventure-v1") || "null");
  if (!root?.profiles?.[profileId])
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
  if (root.activeProfile === profileId)
    Object.assign(root, payload.profile.run);
  const values = [JSON.stringify(root)];
  for (const [i, name] of ["words", "science", "notebook"].entries()) {
    let value;
    try {
      value = JSON.parse(previous[i + 1] || "null");
    } catch {}
    if (!value?.learners)
      value = { version: name === "science" ? 2 : 1, learners: {} };
    if (payload[name] === null) delete value.learners[profileId];
    else value.learners[profileId] = payload[name];
    values.push(JSON.stringify(value));
  }
  try {
    keys.forEach((k, i) => storage.setItem(k, values[i]));
  } catch (error) {
    keys.forEach((k, i) =>
      previous[i] === null
        ? storage.removeItem(k)
        : storage.setItem(k, previous[i]),
    );
    throw Error("Device storage is full. Previous progress was kept.");
  }
}
