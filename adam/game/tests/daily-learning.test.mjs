import test from "node:test";
import assert from "node:assert/strict";
import {
  dailyPlan,
  finishDaily,
  dayKey,
  beaconExample,
  reviewOrder,
  contentReadiness,
} from "../src/daily-learning.js";
import {
  snapshotProfile,
  restoreProfile,
  validateSnapshot,
} from "../src/device-sync.js";
import { fresh, createProfile, KEY } from "../src/progress.js";
import { Window } from "happy-dom";
test("daily learning persists, never awards XP, resets on the London calendar day", () => {
  const p = { xp: 12 };
  const now = Date.parse("2026-10-15T23:30:00Z");
  assert.equal(dayKey(now), "2026-10-16");
  finishDaily(p, "maths", now);
  finishDaily(p, "maths", now);
  assert.deepEqual(dailyPlan(p, now).completed, ["maths"]);
  assert.equal(p.xp, 12);
  assert.deepEqual(dailyPlan(p, now + 86400000).completed, []);
});
test("place-value transfer examples vary by day and retain mathematically valid values", () => {
  for (const day of ["2026-10-16", "2026-10-17"])
    for (let stage = 0; stage < 4; stage++) {
      const e = beaconExample(stage, Date.parse(day));
      const digits = e.number.replace(",", "");
      const index = digits.indexOf(String(e.digit));
      assert.equal(e.digit * 10 ** (digits.length - index - 1), e.answer);
      assert.equal(e.digit * e.unit, e.answer);
    }
  assert.notEqual(
    beaconExample(2, Date.parse("2026-10-16")).answer,
    beaconExample(2, Date.parse("2026-10-17")).answer,
  );
});
test("recall prioritises due evidence while content planning reuses lessons and waits for review", () => {
  const entries = [{ term: "alpha" }, { term: "beta" }];
  assert.equal(
    reviewOrder(entries, { "notebook:beta:0": { due: 1 } }, 100)[0].term,
    "beta",
  );
  const d = {
    lessons: [
      { status: "pending_review" },
      { status: "approved", skill_id: "a" },
    ],
    progress: [],
  };
  assert.match(contentReadiness(d, "s").next, /Review the waiting/);
  assert.match(
    contentReadiness({ ...d, lessons: d.lessons.slice(1) }, "s").next,
    /approved mission/,
  );
});
test("cloud snapshot exports only one learner and restores without touching other learners or auth", () => {
  const s = new Window().localStorage,
    root = fresh();
  createProfile(root, "joseph", "Joseph", 4);
  root.profiles.explorer.xp = 8;
  s.setItem(KEY, JSON.stringify(root));
  s.setItem("ala-parent-session", "PRIVATE");
  s.setItem(
    "ala-notebook-v1",
    JSON.stringify({
      version: 1,
      learners: {
        explorer: { notice: { term: "notice" } },
        joseph: { other: { term: "other" } },
      },
    }),
  );
  const payload = snapshotProfile(s, "explorer");
  assert.ok(validateSnapshot(payload));
  assert.equal(JSON.stringify(payload).includes("PRIVATE"), false);
  assert.equal(JSON.stringify(payload).includes("Joseph"), false);
  root.profiles.explorer.xp = 22;
  s.setItem(KEY, JSON.stringify(root));
  restoreProfile(s, "explorer", payload);
  assert.equal(JSON.parse(s.getItem(KEY)).profiles.explorer.xp, 8);
  assert.equal(JSON.parse(s.getItem(KEY)).profiles.joseph.year, 4);
  assert.equal(s.getItem("ala-parent-session"), "PRIVATE");
  assert.equal(
    JSON.parse(s.getItem("ala-notebook-v1")).learners.joseph.other.term,
    "other",
  );
  assert.throws(
    () => restoreProfile(s, "explorer", { version: 1 }),
    /incompatible/,
  );
});
