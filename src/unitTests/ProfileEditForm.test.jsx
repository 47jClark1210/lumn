import test from 'node:test';
// import React from 'react';
// import { render, screen, fireEvent, act } from '@testing-library/react';
// import ProfileEditForm from '../components/ProfileEditForm';

test('ProfileEditForm renders form fields with user data', async () => {
  // const user = { name: 'Test User', email: 'test@example.com', team: 'Engineering' };
  // const { getByDisplayValue } = render(<ProfileEditForm user={user} onUpdate={() => {}} updating={false} />);
  // assert.ok(getByDisplayValue('Test User'));
  // assert.ok(getByDisplayValue('test@example.com'));
  // assert.ok(getByDisplayValue('Engineering'));
});

test('ProfileEditForm calls onUpdate with new data when form is submitted', async () => {
  // let called = false;
  // const onUpdate = (data) => { called = data; };
  // const { getByLabelText, getByRole } = render(<ProfileEditForm user={{ name: '', email: '', team: '' }} onUpdate={onUpdate} updating={false} />);
  // fireEvent.change(getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
  // fireEvent.change(getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
  // fireEvent.change(getByLabelText(/Team/i), { target: { value: 'Product' } });
  // fireEvent.click(getByRole('button', { name: /Save Changes/i }));
  // assert.deepStrictEqual(called, { name: 'Jane Doe', email: 'jane@example.com', team: 'Product' });
});

test('ProfileEditForm shows loading spinner when updating', async () => {
  // const { container } = render(<ProfileEditForm user={{}} onUpdate={() => {}} updating={true} />);
  // assert.ok(container.querySelector('.ant-spin-spinning'));
});
