export const KEY = 'ala-adventure-v1';
export const intervals = [1, 3, 7, 14, 30];
export function fresh() {
  return {
    version: 1,
    activeProfile: 'explorer',
    profiles: {
      explorer: {
        displayName: 'Adam',
        year: 6,
        curriculum: 'england-primary',
        interfaceLanguage: 'en-GB',
        instructionLanguage: 'en-GB',
        narrationLanguage: 'en-GB',
        xp: 0,
        awards: [],
        missions: {},
        skills: {},
        events: [],
        rewardCredits: 0,
      },
    },
    settings: {
      sound: true,
      motion: true,
      missionXP: 5,
      independentXP: 3,
      applicationXP: 2,
    },
    rewardModule: { enabled: false, balance: 0, redemptions: [] },
    missionStep: 0,
    clues: [],
    maths: [],
  };
}
export function reward(state, id, amount) {
  const p = state.profiles[state.activeProfile];
  if (p.awards.includes(id)) return 0;
  p.awards.push(id);
  p.xp += amount;
  recordEvent(state, 'xp_awarded', { xp: amount, mission: id });
  return amount;
}
export function evidence(
  state,
  id,
  correct,
  assisted = false,
  now = Date.now(),
) {
  const p = state.profiles[state.activeProfile];
  recordEvent(state, 'skill_attempted', { skill: id, correct, assisted });
  const s = p.skills[id] ?? {
    independent: 0,
    assisted: 0,
    reviewCount: 0,
    last: 0,
    due: 0,
    contexts: [],
  };
  if (!correct || assisted) {
    s.assisted++;
    s.due = now + 86400000;
    s.last = now;
    p.skills[id] = s;
    return s;
  }
  // Independent evidence counts once per day. Later recall must happen on a later day.
  const lastIndependent=s.lastIndependent ?? (s.independent>0?s.last:0);
  if (!lastIndependent || new Date(lastIndependent).toDateString() !== new Date(now).toDateString()) {
    if (s.independent > 0 && now >= s.due) s.reviewCount++;
    s.independent++;
    s.lastIndependent=now;
    s.due = now + intervals[Math.min(s.reviewCount, 4)] * 86400000;
    s.last = now;
  }
  p.skills[id] = s;
  return s;
}
export function status(s, now = Date.now()) {
  if (!s) return 'Not started';
  if (s.due && now >= s.due) return 'Review due';
  if (s.reviewCount >= 3 && s.independent >= 4) return 'Secure';
  return s.independent ? 'Practising' : 'Learning';
}
export function load(storage) {
  try {
    const s = JSON.parse(storage.getItem(KEY));
    if (
      !s ||
      s.version !== 1 ||
      !s.profiles?.explorer ||
      !s.settings ||
      typeof s.settings.sound !== 'boolean' ||
      typeof s.settings.motion !== 'boolean' ||
      !Array.isArray(s.profiles.explorer.awards) ||
      !s.profiles.explorer.skills ||
      !s.profiles.explorer.missions ||
      !Number.isInteger(s.missionStep) ||
      s.missionStep < 0 ||
      s.missionStep > 6 ||
      !Array.isArray(s.clues) ||
      !Array.isArray(s.maths) ||
      !Number.isFinite(s.profiles.explorer.xp)
    )
      return fresh();
    if (!s.activeProfile || !s.profiles[s.activeProfile])
      s.activeProfile = 'explorer';
    for (const p of Object.values(s.profiles)) {
      p.displayName ??= 'Adam';
      p.year ??= 6;
      p.events ??= [];
      p.rewardCredits ??= 0;
    }
    return s;
  } catch {
    return fresh();
  }
}

// Local profile infrastructure. No child accounts or remote writes.
export function createProfile(state, id, displayName, year) {
  if (!/^[a-z0-9-]{3,60}$/.test(id) || state.profiles[id])
    throw Error('Invalid profile ID');
  const name = String(displayName).trim();
  if (!name || name.length > 30 || ![4, 6].includes(year))
    throw Error('Choose a supported name and stage');
  state.profiles[id] = {
    displayName: name,
    year,
    curriculum: 'england-primary',
    interfaceLanguage: 'en-GB',
    instructionLanguage: 'en-GB',
    narrationLanguage: 'en-GB',
    xp: 0,
    awards: [],
    missions: {},
    skills: {},
    events: [],
    rewardCredits: 0,
    run: { missionStep: 0, clues: [], maths: [] },
  };
  return state.profiles[id];
}
export function captureRun(state) {
  const p = state.profiles[state.activeProfile];
  p.run = {
    missionStep: state.missionStep,
    clues: [...state.clues],
    maths: [...state.maths],
  };
}
export function switchProfile(state, id) {
  if (!state.profiles[id]) throw Error('Unknown profile');
  captureRun(state);
  state.activeProfile = id;
  const run = state.profiles[id].run ?? {
    missionStep: 0,
    clues: [],
    maths: [],
  };
  state.missionStep = run.missionStep;
  state.clues = [...run.clues];
  state.maths = [...run.maths];
}
export function recordEvent(state, type, payload = {}, now = Date.now()) {
  const p = state.profiles[state.activeProfile];
  p.events ??= [];
  // Bounded local learning evidence. Never collect raw speech or typed free text.
  const allowed = [
    'mission',
    'skill',
    'correct',
    'assisted',
    'attempt',
    'xp',
    'activeMs',
    'status',
  ];
  const safe = Object.fromEntries(
    Object.entries(payload).filter(([k]) => allowed.includes(k)),
  );
  const event = { id: `${now}-${p.events.length}`, type, at: now, ...safe };
  p.events.push(event);
  if (p.events.length > 500) p.events.splice(0, p.events.length - 500);
  return event;
}
