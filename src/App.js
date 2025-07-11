import './App.css';
import { Layout, Menu } from 'antd';
import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
 
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
 
function Analytics() {
  return <h2>Dashboard</h2>;
}
function Learning() {
  return <h2>Learning</h2>;
}
function Collaboration() {
  return <h2>Collaboration</h2>;
}
function Reporting() {
  return <h2>Reporting</h2>;
}
 
function App() {
  const [collapsed, setCollapsed] = useState(false);
  // Animate the stock trigger
  // No longer need to add/remove classes, will animate via style
 
  return (
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
            <img src="/Solar Eclipse Logo.png" alt="Solar Eclipse Logo" style={{ height: 28, marginRight: 4 }} />
            <span style={{ fontSize: 10 }}>lumn</span>
            <span style={{ margin: '0 2px', fontSize: 16 }}>|</span>
            <img src="/1898Logo.png" alt="1898 Logo" style={{ height: 28, marginLeft: 1, marginRight: 4 }} />
            <span style={{ fontSize: 10 }}>1898 & Co.</span>
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
              right: collapsed ? -48 : -200, // -200px is the Sider width, -48px is trigger width
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
            <Menu.Item key="analytics">
              <Link to="/">Analytics</Link>
            </Menu.Item>
            <Menu.Item key="learning">
              <Link to="/learning">Learning</Link>
            </Menu.Item>
            <Menu.Item key="collaboration">
              <Link to="/collaboration">Collaboration</Link>
            </Menu.Item>
            <Menu.Item key="reporting">
              <Link to="/reporting">Reporting</Link>
            </Menu.Item>
            <SubMenu key="settings" title="Settings">
              <Menu.Item key="profile">
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item key="preferences">
                <Link to="/preferences">Preferences</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'left', fontWeight: 'bolder', borderBottom: '1px solid #e0e0e0', marginLeft: '8px', height: 32, lineHeight: '32px' }}>
            Analytics
          </Header>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'left', fontWeight: 'bolder', borderBottom: '1px solid #e0e0e0', marginLeft: '8px', marginTop: 0, height: 32, lineHeight: '32px' }}>
            Analytics
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<Analytics />} />
                <Route path="/reporting" element={<Reporting />} />
                <Route path="/collaboration" element={<Collaboration />} />
                <Route path="/learning" element={<Learning />} />
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