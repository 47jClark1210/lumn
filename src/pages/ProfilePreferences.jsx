import { useState } from 'react';
import { Form, Input, Button, Switch, Divider, message } from 'antd';
import '../styles/ProfilePreferences.css';

export default function ProfilePreferences() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      message.success('Preferences saved!');
    }, 1000);
  };

  const handleChangePassword = () => {
    message.success('Password changed!');
  };

  return (
    <div className="profile-preferences">
      <h2>Profile Preferences & Settings</h2>
      <div
        style={{
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: '40px auto',
            padding: 32,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(20,24,75,0.08)',
          }}
        >
          <h2>Profile Preferences & Settings</h2>
          <Divider />
          <Form layout="vertical" onFinish={handleSave}>
            <Form.Item label="Display Name" name="displayName">
              <Input placeholder="Your name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="Your email" />
            </Form.Item>
            <Form.Item
              label="Enable Email Notifications"
              name="notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Preferences
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <h3>Change Password</h3>
          <Form layout="vertical" onFinish={handleChangePassword}>
            <Form.Item label="Current Password" name="currentPassword">
              <Input.Password />
            </Form.Item>
            <Form.Item label="New Password" name="newPassword">
              <Input.Password />
            </Form.Item>
            <Form.Item label="Confirm New Password" name="confirmPassword">
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
