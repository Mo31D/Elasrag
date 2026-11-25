import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CAPABILITIES } from '../src/capabilities.js';

const bytes = await readFile(new URL('../assets/mo-signature.glb', import.meta.url));
assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
assert.equal(bytes.readUInt32LE(4), 2);
assert.equal(bytes.readUInt32LE(8), bytes.length);
assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
const jsonLength = bytes.readUInt32LE(12);
const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));
const components = gltf.nodes.filter(node => node.extras?.component === true);
const capabilities = components.filter(node => node.extras.capability);
const sceneRoot = gltf.nodes[gltf.scenes[gltf.scene || 0].nodes[0]];

test('the personal Mo signature stays self-contained and within the mobile geometry budget', () => {
  assert.equal(gltf.asset.version, '2.0');
  assert(bytes.length < 1.5 * 1024 * 1024, 'Signature model remains below 1.5 MiB');
  assert.equal(gltf.meshes.length, 32);
  assert.equal(gltf.materials.length, 5);
  const triangles = gltf.meshes.reduce((count, mesh) => count + mesh.primitives.reduce((sum, primitive) => {
    assert.equal(primitive.mode ?? 4, 4, 'Mesh primitives use triangles');
    assert(primitive.indices !== undefined, 'Indexed geometry enables a verified triangle budget');
    assert(primitive.attributes.NORMAL !== undefined, 'Machined surfaces retain exported normals');
    return sum + gltf.accessors[primitive.indices].count / 3;
  }, 0), 0);
  assert(triangles > 0 && triangles < 60000, 'Signature stays below 60,000 triangles');
  assert.equal(gltf.buffers.length, 1);
  assert.equal(gltf.buffers[0].uri, undefined);
  assert.equal(gltf.images?.length || 0, 0);
  assert.equal(gltf.textures?.length || 0, 0);
});

test('the M and open O identity are semantic components in the original editable hierarchy', () => {
  assert.equal(sceneRoot.name, 'ELASRAG_MO_Signature');
  assert.equal(sceneRoot.extras.axis, 'Z');
  assert.equal(sceneRoot.extras.license, 'Original ELASRAG asset');
  assert.match(sceneRoot.extras.design, /Personal M monogram.*open O/);
  assert.equal(components.length, 7);
  const names = components.map(component => component.name);
  assert(names.includes('Mo_Core'));
  assert(names.includes('O_Frame'));
  assert(names.includes('Connection_Bridges'));
  assert.equal(new Set(names).size, components.length);
  for (const component of components) {
    const index = gltf.nodes.indexOf(component);
    assert(sceneRoot.children.includes(index), `${component.name} retains an independent root pivot`);
    assert(component.children.length > 0, 'Every component contains physical geometry');
    assert.equal(component.extras.explode.length, 3);
    assert(component.extras.explode.every(Number.isFinite));
  }
  assert.equal(components.find(component => component.name === 'Mo_Core').extras.capability, 'mo');
});

test('all five model capabilities match the public directory with finite hotspot anchors', () => {
  assert.equal(capabilities.length, 5);
  assert.deepEqual(capabilities.map(component => component.extras.capability).sort(), Object.keys(CAPABILITIES).sort());
  for (const component of capabilities) {
    assert.equal(typeof component.extras.label, 'string');
    assert(component.extras.label.length > 0);
    if (component.extras.capability !== 'mo') {
      assert.equal(component.extras.role, 'pod');
      assert.equal(component.extras.hotspot.length, 3);
      assert(component.extras.hotspot.every(value => Number.isFinite(value) && Math.abs(value) < 1), 'Hotspot offsets stay finite and local to their nodes');
      assert.equal(component.translation.length, 3);
      assert(component.translation.every(Number.isFinite));
      assert(Math.hypot(...component.translation) > 1, 'Work nodes surround the central personal signature');
    } else {
      assert.equal(component.extras.role, 'core');
    }
  }
});
