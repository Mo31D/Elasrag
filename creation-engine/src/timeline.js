// One reversible state function drives every representation of the same assembly.
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export function smooth(a, b, x) {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}
export const STAGES = [
  { name: 'IDEA', description: 'Everything begins somewhere.', position: .38 },
  { name: 'DESIGN', description: 'Giving ideas structure.', position: 1.1 },
  { name: 'BUILD', description: 'Making complexity work.', position: 2 },
  { name: 'REALITY', description: 'Turning ideas into reality.', position: 3 },
];
export function creationState(progress, hero = false) {
  const p = clamp(progress, 0, 3);
  if (hero) return { particles: 0, formation: 1, wire: 0, solid: 1, explode: 0, activation: 1 };
  return {
    particles: (1 - smooth(.65, 1.15, p)),
    formation: smooth(0, .7, p),
    wire: smooth(.35, .95, p) * (1 - smooth(1.45, 2.15, p)),
    solid: smooth(1.35, 1.95, p),
    explode: smooth(1.05, 1.6, p) * (1 - smooth(2, 2.9, p)),
    activation: smooth(2.55, 3, p),
  };
}
