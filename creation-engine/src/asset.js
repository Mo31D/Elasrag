import * as THREE from 'three';
import { GLTFLoader } from '../vendor/loaders/GLTFLoader.js';

export async function loadEngine(renderer, profile) {
  const gltf = await new GLTFLoader().loadAsync(new URL('../assets/creation-engine.glb', import.meta.url).href);
  const model = gltf.scene;
  model.updateMatrixWorld(true);
  const assembly = new THREE.Group();
  assembly.name = 'Creation_Engine_Experience';
  assembly.add(model);
  const components = [];
  const materials = new Set();
  const samples = [];
  let vertexIndex = 0;
  model.traverse(node => {
    if (node.userData.component) {
      components.push({ node, position: node.position.clone(), quaternion: node.quaternion.clone(), explode: new THREE.Vector3(...(node.userData.explode || [0, 0, 0])), role: node.userData.role });
    }
    if (!node.isMesh) return;
    const material = node.material;
    materials.add(material);
    node.frustumCulled = true;
    const positions = node.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      if (vertexIndex++ % (profile.constrained ? 85 : 45)) continue;
      const vertex = new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(node.matrixWorld);
      samples.push(vertex.x, vertex.y, vertex.z);
    }
  });
  const wires = [];
  for (const component of components) {
    const wireGroup = new THREE.Group();
    wireGroup.name = `${component.node.name}_construction`;
    const inverse = component.node.matrixWorld.clone().invert();
    component.node.traverse(mesh => {
      if (!mesh.isMesh || /glass/i.test(mesh.material.name)) return;
      const geometry = new THREE.EdgesGeometry(mesh.geometry, 27);
      geometry.applyMatrix4(inverse.clone().multiply(mesh.matrixWorld));
      const line = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: 0xbed0df, transparent: true, opacity: 0, depthWrite: false }));
      wireGroup.add(line);
      wires.push(line);
    });
    assembly.add(wireGroup);
    component.wire = wireGroup;
  }
  for (const material of materials) {
    material.userData.originalOpacity = material.opacity;
    material.userData.isGlass = /glass/i.test(material.name);
    material.userData.isEnergy = /energy/i.test(material.name);
    if (material.userData.isGlass) {
      material.transmission = profile.constrained || profile.mobile ? .15 : .4;
      material.roughness = .19;
      material.opacity = .45;
      material.userData.originalOpacity = .45;
    }
    // Room reflections carry the finish; keep the white light from washing it out.
    material.envMapIntensity = /graphite/i.test(material.name) ? .7 : 1.15;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(samples, 3));
  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { formation: { value: 1 }, opacity: { value: 0 }, density: { value: renderer.getPixelRatio() } },
    vertexShader: `uniform float formation; uniform float density; varying float brightness;
      void main(){
        vec3 p=position * max(.006,formation);
        float spread=sin(formation*3.14159)*.23;
        p += vec3(sin(position.y*8.),cos(position.z*7.),sin(position.x*9.))*spread;
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(16.*density / -mv.z,1.,5.);
        brightness=.45+.55*fract(sin(dot(position,vec3(12.9898,78.233,43.2)))*43758.5453);
      }`,
    fragmentShader: `uniform float opacity; varying float brightness;
      void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
      gl_FragColor=vec4(vec3(.84,.89,1.),pow(1.-r,1.4)*opacity*brightness);}`,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.name = 'Idea_structure_samples';
  assembly.add(particles);
  return {
    assembly, model, components, particles,
    update(state, time, overrides) {
      const explode = Math.max(state.explode, overrides.explode);
      const wireOpacity = state.wire + (1 - state.wire) * overrides.wireframe;
      const solidOpacity = state.solid * (1 - overrides.wireframe);
      model.visible = solidOpacity > .003;
      for (const material of materials) {
        const glass = material.userData.isGlass;
        const transparent = solidOpacity < .995 || glass;
        if (material.transparent !== transparent) { material.transparent = transparent; material.needsUpdate = true; }
        material.opacity = material.userData.originalOpacity * solidOpacity;
        material.depthWrite = solidOpacity > .95 && !glass;
        if (material.userData.isEnergy) material.emissiveIntensity = .6 + state.activation * 2;
      }
      for (const c of components) {
        c.node.position.copy(c.position).addScaledVector(c.explode, explode * .85);
        c.node.quaternion.copy(c.quaternion);
        if (c.role === 'rotor') c.node.rotateZ(time * .19 * state.activation * (/Rear/.test(c.node.name) ? -1 : 1));
        if (c.role === 'gimbal') c.node.rotateZ(Math.sin(time * .12) * .14 * state.activation);
        c.wire.position.copy(c.node.position);
        c.wire.quaternion.copy(c.node.quaternion);
        c.wire.scale.copy(c.node.scale);
        c.wire.visible = wireOpacity > .003;
      }
      for (const wire of wires) wire.material.opacity = wireOpacity * .65;
      particles.visible = state.particles > .003;
      particleMaterial.uniforms.opacity.value = state.particles;
      particleMaterial.uniforms.formation.value = state.formation;
    },
    dispose() {
      const geometries = new Set();
      assembly.traverse(node => { if (node.geometry) geometries.add(node.geometry); });
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      wires.forEach(w => w.material.dispose());
      particleMaterial.dispose();
    },
  };
}
