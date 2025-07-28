import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getRandomInt,
  generateKeyResults,
  generateObjective,
} from '../utils/helpers.js';

test('getRandomInt returns a value within the range', async () => {
  for (let i = 0; i < 10; i++) {
    const val = getRandomInt(1, 5);
    assert.ok(val >= 1);
    assert.ok(val <= 5);
  }
});

test('generateKeyResults returns an array of key results', async () => {
  const results = generateKeyResults();
  assert.ok(Array.isArray(results));
  assert.ok(results.length >= 2);
  assert.ok(results.length <= 4);
  results.forEach((kr) => {
    assert.ok('text' in kr);
    assert.ok('percent' in kr);
    assert.ok('success' in kr);
  });
});

test('generateObjective returns an objective object', async () => {
  const obj = generateObjective(0);
  assert.ok('title' in obj);
  assert.ok('owner' in obj);
  assert.ok('team' in obj);
  assert.ok('dateCreated' in obj);
  assert.ok('objectivePercent' in obj);
  assert.ok('objectiveSuccess' in obj);
  assert.ok('keyResults' in obj);
  assert.ok(Array.isArray(obj.keyResults));
});
