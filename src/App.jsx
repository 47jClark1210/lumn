import './styles/App.css';
import { useState } from 'react';
import { Layout, Menu, Input, Avatar, Popover } from 'antd';
import {
  PieChartOutlined,
  ExperimentOutlined,
  StarOutlined,
  TeamOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Analytics from './pages/Analytics.jsx';
import Collaboration from './pages/Collaboration.jsx';
import LearningAndDevelopment from './pages/Learning&Development.jsx';
import Reporting from './pages/Reporting.jsx';
import ProfileMenu from './components/ProfileMenu.jsx';
import { useUser } from './context/UserContext.jsx';
import ProfilePreferences from './pages/ProfilePreferences.jsx';

// If you use ReactPlayer elsewhere in the app, keep this import:
// import ReactPlayer from 'react-player';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  // Removed unused favoritesExpanded state
  const { user, logout: handleLogout } = useUser();
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLoginSuccess={() => navigate('/')} />}
      />
      <Route
        path="*"
        element={
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
              <div
                className="logos"
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  padding: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <div className="logo-group-solar">
                  <img
                    src="/SolarEclipseLogo.png"
                    alt="Solar Eclipse Logo"
                    style={{ height: 32, marginRight: 4 }}
                  />
                  <span style={{ fontSize: 10 }}>lumn</span>
                </div>
                <span className="vertical-bar">|</span>
                <div className="logo-group-1898">
                  <img
                    src="/1898Logo.png"
                    alt="1898 Logo"
                    style={{ height: 28, marginLeft: 1, marginRight: 4 }}
                  />
                  <span style={{ fontSize: 10 }}>1898 & Co.</span>
                </div>
              </div>
              {/* Custom close trigger, only visible when Sider is open */}
              {!collapsed && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    padding: '0 16px 8px 0',
                  }}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      fontSize: 18,
                      color: '#fff',
                      transition: 'transform 0.3s',
                    }}
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
                  transition:
                    'right 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.5s',
                }}
                onClick={() => collapsed && setCollapsed(false)}
              >
                &#9776;
              </span>
              <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['dashboard']}
              >
                <Menu.Item key="analytics" icon={<PieChartOutlined />}>
                  <Link to="/">Analytics</Link>
                </Menu.Item>
                <Menu.Item
                  key="learning&development"
                  icon={<ExperimentOutlined />}
                >
                  <Link to="/learning&development">Learning & Development</Link>
                </Menu.Item>
                <Menu.Item key="collaboration" icon={<TeamOutlined />}>
                  <Link to="/collaboration">Collaboration</Link>
                </Menu.Item>
                <Menu.Item key="reporting" icon={<SolutionOutlined />}>
                  <Link to="/reporting">Reporting</Link>
                </Menu.Item>
                <Menu.Item
                  key="favorites"
                  icon={<StarOutlined />}
                  style={{ userSelect: 'none' }}
                >
                  Favorites
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
                  alignItems: 'center',
                }}
              >
                <Input.Search
                  placeholder="Search objectives, key results, teams..."
                  allowClear
                  style={{ width: 320, paddingBottom: 1, paddingTop: 1 }}
                  onSearch={(value) => console.log(value)} // Replace with your search logic
                />
                <Popover
                  content={<ProfileMenu user={user} onLogout={handleLogout} />}
                  trigger="hover"
                  placement="bottomRight"
                  overlayStyle={{ padding: 0 }}
                >
                  <Avatar
                    icon={<UserOutlined style={{ color: '#00264d' }} />}
                    src={user?.avatar}
                    style={{
                      backgroundColor: '#dcdee1ff',
                      cursor: 'pointer',
                    }}
                  />
                </Popover>
              </Header>
              <Header
                style={{
                  background: '#fff',
                  padding: 0,
                  textAlign: 'left',
                  fontWeight: 'bolder',
                  borderBottom: '1px solid #e0e0e0',
                  marginLeft: '8px',
                  marginTop: 0,
                  height: 32,
                  lineHeight: '32px',
                }}
              >
                Tabs
              </Header>
              <Content style={{ margin: '24px 16px 0', overflow: 'visible' }}>
                <div
                  style={{
                    padding: 24,
                    background: '#fff',
                    minHeight: 360,
                    overflow: 'visible',
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Analytics />} />
                    <Route path="/reporting" element={<Reporting />} />
                    <Route path="/collaboration" element={<Collaboration />} />
                    <Route
                      path="/learning&development"
                      element={<LearningAndDevelopment />}
                    />
                    <Route
                      path="/ProfilePreferences"
                      element={<ProfilePreferences />}
                    />
                  </Routes>
                </div>
              </Content>
              <Footer style={{ textAlign: 'center', fontWeight: 'lighter' }}>
                lumn ©2025 Created by Ethereal Strategies
              </Footer>
            </Layout>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
