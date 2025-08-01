import { useEffect, useState } from 'react';
import { Card, Divider, message } from 'antd';

function ProfilePage({ yourAuthToken }) {
  const [user, setUser] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetch('/api/users/me', {
      headers: { Authorization: `Bearer ${yourAuthToken}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setAvatarUrl(data.avatar_url);
      });
  }, [yourAuthToken]);

  const handleAvatarUpload = (url) => {
    setAvatarUrl(url);
    message.success('Avatar updated!');
  };

  const handleProfileUpdate = (data) => {
    setUser(data);
    message.success('Profile updated!');
  };

  return (
    <Card title="My Profile" style={{ maxWidth: 500, margin: '32px auto' }}>
      {/* <ProfileAvatar avatarUrl={avatarUrl} onUpload={handleAvatarUpload} /> */}
      <Divider />
      {/* <ProfileEditForm user={user} onUpdate={handleProfileUpdate} /> */}
      <Divider />
      {/* <ChangePasswordForm /> */}
    </Card>
  );
}

export default ProfilePage;