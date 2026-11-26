export function deviceProfile() {
  const mobile = matchMedia('(max-width: 760px)').matches;
  const constrained = navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  return { mobile, constrained, pixelRatio: Math.min(devicePixelRatio || 1, constrained ? 1 : mobile ? 1.4 : 1.75) };
}

export class QualityMonitor {
  constructor(renderer, maxRatio) {
    this.renderer = renderer;
    this.maxRatio = maxRatio;
    this.samples = [];
    this.lastAdjustment = 0;
    this.fps = 60;
  }
  sample(dt, elapsed) {
    if (dt <= 0 || dt > .25) return;
    this.samples.push(dt);
    if (this.samples.length < 120) return;
    this.fps = 1 / (this.samples.reduce((a, b) => a + b, 0) / this.samples.length);
    this.samples.length = 0;
    if (elapsed - this.lastAdjustment < 6) return;
    const current = this.renderer.getPixelRatio();
    const next = this.fps < 38 ? Math.max(.75, current * .8) : this.fps > 57 ? Math.min(this.maxRatio, current + .1) : current;
    if (Math.abs(next - current) > .01) {
      this.renderer.setPixelRatio(next);
      this.lastAdjustment = elapsed;
    }
  }
}
