import '../styles/ProfilePreferences.css';
import { useState } from 'react';
import { Card, Divider, message, Spin, Alert } from 'antd';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileEditForm from '../components/ProfileEditForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { useUser } from '../context/UserContext';
import { updateProfile, uploadAvatar } from '../utils/api';

function ProfilePreferences() {
  const { user, refreshUser, loading, error } = useUser();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);

  // Handle avatar upload
  const handleAvatarUpload = async (file) => {
    setAvatarUploading(true);
    try {
      await uploadAvatar(file);
      await refreshUser();
      message.success('Avatar updated!');
    } catch (err) {
      message.error('Failed to update avatar.');
    } finally {
      setAvatarUploading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (values) => {
    setProfileUpdating(true);
    try {
      await updateProfile(values);
      await refreshUser();
      message.success('Profile updated!');
    } catch (err) {
      message.error('Failed to update profile.');
    } finally {
      setProfileUpdating(false);
    }
  };

  if (loading)
    return <Spin style={{ display: 'block', margin: '64px auto' }} />;
  if (error)
    return (
      <Alert
        type="error"
        message={error}
        style={{ maxWidth: 500, margin: '32px auto' }}
      />
    );

  return (
    <Card title="My Profile" style={{ maxWidth: 500, margin: '32px auto' }}>
      <ProfileAvatar
        avatarUrl={user?.avatar_url}
        onUpload={handleAvatarUpload}
        uploading={avatarUploading}
      />
      <Divider />
      <ProfileEditForm
        user={user}
        onUpdate={handleProfileUpdate}
        updating={profileUpdating}
      />
      <Divider />
      <ChangePasswordForm />
    </Card>
  );
}

export default ProfilePreferences;
