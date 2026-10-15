// Versioned illustration registry. Every word points to a reusable concept,
// never to a learner-specific or remotely generated image. Approved local art
// can later replace a fallback without changing lesson data or progress IDs.
export const ILLUSTRATION_REGISTRY_VERSION = 1;
export const ILLUSTRATIONS = Object.freeze(Object.fromEntries([
  'apple','book','cat','chair','door','house','school','heart','hands','rain','sun',
  'owl','key','magnify','clock','speech','people','map','thought','science','leaf','stars'
].map(id=>[id,Object.freeze({id,kind:'layered-svg',review:'approved-fallback',version:1})])));

export function illustrationKey(value) {
  return typeof value === 'string' && ILLUSTRATIONS[value] ? value : 'book';
}
