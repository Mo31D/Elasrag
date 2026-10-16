// Small, persistent learning journeys. No rewards for opening a screen.
export const dayKey = (now = Date.now()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
export function dailyPlan(profile, now = Date.now()) {
  const day = dayKey(now);
  if (profile.daily?.day !== day)
    profile.daily = { day, completed: [], startedAt: now };
  return profile.daily;
}
export function finishDaily(profile, kind, now = Date.now()) {
  const plan = dailyPlan(profile, now);
  if (
    !["words", "maths", "discovery"].includes(kind) ||
    plan.completed.includes(kind)
  )
    return false;
  plan.completed.push(kind);
  return true;
}
export function reviewOrder(entries, skills, now = Date.now()) {
  return [...entries].sort((a, b) => {
    const earliest = (term) =>
      [0, 1, 2]
        .map((i) => skills["notebook:" + term + ":" + i])
        .filter(Boolean)
        .sort((x, y) => x.due - y.due)[0];
    const x = earliest(a.term),
      y = earliest(b.term);
    const rank = (s) => (s?.due && s.due <= now ? 0 : s ? 1 : 2);
    return (
      rank(x) - rank(y) ||
      (x?.due || 0) - (y?.due || 0) ||
      a.term.localeCompare(b.term, "en-GB")
    );
  });
}
export const beaconLesson = Object.freeze({
  id: "place-value",
  title: "Light the place-value beacon",
  stages: [
    "Watch a worked example",
    "Try with a guide",
    "Try independently",
    "Apply in a new place",
  ],
  // Different numbers prevent copying the worked answer into the independent checks.
  examples: [
    { number: "34,782", digit: 7, column: "hundreds", unit: 100, answer: 700 },
    { number: "26,453", digit: 4, column: "hundreds", unit: 100, answer: 400 },
    {
      number: "58,216",
      digit: 8,
      column: "thousands",
      unit: 1000,
      answer: 8000,
    },
    { number: "73,594", digit: 5, column: "hundreds", unit: 100, answer: 500 },
  ],
});
export function beaconExample(stage, now = Date.now()) {
  const item = { ...beaconLesson.examples[stage] };
  // Review variants on later calendar days, while retaining correct place values.
  if (stage >= 2 && Number(dayKey(now).replaceAll("-", "")) % 2 === 0) {
    return stage === 2
      ? {
          number: "46,138",
          digit: 6,
          column: "thousands",
          unit: 1000,
          answer: 6000,
        }
      : {
          number: "82,749",
          digit: 7,
          column: "hundreds",
          unit: 100,
          answer: 700,
        };
  }
  return item;
}
export function contentReadiness(dashboard, studentId, now = Date.now()) {
  const progress = (dashboard.progress || []).filter(
    (x) => x.student_id === studentId,
  );
  const lessons = dashboard.lessons || [];
  const due = progress.filter(
    (x) => x.next_review_at && Date.parse(x.next_review_at) <= now,
  );
  const pending = lessons.filter((x) => x.status === "pending_review");
  const fresh = lessons.filter(
    (x) =>
      x.status === "approved" &&
      !progress.some((p) => p.skill_id === x.skill_id),
  );
  return {
    due: due.length,
    pending: pending.length,
    ready: fresh.length,
    next: due.length
      ? "A familiar skill is due: review before adding more."
      : pending.length
        ? "Review the waiting content before requesting another lesson."
        : fresh.length
          ? "An approved mission is ready. Reuse it before generating more."
          : "Prepare one small English mission, then check and approve it.",
  };
}

// Prioritise the actual due facet; rotating blindly can leave one facet overdue forever.
export function nextNotebookFacet(
  term,
  skills,
  rotation = 0,
  now = Date.now(),
) {
  const facets = [0, 1, 2].map((i) => ({
    i,
    record: skills["notebook:" + term + ":" + i],
  }));
  const due = facets
    .filter((x) => x.record?.due && x.record.due <= now)
    .sort((a, b) => a.record.due - b.record.due);
  if (due.length) return due[0].i;
  const unseen = facets.find((x) => !x.record);
  if (unseen) return unseen.i;
  return rotation % 3;
}
export function completedDiscoveryToday(profile, lab, now = Date.now()) {
  const today = dayKey(now);
  if (
    lab?.completed &&
    Number.isFinite(lab.completedAt) &&
    dayKey(lab.completedAt) === today
  )
    return true;
  return (profile.events || []).some(
    (e) =>
      Number.isFinite(e.at) &&
      dayKey(e.at) === today &&
      (e.type === "mission_completed" ||
        (e.type === "xp_awarded" && e.mission === "science:dissolving-001")),
  );
}
