import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const bytes = await readFile(new URL('../assets/creation-engine.glb', import.meta.url));
assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
assert.equal(bytes.readUInt32LE(4), 2);
assert.equal(bytes.readUInt32LE(8), bytes.length);
assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
const roots = gltf.nodes.filter(node => node.extras?.component === true);

test('the original asset is a self-contained GLB with bounded geometry and no external downloads', () => {
  assert.equal(gltf.asset.version, '2.0');
  assert(bytes.length < 3 * 1024 * 1024, 'Keep the original geometry under the 3 MiB budget');
  assert.equal(gltf.buffers.length, 1);
  assert.equal(gltf.buffers[0].uri, undefined);
  assert.equal(gltf.textures?.length || 0, 0);
  assert.equal(gltf.images?.length || 0, 0);
  const root = gltf.nodes[gltf.scenes[gltf.scene || 0].nodes[0]];
  assert.equal(root.name, 'ELASRAG_Creation_Engine_01');
  assert.equal(root.extras.license, 'Original ELASRAG asset');
  assert.equal(root.extras.axis, 'Z');
  assert.equal(root.extras.version, '1.0');
});

test('all 16 independently animated component roots retain meaningful pivots and explosion metadata', () => {
  assert.equal(roots.length, 16);
  assert.equal(new Set(roots.map(node => node.name)).size, roots.length);
  const roles = {};
  for (const root of roots) {
    assert.match(root.name, /^0[1-7]_/);
    assert(root.children.length > 0, `${root.name} has physical geometry`);
    assert.equal(root.extras.explode.length, 3);
    assert(root.extras.explode.every(Number.isFinite));
    assert(['core', 'stator', 'housing', 'rotor', 'glass', 'pod', 'gimbal'].includes(root.extras.role));
    roles[root.extras.role] = (roles[root.extras.role] || 0) + 1;
  }
  assert.deepEqual(roles, { core: 1, stator: 1, housing: 2, rotor: 2, glass: 2, pod: 6, gimbal: 2 });
  for (const role of ['housing', 'rotor', 'glass']) {
    const pair = roots.filter(node => node.extras.role === role);
    assert(pair[0].extras.explode[2] * pair[1].extras.explode[2] < 0, `${role} front and rear separate along opposite shaft directions`);
  }
});

test('six physically based material families remain assigned to all mesh primitives', () => {
  assert.deepEqual(gltf.materials.map(material => material.name).sort(), [
    'Energy · warm white', 'Graphite · ceramic', 'Titanium · satin',
    'Titanium · diamond cut', 'Index · ivory', 'Glass · smoked optical',
  ].sort());
  assert.equal(gltf.meshes.length, 55);
  for (const mesh of gltf.meshes) for (const primitive of mesh.primitives) {
    assert(Number.isInteger(primitive.material) && primitive.material >= 0 && primitive.material < 6);
    assert(primitive.attributes.POSITION !== undefined);
    assert(primitive.attributes.NORMAL !== undefined, 'Exported normals preserve the machined surface finish');
  }
  const glass = gltf.materials.find(material => /Glass/.test(material.name));
  assert(glass.extensions.KHR_materials_transmission.transmissionFactor > .9);
  const energy = gltf.materials.find(material => /Energy/.test(material.name));
  assert(energy.emissiveFactor.some(value => value > 0));
});
