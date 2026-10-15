// Only clips that have been generated, listened to and approved belong here.
// Missing entries deliberately fall back to the best en-GB device voice.
export const APPROVED_AUDIO = Object.freeze({});

export function approvedClip(wordId, kind) {
  const entry = APPROVED_AUDIO[wordId];
  return entry && typeof entry[kind] === 'string' ? entry[kind] : null;
}
