// Pure planning/validation layer; contains no provider keys or network calls.
// A hosted worker must own generation, budgets and publication transactions.
export function nextContent({ skills, mastery, catalog, limit = 3 }) {
  const eligible = skills.filter(
    (s) =>
      Array.isArray(s.prerequisites) &&
      s.prerequisites.every((id) => mastery[id] === 'Secure') &&
      mastery[s.id] !== 'Secure',
  );
  eligible.sort(
    (a, b) =>
      (mastery[a.id] === 'Review due' ? -1 : 0) -
      (mastery[b.id] === 'Review due' ? -1 : 0),
  );
  return eligible.slice(0, Math.max(0, Math.min(limit, 10))).map((skill) => {
    const found = catalog.find(
      (c) => c.skill === skill.id && c.status === 'approved',
    );
    return found
      ? { type: 'reuse', skill: skill.id, lesson: found.id }
      : { type: 'generation_requested', skill: skill.id, requiresReview: true };
  });
}
export function budgetAllows(ledger, estimate, limits) {
  return (
    Number.isFinite(estimate) &&
    estimate >= 0 &&
    limits.enabled === true &&
    ledger.spent + ledger.reserved + estimate <= limits.maxSpend &&
    ledger.requests < limits.maxRequests
  );
}
export function inspectCandidate(value) {
  const reasons = [];
  if (
    !value ||
    value.version !== 1 ||
    typeof value.id !== 'string' ||
    !Array.isArray(value.choices) ||
    !Number.isInteger(value.answer) ||
    value.answer < 0 ||
    value.answer >= value.choices.length
  )
    reasons.push('Invalid lesson structure');
  if (!value || typeof value.objective !== 'string' || !value.objective.trim())
    reasons.push('Missing learning objective');
  const serialized = JSON.stringify(value ?? {});
  if (
    /<script|javascript:|https?:\/\/|api[_-]?key|ignore previous instructions/i.test(
      serialized,
    )
  )
    reasons.push(
      'Unsafe executable, external link or instruction-like content',
    );
  if (value?.verification?.type === 'arithmetic') {
    const { left, right, operator, expected } = value.verification;
    const result =
      operator === '+'
        ? left + right
        : operator === '-'
          ? left - right
          : operator === '*'
            ? left * right
            : operator === '/' && right !== 0
              ? left / right
              : NaN;
    if (
      !Number.isFinite(left) ||
      !Number.isFinite(right) ||
      !Number.isFinite(result) ||
      result !== expected ||
      String(expected) !== value.choices?.[value.answer]
    )
      reasons.push('Arithmetic answer mismatch');
  }
  return {
    status: reasons.length ? 'quarantined' : 'needs_review',
    reasons,
    canPublish: false,
  };
}
export function approveCandidate(candidate, review) {
  const result = inspectCandidate(candidate);
  if (
    result.status === 'quarantined' ||
    !review?.reviewerId ||
    review.answerChecked !== true ||
    review.languageChecked !== true ||
    review.curriculumChecked !== true
  )
    throw Error('Educational review required before approval');
  return {
    ...candidate,
    status: 'approved',
    audit: {
      reviewerId: review.reviewerId,
      approvedAt: review.at,
      checks: ['answer', 'language', 'curriculum'],
    },
  };
}
