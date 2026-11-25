import test from 'node:test';
import assert from 'node:assert/strict';
import { creationState, STAGES, smooth } from '../src/timeline.js';

const channels = ['particles', 'formation', 'wire', 'solid', 'explode', 'activation'];
const at = p => creationState(p);

test('the four named chapter targets are ordered and reachable within the scroll timeline', () => {
  assert.deepEqual(STAGES.map(stage => stage.name), ['IDEA', 'DESIGN', 'BUILD', 'REALITY']);
  assert.deepEqual(STAGES.map(stage => stage.description), [
    'Everything begins somewhere.', 'Giving ideas structure.',
    'Making complexity work.', 'Turning ideas into reality.',
  ]);
  let previous = -Infinity;
  for (const stage of STAGES) {
    assert(stage.position > previous && stage.position >= 0 && stage.position <= 3);
    previous = stage.position;
  }
  assert(at(STAGES[0].position).particles > .9, 'Idea target retains luminous structural particles');
  assert(at(STAGES[1].position).wire > .9, 'Design target clearly exposes construction lines');
  assert(at(STAGES[2].position).solid > .9 && at(STAGES[2].position).explode > .9, 'Build target shows physical exploded components');
  assert.equal(at(STAGES[3].position).activation, 1);
});

test('all state channels stay finite and normalized throughout forward and reverse travel', () => {
  const checkpoints = Array.from({ length: 601 }, (_, i) => -1 + i / 120);
  const forward = checkpoints.map(at);
  checkpoints.reverse().forEach((progress, i) => {
    const state = at(progress);
    assert.deepEqual(state, forward[forward.length - 1 - i], 'Revisiting the same scroll position restores exactly the same assembly state');
    assert.deepEqual(Object.keys(state).sort(), [...channels].sort());
    for (const [name, value] of Object.entries(state)) {
      assert(Number.isFinite(value) && value >= 0 && value <= 1, `${name} remains normalized at ${progress}`);
    }
  });
});

test('dark idea and completed reality have distinct stable endpoints, including scroll overshoot', () => {
  assert.deepEqual(at(0), { particles: 1, formation: 0, wire: 0, solid: 0, explode: 0, activation: 0 });
  assert.deepEqual(at(3), { particles: 0, formation: 1, wire: 0, solid: 1, explode: 0, activation: 1 });
  assert.deepEqual(at(-20), at(0));
  assert.deepEqual(at(20), at(3));
  assert.deepEqual(creationState(0, true), at(3), 'Hero starts with the finished reusable assembly');
});

test('the timeline reveals structure before material, assembles before activating, and never jumps', () => {
  let previous = at(0);
  for (let i = 1; i <= 3000; i++) {
    const p = i / 1000;
    const state = at(p);
    assert(state.formation >= previous.formation, 'Structural formation progresses forward');
    assert(state.particles <= previous.particles, 'Particle representation yields to structure');
    assert(state.solid >= previous.solid, 'Material reveal progresses forward');
    assert(state.activation >= previous.activation, 'Activation progresses forward');
    if (state.activation > 0) {
      assert.equal(state.solid, 1, 'Activation begins only after components are physical');
      assert(state.explode < .4, 'Activation begins near completed assembly');
    }
    for (const name of channels) assert(Math.abs(state[name] - previous[name]) < .01, `${name} transitions continuously`);
    previous = state;
  }
  assert(at(1).wire > .9 && at(1).solid === 0, 'Wireframe clearly precedes physical component reveal');
  assert.equal(smooth(1, 2, -1), 0);
  assert.equal(smooth(1, 2, 4), 1);
});
