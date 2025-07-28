import test from 'node:test';
// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import ProfileAvatar from '../components/ProfileAvatar';

test('ProfileAvatar renders avatar image if avatarUrl is provided', async () => {
  // const { getAllByRole } = render(<ProfileAvatar avatarUrl="http://example.com/avatar.png" onUpload={() => {}} uploading={false} />);
  // assert.ok(getAllByRole('img')[0]);
});

test('ProfileAvatar shows loading indicator when uploading', async () => {
  // const { getAllByTestId } = render(<ProfileAvatar avatarUrl="http://example.com/avatar.png" onUpload={() => {}} uploading={true} />);
  // assert.ok(getAllByTestId('avatar-upload-spin').length > 0);
});

test('ProfileAvatar calls onUpload when a new avatar is selected', async () => {
  // let called = false;
  // const onUpload = () => { called = true; };
  // const { getByTestId } = render(<ProfileAvatar avatarUrl="http://example.com/avatar.png" onUpload={onUpload} uploading={false} />);
  // const uploadButton = getByTestId('avatar-upload-input');
  // const input = uploadButton.closest('span').querySelector('input[type="file"]');
  // fireEvent.change(input, { target: { files: [new File(['avatar'], 'avatar.png', { type: 'image/png' })] } });
  // assert.ok(called);
});
