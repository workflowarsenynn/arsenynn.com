import assert from 'node:assert/strict';
import {test} from 'node:test';
import {defaults, scenes, settings, scrollAt} from './settings.mjs';
import {rate} from './media.mjs';

const projects = ['party-protocol', 'annflow', 'arsenynn'];

test('all compositions have valid defaults, including 25 fps and custom resolution', () => {
  const schema = settings(projects).strict();
  for (const scene of Object.keys(scenes)) {
    const props = schema.parse(defaults(scene, projects));
    assert.equal(props.fps, 30);
    assert.ok(schema.safeParse({...props, fps: 25, width: 720, height: 1280}).success);
    assert.ok(!schema.safeParse({...props, width: 721}).success);
    assert.ok(!schema.safeParse({...props, project: 'unknown'}).success);
  }
});

test('scroll interpolates smoothly, pauses at stops, and works in reverse', () => {
  assert.equal(scrollAt([10], 0.5), 10);
  assert.equal(scrollAt([0, 100, 250], 0.5), 100);
  assert.equal(scrollAt([0, 100, 250], 0.53), 100);
  assert.equal(scrollAt([250, 100, 0], 1), 0);
  let previous = 0;
  for (let frame = 0; frame <= 480; frame++) {
    const current = scrollAt([0, 100, 250], frame / 480);
    assert.ok(current >= previous && current - previous < 1.5);
    previous = current;
  }
});

test('source FPS preserves the fractional rate and rejects unknown rates', () => {
  assert.equal(rate('30000/1001'), 30000 / 1001);
  assert.throws(() => rate('0/0'));
});
