import * as THREE from 'three';
import { loadEngine } from './asset.js';
import { createLighting } from './lighting.js';
import { deviceProfile, QualityMonitor } from './performance.js';

export async function createScene(canvas) {
  const profile = deviceProfile();
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !profile.constrained, alpha: true, powerPreference: 'default' });
    renderer.setPixelRatio(profile.pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 60);
    const lighting = createLighting(scene, renderer);
    let engine;
    try { engine = await loadEngine(renderer, profile); }
    catch (error) { lighting.dispose(); throw error; }
    scene.add(engine.assembly);
    const monitor = new QualityMonitor(renderer, profile.pixelRatio);
    let width = 1, height = 1;
    function resize() {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    }
    resize();
    return {
      engine, renderer, profile, monitor, resize,
      render(state, time, interaction, overrides, cinematic, dt) {
        engine.update(state, time, overrides);
        const aspect = width / height;
        const distance = (aspect < .95 ? 11.8 : 10.8) / interaction.zoom;
        camera.position.set(.6 + interaction.parallaxX * .14, .3 - interaction.parallaxY * .12, distance);
        camera.lookAt(0, 0, 0);
        // Three-quarter product view reveals the concentric shaft and the back assembly.
        engine.assembly.rotation.set(.23 + interaction.x, -.43 + interaction.y + cinematic, -.16);
        engine.assembly.scale.setScalar(1 - Math.max(state.explode, overrides.explode) * .1);
        lighting.core.intensity = 1 + state.activation * 4;
        monitor.sample(dt, time);
        renderer.render(scene, camera);
      },
      dispose() { engine.dispose(); lighting.dispose(); renderer.dispose(); },
    };
  } catch (error) { renderer?.dispose(); throw error; }
}
