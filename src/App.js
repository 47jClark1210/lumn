import './App.css';
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

function Analytics() {
  return <h2>Dashboard</h2>;
}
function OKRs() {
  return <h2>OKRs</h2>;
}
function Collaboration() {
  return <h2>Collaboration</h2>;
}
function Reporting() {
  return <h2>Reporting</h2>;
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" style={{ color: 'white', textAlign: 'center', padding: 16, fontWeight: 'bold' }}>
            lumn | 1898 & Co.
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']}>
            <Menu.Item key="analytics">
              <Link to="/">Analytics</Link>
            </Menu.Item>
            <Menu.Item key="okrs">
              <Link to="/okrs">OKRs</Link>
            </Menu.Item>
            <Menu.Item key="collaboration">
              <Link to="/collaboration">Collaboration</Link>
            </Menu.Item>
            <Menu.Item key="reporting">
              <Link to="/reporting">Reporting</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontWeight: 'bold' }}>
            Team OKR Tracking
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<Analytics />} />
                <Route path="/okrs" element={<OKRs />} />
                <Route path="/teams" element={<Collaboration />} />
                <Route path="/reports" element={<Reporting />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            lumn ©2025 Created by Ethereal Strategies in conjunction with Ant Design
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
