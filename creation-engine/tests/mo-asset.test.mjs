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

// Read the exported geometry, rather than repeating the generator's polygon logic.
// glTF splits vertices at normal seams, so topology checks weld by exported position.
function geometryAccessor(index) {
  const accessor = gltf.accessors[index];
  const view = gltf.bufferViews[accessor.bufferView];
  const readers = { 5121: ['readUInt8', 1], 5123: ['readUInt16LE', 2], 5125: ['readUInt32LE', 4], 5126: ['readFloatLE', 4] };
  const [read, size] = readers[accessor.componentType];
  const width = { SCALAR: 1, VEC3: 3 }[accessor.type];
  assert(width, 'Test reads supported exported accessor types');
  const start = 20 + jsonLength + 8 + (view.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = view.byteStride || width * size;
  return Array.from({ length: accessor.count }, (_, row) => Array.from({ length: width }, (_, col) => bytes[read](start + row * stride + col * size)));
}

test('the M body and inset export closed geometry with outward-facing triangle winding', () => {
  const mo = components.find(component => component.name === 'Mo_Core');
  const targetNodes = mo.children.map(index => gltf.nodes[index]).filter(node => ['Mo_Core__Titanium', 'Mo_Core__Graphite'].includes(node.name));
  assert.equal(targetNodes.length, 2, 'Both primary M surfaces are checked');
  for (const node of targetNodes) {
    const primitives = gltf.meshes[node.mesh].primitives;
    for (const primitive of primitives) {
      const positions = geometryAccessor(primitive.attributes.POSITION);
      const indices = geometryAccessor(primitive.indices).flat();
      const welded = new Map();
      const vertexIds = positions.map(position => {
        const key = position.map(value => Math.round(value * 1e6)).join(',');
        if (!welded.has(key)) welded.set(key, welded.size);
        return welded.get(key);
      });
      const edges = new Map();
      let signedVolume = 0;
      for (let index = 0; index < indices.length; index += 3) {
        const ids = indices.slice(index, index + 3);
        // Zero-area triangles created by bevel tips do not form geometric edges.
        if (new Set(ids.map(id => vertexIds[id])).size < 3) continue;
        const [a, b, c] = ids.map(id => positions[id]);
        signedVolume += (a[0] * (b[1] * c[2] - b[2] * c[1]) + a[1] * (b[2] * c[0] - b[0] * c[2]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
        for (let edge = 0; edge < 3; edge++) {
          const from = vertexIds[ids[edge]];
          const to = vertexIds[ids[(edge + 1) % 3]];
          if (from === to) continue;
          const key = [Math.min(from, to), Math.max(from, to)].join(':');
          const counts = edges.get(key) || { incidence: 0, orientation: 0 };
          counts.incidence++;
          counts.orientation += from < to ? 1 : -1;
          edges.set(key, counts);
        }
      }
      assert(edges.size > 0);
      for (const counts of edges.values()) {
        assert.equal(counts.incidence, 2, `${node.name} has no open or nonmanifold edges`);
        assert.equal(counts.orientation, 0, `${node.name} shares edges with consistent winding`);
      }
      assert(signedVolume > 0.01, `${node.name} encloses a positive volume with outward-facing surfaces`);
    }
  }
});
