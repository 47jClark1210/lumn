import './App.css';
import {
  Layout, Menu, Card, Button, Tooltip, Progress, Flex, Avatar, List, Tag, Divider, Modal, Dropdown, Upload, message, Form, Input
} from 'antd';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import {
  PieChartOutlined, ExperimentOutlined, StarOutlined, TeamOutlined, SolutionOutlined,
  SettingOutlined, UserOutlined, EditOutlined, UpOutlined, DownOutlined, PlusOutlined,
  MinusOutlined, PoweroffOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  fetchUserProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  searchAll
} from './api'; // <-- Import your API functions

const { Header, Content, Footer, Sider } = Layout;

// --- User and Utility Data ---
const SAMPLE_USERS = [
  { email: "jane.doe@email.com", isAdmin: true },
  { email: "john.smith@email.com", isAdmin: false },
  { email: "alice.lee@email.com", isAdmin: false },
  { email: "bob.brown@email.com", isAdmin: true }
];
function getRandomUser() {
  return SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)];
}

// --- Custom Hook for Fetching OKRs ---
function useOkrs() {
  const [okrs, setOkrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/okrs')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch OKRs');
        return res.json();
      })
      .then(data => {
        setOkrs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { okrs, loading, error };
}

// --- Analytics Page ---
function Analytics({ currentUser, isAdmin }) {
  const { okrs, loading, error } = useOkrs();
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (loading) return <div>Loading OKRs...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Objectives & Key Results</h2>
      <div className="objective-list">
        {okrs.map((okr, idx) => (
          <Card
            key={okr.id || idx}
            className={expandedIndex === idx ? 'card-expanded' : 'card-collapsed'}
            style={{ width: '100%', marginBottom: 10, minHeight: expandedIndex === idx ? 140 : 70, transition: 'height 0.3s' }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <Flex align="center" style={{ height: '70px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Title</div>
                <div style={{ fontSize: 11, fontWeight: '700', marginTop: 3, display: 'flex', alignItems: 'center' }}>
                  <span style={{ flex: 1 }}>{okr.title}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Owner</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar src={okr.owner_avatar} size={24} />
                  <span>{okr.owner_name}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Team</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TeamOutlined />
                  <span>{okr.team_name}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Date Created</div>
                <div>{okr.date_created}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <Tooltip title={`Progress: ${okr.progress || 0}%`}>
                  <Progress percent={okr.progress || 0} type="circle" width={48} />
                </Tooltip>
              </div>
              <div style={{ marginLeft: 12, cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}>
                {expandedIndex === idx ? <UpOutlined /> : <DownOutlined />}
              </div>
            </Flex>
            {expandedIndex === idx && (
              <div style={{ borderBottom: '1px solid #e0e0e0', width: '100%' }} />
            )}
            {expandedIndex === idx && okr.key_results && okr.key_results.map((kr, krIdx) => (
              <div
                key={krIdx}
                className="key-result-slide visible"
                style={{ transitionDelay: `${krIdx * 80}ms` }}
              >
                <Flex align="center" style={{ padding: '12px 0' }}>
                  <span style={{ flex: 1, fontWeight: '400', fontSize: 15, marginRight: 8 }}>
                    {kr.text}
                  </span>
                  <Tooltip title={`Progress: ${kr.percent || 0}%`}>
                    <div style={{ flex: 2 }}>
                      <Progress percent={kr.percent || 0} />
                    </div>
                  </Tooltip>
                </Flex>
                {krIdx < okr.key_results.length - 1 && (
                  <div style={{ borderBottom: '1px solid #e0e0e0', width: '100%' }} />
                )}
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- Learning Page ---
function Learning({ currentUser, isAdmin }) {
  return <h2>Learning</h2>;
}

// --- Collaboration Page ---
function Collaboration({ currentUser, isAdmin }) {
  const { okrs, loading, error } = useOkrs();

  if (loading) return <div>Loading OKRs...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Example user data (replace with real user info as needed)
  const user = {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "jane.doe@email.com",
    phone: "555-1234",
    team: "Product Development"
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Avatar src={user.avatar} size={64} />
        <List.Item.Meta
          title={user.name}
          description={
            <>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phone}</div>
              <div>Team: <Tag color="blue">{user.team}</Tag></div>
            </>
          }
        />
      </div>
      <Divider />
      <h3>OKRs Involved</h3>
      <List
        itemLayout="horizontal"
        dataSource={okrs}
        renderItem={okr => (
          <List.Item>
            <List.Item.Meta
              title={okr.title}
              description={
                <>
                  <Tag color={okr.status === 'Active' ? 'green' : 'red'}>{okr.status}</Tag>
                  Progress: {okr.progress || 0}%
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}

// --- Reporting Page ---
function Reporting({ currentUser, isAdmin }) {
  const { okrs, loading, error } = useOkrs();
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [updatesModalOpen, setUpdatesModalOpen] = useState(false);
  const [selectedOkr, setSelectedOkr] = useState(null);

  if (loading) return <div>Loading OKRs...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h2>Reporting</h2>
      {isAdmin && (
        <div style={{ marginBottom: 16, color: 'red' }}>
          Admin Panel: You have admin privileges.
        </div>
      )}
      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
        {okrs.map((okr, idx) => (
          <React.Fragment key={okr.id || idx}>
            <div style={{ padding: '4px 4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                <Avatar src={okr.owner_avatar} size={32} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {okr.title}
                    {okr.last_updated && (
                      <span
                        style={{
                          fontSize: 11,
                          marginLeft: 8,
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        <span
                          style={{
                            color: '#52c41a',
                            marginRight: 4,
                            animation: expandedIdx !== idx ? 'blink 1.2s infinite' : 'none',
                            transition: 'color 0.3s',
                            opacity: 1,
                          }}
                        >
                          ●
                        </span>
                        <span style={{ color: '#636363ff', fontWeight: 400, fontStyle: 'italic' }}>
                          Last updated: {okr.last_updated}
                        </span>
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#888', fontSize: 13 }}>
                    {okr.owner_name} | <TeamOutlined /> {okr.team_name} | {okr.date_created}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag color={okr.status === 'Active' ? 'blue' : 'default'}>
                    {okr.status || 'Unknown'}
                  </Tag>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    style={{ marginLeft: 8 }}
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedOkr(okr);
                      setUpdatesModalOpen(true);
                    }}
                  >
                    Updates
                  </Button>
                  {expandedIdx === idx ? <MinusOutlined /> : <PlusOutlined />}
                </div>
              </div>
              {expandedIdx === idx && okr.key_results && (
                <div style={{ margin: '12px 0 0 40px' }}>
                  <b>Key Results:</b>
                  <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                    {okr.key_results.map((kr, krIdx) => (
                      <li key={krIdx} style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 500 }}>{kr.text}</span>
                        <span style={{ marginLeft: 8, color: '#888' }}>
                          ({kr.percent}% complete)
                        </span>
                        <span style={{ marginLeft: 8 }}>
                          <Tooltip title={`Progress: ${kr.percent}%`}>
                            <Progress percent={kr.percent} size="small" style={{ width: 120 }} />
                          </Tooltip>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {idx < okrs.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
      <Modal
        open={updatesModalOpen}
        title={selectedOkr ? `Updates for: ${selectedOkr.title}` : 'Updates'}
        onCancel={() => setUpdatesModalOpen(false)}
        footer={null}
      >
        {selectedOkr && selectedOkr.updates && selectedOkr.updates.length > 0 ? (
          <List
            dataSource={selectedOkr.updates}
            renderItem={update => (
              <List.Item>
                <div>
                  <div><b>{update.author}</b> <span style={{ color: '#888' }}>{update.date}</span></div>
                  <div>{update.text}</div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div>No updates yet.</div>
        )}
      </Modal>
    </div>
  );
}

function Favorites() {
  return <h2>Favorites</h2>;
}

// --- Profile Components ---
function ProfileAvatar({ avatarUrl, onUpload, yourAuthToken }) {
  const [loading, setLoading] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const data = await uploadAvatar(file, yourAuthToken);
      setLoading(false);
      message.success('Avatar uploaded!');
      onUpload(data.avatar_url);
      onSuccess(data, file);
    } catch (err) {
      setLoading(false);
      message.error('Failed to upload avatar');
      onError(err);
    }
  };

  return (
    <div>
      <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />
      <Upload
        name="avatar"
        showUploadList={false}
        customRequest={customRequest}
      >
        <Button icon={<UploadOutlined />} loading={loading} style={{ marginLeft: 16 }}>
          Change Avatar
        </Button>
      </Upload>
    </div>
  );
}

function ChangePasswordForm({ yourAuthToken }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await changePassword(values.oldPassword, values.newPassword, yourAuthToken);
      message.success('Password changed!');
      form.resetFields();
    } catch (err) {
      message.error(err?.error || 'Failed to change password');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 400 }}>
      <Form.Item name="oldPassword" label="Current Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Change Password</Button>
      </Form.Item>
    </Form>
  );
}

function ProfileEditForm({ user, onUpdate, yourAuthToken }) {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const data = await updateProfile(values, yourAuthToken);
      message.success('Profile updated!');
      onUpdate(data);
    } catch (err) {
      message.error(err?.error || 'Failed to update profile');
    }
  };

  return (
    <Form form={form} onFinish={onFinish} initialValues={user} layout="vertical" style={{ maxWidth: 400 }}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Save Changes</Button>
      </Form.Item>
    </Form>
  );
}

function ProfilePage({ yourAuthToken }) {
  const [user, setUser] = useState({});
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    fetchUserProfile(yourAuthToken)
      .then(data => {
        setUser(data);
        setAvatarUrl(data.avatar_url);
      })
      .catch(() => message.error('Failed to load profile'));
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
      <ProfileAvatar avatarUrl={avatarUrl} onUpload={handleAvatarUpload} yourAuthToken={yourAuthToken} />
      <Divider />
      <ProfileEditForm user={user} onUpdate={handleProfileUpdate} yourAuthToken={yourAuthToken} />
      <Divider />
      <ChangePasswordForm yourAuthToken={yourAuthToken} />
    </Card>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const yourAuthToken = "your-auth-token"; // Replace with real token logic

  useEffect(() => {
    setCurrentUser(getRandomUser());
  }, []);

  const handleSearch = async (query) => {
    const results = await searchAll(query, yourAuthToken);
    setSearchResults(results);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>
        <UserOutlined style={{ marginRight: 8 }} />
        Profile
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined style={{ marginRight: 8 }} />
        Settings
      </Menu.Item>
      <Menu.Item key="logout">
        <PoweroffOutlined style={{ marginRight: 8 }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={() => navigate('/')} />} />
      <Route path="*" element={
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            breakpoint="lg"
            collapsedWidth={0}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            trigger={null}
            width={200}
            style={{ position: 'relative' }}
          >
            <div className="logos" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <div className="logo-group-solar">
                <img src="/Solar Eclipse Logo.png" alt="Solar Eclipse Logo" style={{ height: 32, marginRight: 4 }} />
                <span style={{ fontSize: 10 }}>lumn</span>
              </div>
              <span className="vertical-bar">|</span>
              <div className="logo-group-1898">
                <img src="/1898Logo.png" alt="1898 Logo" style={{ height: 28, marginLeft: 1, marginRight: 4 }} />
                <span style={{ fontSize: 10 }}>1898 & Co.</span>
              </div>
            </div>
            {/* Custom close trigger, only visible when Sider is open */}
            {!collapsed && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 16px 8px 0' }}>
                <span
                  style={{ cursor: 'pointer', fontSize: 18, color: '#fff', transition: 'transform 0.3s' }}
                  onClick={() => setCollapsed(true)}
                >
                  &times;
                </span>
              </div>
            )}
            {/* Stock trigger, always rendered, slides in/out from behind the Sider */}
            <span
              className="ant-layout-sider-zero-width-trigger custom-stock-trigger"
              style={{
                position: 'absolute',
                top: 80,
                right: collapsed ? -40 : -200,
                zIndex: 1100,
                background: '#001529',
                color: '#fff',
                fontSize: 22,
                padding: '8px 10px',
                borderRadius: '0 4px 4px 0',
                boxShadow: '1px 0 4px rgba(0,0,0,0.08)',
                cursor: collapsed ? 'pointer' : 'default',
                opacity: collapsed ? 1 : 0,
                pointerEvents: collapsed ? 'auto' : 'none',
                transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
              }}
              onClick={() => collapsed && setCollapsed(false)}
            >
              &#9776;
            </span>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
              <Menu.Item key="analytics" icon={<PieChartOutlined />}>
                <Link to="/">Analytics</Link>
              </Menu.Item>
              <Menu.Item key="learning" icon={<ExperimentOutlined />}>
                <Link to="/learning">Learning</Link>
              </Menu.Item>
              <Menu.Item key="collaboration" icon={<TeamOutlined />}>
                <Link to="/collaboration">Collaboration</Link>
              </Menu.Item>
              <Menu.Item key="reporting" icon={<SolutionOutlined />}>
                <Link to="/reporting">Reporting</Link>
              </Menu.Item>
              <Menu.Item key="favorites" icon={<StarOutlined />}>
                <Link to="/favorites">Favorites</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: '#fff',
                padding: '0 24px',
                textAlign: 'left',
                fontWeight: 'bolder',
                borderBottom: '1px solid #e0e0e0',
                marginLeft: '8px',
                height: 32,
                lineHeight: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Input.Search
                placeholder="Search objectives, key results, teams..."
                allowClear
                style={{ width: 320 }}
                onSearch={value => console.log(value)} // Replace with your search logic
              />
              <Dropdown overlay={<ProfileMenu onLogout={handleLogout} />} placement="bottomRight" trigger={['click']}>
                <Avatar icon={<UserOutlined style={{ color: '#00264d' }} />} style={{ backgroundColor: '#dcdee1ff', cursor: 'pointer' }} />
              </Dropdown>
            </Header>
            <Header style={{ background: '#fff', padding: 0, textAlign: 'left', fontWeight: 'bolder', borderBottom: '1px solid #e0e0e0', marginLeft: '8px', marginTop: 0, height: 32, lineHeight: '32px' }}>
              Tabs
            </Header>
            <Content style={{ margin: '24px 16px 0', overflow: 'visible' }}>
              <div style={{ padding: 24, background: '#fff', minHeight: 360, overflow: 'visible' }}>
                <Routes>
                  <Route path="/" element={<Analytics />} />
                  <Route path="/reporting" element={<Reporting />} />
                  <Route path="/collaboration" element={<Collaboration />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', fontWeight: 'lighter' }}>
              lumn ©2025 Created by Ethereal Strategies
            </Footer>
          </Layout>
        </Layout>
      } />
    </Routes>
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth={0}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          trigger={null}
          width={200}
          style={{ position: 'relative' }}
        >
          <div className="logos" style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div className="logo-group-solar">
              <img src="/Solar Eclipse Logo.png" alt="Solar Eclipse Logo" style={{ height: 28, marginRight: 4 }} />
              <span style={{ fontSize: 10 }}>lumn</span>
            </div>
            <span className="vertical-bar">|</span>
            <div className="logo-group-1898">
              <img src="/1898Logo.png" alt="1898 Logo" style={{ height: 28, marginLeft: 1, marginRight: 4 }} />
              <span style={{ fontSize: 10 }}>1898 & Co.</span>
            </div>
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 16px 8px 0' }}>
              <span
                style={{ cursor: 'pointer', fontSize: 18, color: '#fff', transition: 'transform 0.3s' }}
                onClick={() => setCollapsed(true)}
              >
                &times;
              </span>
            </div>
          )}
          <span
            className="ant-layout-sider-zero-width-trigger custom-stock-trigger"
            style={{
              position: 'absolute',
              top: 80,
              right: collapsed ? -40 : -200,
              zIndex: 1100,
              background: '#001529',
              color: '#fff',
              fontSize: 22,
              padding: '8px 10px',
              borderRadius: '0 4px 4px 0',
              boxShadow: '1px 0 4px rgba(0,0,0,0.08)',
              cursor: collapsed ? 'pointer' : 'default',
              opacity: collapsed ? 1 : 0,
              pointerEvents: collapsed ? 'auto' : 'none',
              transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
            }}
            onClick={() => collapsed && setCollapsed(false)}
          >
            &#9776;
          </span>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
            <Menu.Item key="analytics" icon={<PieChartOutlined />}>
              <Link to="/">Analytics</Link>
            </Menu.Item>
            <Menu.Item key="learning" icon={<ExperimentOutlined />}>
              <Link to="/learning">Learning</Link>
            </Menu.Item>
            <Menu.Item key="collaboration" icon={<TeamOutlined />}>
              <Link to="/collaboration">Collaboration</Link>
            </Menu.Item>
            <Menu.Item key="reporting" icon={<SolutionOutlined />}>
              <Link to="/reporting">Reporting</Link>
            </Menu.Item>
            <Menu.Item key="favorites" icon={<StarOutlined />}>
              <Link to="/favorites">Favorites</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              textAlign: 'left',
              fontWeight: 'bolder',
              borderBottom: '1px solid #e0e0e0',
              marginLeft: '8px',
              height: 32,
              lineHeight: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Search</span>
            <Dropdown overlay={profileMenu} placement="bottomRight" trigger={['click']}>
              <Avatar icon={<UserOutlined style={{ color: '#00264d' }} />} style={{ backgroundColor: '#dcdee1ff', cursor: 'pointer' }} />
            </Dropdown>
          </Header>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'left', fontWeight: 'bolder', borderBottom: '1px solid #e0e0e0', marginLeft: '8px', marginTop: 0, height: 32, lineHeight: '32px' }}>
            Tabs
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'visible' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360, overflow: 'visible' }}>
              <Routes>
                <Route
                  path="/"
                  element={<Analytics currentUser={currentUser.email} isAdmin={currentUser.isAdmin} />}
                />
                <Route
                  path="/reporting"
                  element={<Reporting currentUser={currentUser.email} isAdmin={currentUser.isAdmin} />}
                />
                <Route
                  path="/collaboration"
                  element={<Collaboration currentUser={currentUser.email} isAdmin={currentUser.isAdmin} />}
                />
                <Route
                  path="/learning"
                  element={<Learning currentUser={currentUser.email} isAdmin={currentUser.isAdmin} />}
                />
                <Route
                  path="/favorites"
                  element={<Favorites />}
                />
                <Route path="/profile" element={<ProfilePage yourAuthToken={yourAuthToken} />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center', fontWeight: 'lighter' }}>
            lumn ©2025 Created by Ethereal Strategies
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;