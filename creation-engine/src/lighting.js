import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/environments/RoomEnvironment.js';

export function createLighting(scene, renderer) {
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1.35;
  room.dispose();
  pmrem.dispose();
  const key = new THREE.DirectionalLight(0xf1f3ff, 5);
  key.position.set(3, 5, 4);
  const rim = new THREE.DirectionalLight(0xc9d5e9, 3.5);
  rim.position.set(-4, 2, -2);
  const fill = new THREE.DirectionalLight(0xffe1bb, 2);
  fill.position.set(1, -3, 2);
  const core = new THREE.PointLight(0xffe5c2, 5, 6, 2);
  core.position.set(0, 0, 1.2);
  scene.add(key, rim, fill, core);
  return { core, dispose() { environment.dispose(); } };
}
