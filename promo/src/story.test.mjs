import assert from 'node:assert/strict';
import {test} from 'node:test';
import {storyCuts, storyPosition} from './story.mjs';

test('reading shots hold longer and the camera visits each shot in order', () => {
  const shots = ['index', 'title', 'excerpt', 'about'].map(name => ({file: `sample-${name}.png`}));
  const cuts = storyCuts(shots);
  assert.equal(cuts[0].from, 0);
  assert.equal(cuts.at(-1).to, 1);
  assert.ok(cuts[2].to - cuts[2].from > cuts[1].to - cuts[1].from);
  cuts.forEach(({from, to}, index) => {
    assert.equal(storyPosition(shots, from).index, index);
    assert.equal(storyPosition(shots, (from + to) / 2).index, index);
  });
  assert.deepEqual(storyPosition(shots, 1), {index: 3, progress: 1});
});

test('a single-shot project can hold for the entire scene', () => {
  assert.deepEqual(storyPosition([{file: 'travel-log-index.png'}], 0.5), {index: 0, progress: 0.5});
});
