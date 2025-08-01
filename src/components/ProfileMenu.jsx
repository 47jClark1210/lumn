import { Card, Avatar, Button, Typography, Divider } from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

function ProfileMenu({ user, onLogout }) {
  return (
    <Card
      bordered={false}
      style={{
        width: 260,
        boxShadow: '0 4px 24px rgba(20,24,75,0.10)',
        borderRadius: 12,
        padding: 0,
      }}
      bodyStyle={{ padding: 18, paddingBottom: 10 }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Avatar
          size={56}
          src={user?.avatar}
          icon={<UserOutlined />}
          style={{ marginBottom: 4 }}
        />
        <Typography.Title level={5} style={{ margin: 0 }}>
          {user?.name || 'User Name'}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {user?.email || 'user@email.com'}
        </Typography.Text>
      </div>
      <Divider style={{ margin: '14px 0 10px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Link to="/ProfilePreferences">
          <Button
            block
            icon={<SettingOutlined />}
            style={{ textAlign: 'left', borderRadius: 8, fontWeight: 500 }}
          >
            Preferences
          </Button>
        </Link>
        <Button
          block
          danger
          icon={<PoweroffOutlined />}
          onClick={onLogout}
          style={{ borderRadius: 8, fontWeight: 500 }}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
}

export default ProfileMenu;
