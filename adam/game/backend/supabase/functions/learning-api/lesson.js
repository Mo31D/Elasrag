export const lexicon = Object.freeze({
  curious: 'Wanting to find out more.',
  puzzled: 'Unsure because something is difficult to understand.',
  relieved: 'Happy and relaxed because a worry has gone away.',
  confident: 'Feeling sure that you can try or do something.',
});
// This semantic gate complements JSON Schema; it does not replace adult review.
export function checkLesson(value, expectedWord) {
  const reasons = [];
  if (!value || typeof value !== 'object')
    return { ok: false, reasons: ['Not an object'] };
  if (value.word !== expectedWord || value.definition !== lexicon[expectedWord])
    reasons.push('Canonical word or definition mismatch');
  if (value.choices?.[value.answer] !== expectedWord)
    reasons.push('Answer does not match the target word');
  if (!new RegExp('\\b' + expectedWord + '\\b', 'i').test(value.example || ''))
    reasons.push('Example omits target word');
  if (value.question !== `Which word means: ${lexicon[expectedWord]}`)
    reasons.push('Question is not anchored to the verified definition');
  if (
    value.sentenceParts?.[0] !== 'I felt' ||
    value.sentenceParts?.[1] !== expectedWord ||
    value.sentenceParts?.[2] !== 'because' ||
    !/[.!?]$/.test(value.sentenceParts?.[3] || '')
  )
    reasons.push('Sentence pattern mismatch');
  const content = JSON.stringify(value);
  if (
    /<|>|https?:|javascript:|ignore previous|api[_-]?key|password|stammer|diagnos|(?:kill|murder|suicide|gambl|loot box)/i.test(
      content,
    )
  )
    reasons.push('Unsafe or out-of-scope content');
  return { ok: reasons.length === 0, reasons, requiresHumanReview: true };
}
export function buildPrompt(word) {
  if (!Object.hasOwn(lexicon, word)) throw Error('Unsupported word');
  return `Create a short fictional school detective mission in natural British English. The audience is primary learners revisiting vocabulary; keep all sentences short. Return only the requested JSON. No real people, private learner details, external links, violence, medical advice, speech grading, timers, gambling or advertising. Use two or three brief story scenes, an example, a hint and a sentence to rebuild. The sole target word is ${word}. Copy its definition exactly: ${lexicon[word]} The question must be exactly: Which word means: ${lexicon[word]} Three unique choices must come from curious, puzzled, relieved, confident, including ${word}; answer is its zero-based index. sentenceParts must have four parts: "I felt", "${word}", "because", and one short reason ending in a full stop. version=1; template="feeling-detective-v1". The mission will require adult review before use.`;
}
export function scoreAnswer(lesson, kind, answer) {
  if (kind === 'vocabulary')
    return Number.isInteger(answer) && answer === lesson.answer;
  if (kind === 'sentence')
    return (
      Array.isArray(answer) &&
      answer.length === 4 &&
      answer.every((n, i) => n === i)
    );
  throw Error('Unknown activity kind');
}
export async function sha256(text) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
}

export function chooseSkill(
  available,
  progress,
  prerequisites,
  now = Date.now(),
) {
  const due = (p) =>
    p?.next_review_at && new Date(p.next_review_at).getTime() <= now;
  const priority = (s) => {
    const p = progress.find((p) => p.skill_id === s.id);
    return due(p) ? 0 : !p ? 1 : p.state === 'Learning' ? 2 : 3;
  };
  return [...available]
    .sort((a, b) => priority(a) - priority(b))
    .find((s) => {
      const p = progress.find((p) => p.skill_id === s.id);
      if (p && p.state !== 'Learning' && !due(p)) return false;
      return prerequisites
        .filter((r) => r.skill_id === s.id)
        .every((r) =>
          progress.some(
            (p) =>
              p.skill_id === r.requires_id && p.state === 'Secure' && !due(p),
          ),
        );
    });
}
