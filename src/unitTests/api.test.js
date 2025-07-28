import assert from 'node:assert/strict';
import test from 'node:test';
import axios from 'axios';
import * as api from '../utils/api.js';

// Helper to stub and track calls
function stubMethod(obj, method, impl) {
  const original = obj[method];
  let calls = [];
  obj[method] = (...args) => {
    calls.push(args);
    return impl(...args);
  };
  return {
    restore: () => {
      obj[method] = original;
    },
    calls,
  };
}

test('fetchUserProfile calls correct endpoint and returns data', async () => {
  const mockData = { id: 1, name: 'Test User' };
  const stub = stubMethod(axios, 'get', async () => ({
    data: mockData,
  }));
  const result = await api.fetchUserProfile('token');
  assert.strictEqual(stub.calls.length, 1);
  assert.ok(stub.calls[0][0].includes('/users/me'));
  assert.ok(stub.calls[0][1].headers);
  assert.deepStrictEqual(result, mockData);
  stub.restore();
});

test('updateProfile calls correct endpoint and returns data', async () => {
  const mockData = { id: 1, name: 'Updated User' };
  const stub = stubMethod(axios, 'put', async () => ({
    data: mockData,
  }));
  const result = await api.updateProfile({ name: 'Updated User' }, 'token');
  assert.strictEqual(stub.calls.length, 1);
  assert.ok(stub.calls[0][0].includes('/users/me'));
  assert.deepStrictEqual(stub.calls[0][1], { name: 'Updated User' });
  assert.ok(stub.calls[0][2].headers);
  assert.deepStrictEqual(result, mockData);
  stub.restore();
});

test('changePassword calls correct endpoint and returns data', async () => {
  const mockData = { success: true };
  const stub = stubMethod(axios, 'post', async () => ({
    data: mockData,
  }));
  const result = await api.changePassword('old', 'new', 'token');
  assert.strictEqual(stub.calls.length, 1);
  assert.ok(stub.calls[0][0].includes('/change-password'));
  assert.deepStrictEqual(stub.calls[0][1], {
    oldPassword: 'old',
    newPassword: 'new',
  });
  assert.ok(stub.calls[0][2].headers);
  assert.deepStrictEqual(result, mockData);
  stub.restore();
});

test('uploadAvatar calls correct endpoint and returns data', async () => {
  const mockData = { avatarUrl: 'url' };
  const stub = stubMethod(axios, 'post', async () => ({
    data: mockData,
  }));
  // Use a dummy object for file, since File may not be defined in node
  const file = { name: 'avatar.png', type: 'image/png' };
  const result = await api.uploadAvatar(file, 'token');
  assert.strictEqual(stub.calls.length, 1);
  assert.ok(stub.calls[0][0].includes('/avatar'));
  assert.ok(stub.calls[0][1]); // formData
  assert.ok(stub.calls[0][2].headers);
  assert.deepStrictEqual(result, mockData);
  stub.restore();
});

test('searchAll calls correct endpoint and returns results', async () => {
  const mockData = { results: [{ id: 1, name: 'Result' }] };
  const stub = stubMethod(axios, 'get', async () => ({
    data: mockData,
  }));
  const result = await api.searchAll('query', 'token');
  assert.strictEqual(stub.calls.length, 1);
  assert.ok(stub.calls[0][0].includes('/search'));
  assert.ok(stub.calls[0][1].headers);
  assert.deepStrictEqual(result, mockData.results);
  stub.restore();
});

// Add more tests for error handling as needed
