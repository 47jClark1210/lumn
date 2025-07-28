import '../styles/Collaboration.css';
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Divider,
  List,
  Popover,
  FloatButton,
} from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import Leaderboard from '../components/Leaderboard';

function Collaboration() {
  // Example user and OKR data (replace with your real data)
  const user = {
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    email: 'jane.doe@email.com',
    phone: '555-1234',
    team: 'Product Development',
  };
  const okrs = [
    { title: 'Improve User Engagement', status: 'Active', progress: 80 },
    { title: 'Launch New Feature', status: 'Completed', progress: 100 },
  ];

  return (
    <>
      <Card
        style={{
          maxWidth: 700,
          margin: '0 auto',
          borderRadius: 16,
          boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
          marginBottom: 24,
          padding: 0,
          border: 'none',
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            marginBottom: 24,
          }}
        >
          <Avatar
            src={user.avatar}
            size={64}
            style={{ boxShadow: '0 2px 8px rgba(20,24,75,0.10)' }}
          />
          <Descriptions
            title={
              <span style={{ fontWeight: 700, fontSize: 22, color: '#14184b' }}>
                {user.name}
              </span>
            }
            column={1}
            labelStyle={{ fontWeight: 600, color: '#888' }}
          >
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Team">
              <Tag color="#1890ff" style={{ fontWeight: 600, borderRadius: 8 }}>
                {user.team}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider style={{ margin: '24px 0' }} />
        <h3 style={{ fontWeight: 700, color: '#14184b', marginBottom: 16 }}>
          OKRs Involved
        </h3>
        <List
          itemLayout="horizontal"
          dataSource={okrs}
          renderItem={(okr) => (
            <List.Item style={{ padding: '12px 0' }}>
              <List.Item.Meta
                title={
                  <span style={{ fontWeight: 600, fontSize: 16 }}>
                    {okr.title}
                  </span>
                }
                description={
                  <>
                    <Tag
                      color={okr.status === 'Active' ? 'green' : 'red'}
                      style={{ borderRadius: 8, fontWeight: 500 }}
                    >
                      {okr.status}
                    </Tag>
                    <span style={{ marginLeft: 8, color: '#888' }}>
                      Progress:{' '}
                      <b style={{ color: '#1890ff' }}>{okr.progress}%</b>
                    </span>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      <Popover
        content={<Leaderboard />}
        title="Leaderboard"
        trigger="click"
        placement="left"
      >
        <FloatButton
          icon={<TrophyOutlined />}
          style={{ right: 24, bottom: 24 }}
          tooltip="Show Leaderboard"
        />
      </Popover>
    </>
  );
}

export default Collaboration;
