import * as THREE from 'three';
import { loadEngine } from './asset.js';
import { createLighting } from './lighting.js';
import { deviceProfile, QualityMonitor } from './performance.js';
import { createSignals } from './signals.js';

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
    const signals = createSignals();
    engine.assembly.add(signals.root);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const anchorWorld = new THREE.Vector3();
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
      render(state, time, interaction, overrides, cinematic, dt, selection) {
        engine.update(state, time, overrides, selection);
        const aspect = width / height;
        const distance = (aspect < .95 ? 11.8 : 10.8) / interaction.zoom;
        camera.position.set(.6 + interaction.parallaxX * .14, .3 - interaction.parallaxY * .12, distance);
        camera.lookAt(0, 0, 0);
        // Three-quarter product view reveals the concentric shaft and the back assembly.
        engine.assembly.rotation.set(.16 - selection.amount*.06 + interaction.x, -.26 + selection.amount*.15 + interaction.y + cinematic, -.055);
        engine.assembly.scale.setScalar(1 - Math.max(state.explode, overrides.explode) * .1);
        lighting.core.intensity = 1 + state.activation * 4;
        monitor.sample(dt, time);
        const settling = signals.update(selection.id, selection.amount, time, dt, selection.reduced);
        renderer.render(scene, camera);
        return settling;
      },
      projectAnchors() {
        return engine.anchors.map(anchor=>{
          anchorWorld.fromArray(anchor.node.userData.hotspot || [0,0,0]).applyMatrix4(anchor.node.matrixWorld);
          anchorWorld.project(camera);
          return { id:anchor.node.userData.capability, x:(anchorWorld.x*.5+.5)*width, y:(-.5*anchorWorld.y+.5)*height, visible:anchorWorld.z>-1 && anchorWorld.z<1 && Math.abs(anchorWorld.x)<.98 && Math.abs(anchorWorld.y)<.98 };
        });
      },
      pick(clientX, clientY) {
        const rect=canvas.getBoundingClientRect();
        pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);
        raycaster.setFromCamera(pointer,camera);
        const hits=raycaster.intersectObject(engine.model,true);
        for (const hit of hits) {
          let node=hit.object;
          while (node && !node.userData.capability) node=node.parent;
          if (node?.userData.capability) return node.userData.capability;
        }
        return hits.length ? 'mo' : null;
      },
      dispose() { engine.assembly.remove(signals.root); signals.dispose(); engine.dispose(); lighting.dispose(); renderer.dispose(); },
    };
  } catch (error) { renderer?.dispose(); throw error; }
}
