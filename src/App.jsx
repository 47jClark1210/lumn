import './styles/App.css';
import { useState, useRef, useEffect } from 'react';
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
import FavoritesDropdown from './components/FavoritesDropdown';

// If you use ReactPlayer elsewhere in the app, keep this import:
// import ReactPlayer from 'react-player';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [favoritesExpanded, setFavoritesExpanded] = useState(false);
  const { user, logout: handleLogout } = useUser();
  const [favorites, setFavorites] = useState([]);

  function handleAddFavorite(item) {
    setFavorites((prev) => {
      // Prevent duplicates by key or id
      if (prev.some((fav) => fav.key === item.key)) return prev;
      return [...prev, item];
    });
  }

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
                  onClick={() => setFavoritesExpanded((prev) => !prev)}
                >
                  Favorites
                </Menu.Item>
                {favoritesExpanded && (
                  <div style={{ background: '#112244', paddingLeft: 32 }}>
                    <FavoritesDropdown
                      favorites={favorites}
                      onLinkClick={() => setFavoritesExpanded(false)}
                    />
                  </div>
                )}
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
                <AISearchBar
                  placeholder="Search objectives, key results, teams..."
                  allowClear
                  style={{
                    width: 320,
                    paddingBottom: 1,
                    paddingTop: 1,
                    borderRadius: 32,
                  }}
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
                    <Route
                      path="/"
                      element={<Analytics onAddFavorite={handleAddFavorite} />}
                    />
                    <Route
                      path="/reporting"
                      element={<Reporting onAddFavorite={handleAddFavorite} />}
                    />
                    <Route
                      path="/collaboration"
                      element={
                        <Collaboration onAddFavorite={handleAddFavorite} />
                      }
                    />
                    <Route
                      path="/learning&development"
                      element={
                        <LearningAndDevelopment
                          onAddFavorite={handleAddFavorite}
                        />
                      }
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

function AISearchBar() {
  const [okrs, setOkrs] = useState([]);
  useEffect(() => {
    async function fetchRandomOKRs() {
      try {
        // Fetch random OKRs from backend search API
        const res = await fetch('/api/search?random=1');
        const data = await res.json();
        // Expecting array of OKRs: [{ objective, department, owner }]
        setOkrs(Array.isArray(data) ? data : []);
      } catch (err) {
        setOkrs([]);
      }
    }
    fetchRandomOKRs();
  }, []);
  const styles = {
    container: { position: 'relative', width: 320 },
    modal: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 38,
      background: '#fff',
      border: '1px solid #ccc',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      zIndex: 100,
      padding: 10,
    },
    modalOkrCard: { borderBottom: '1px solid #eee', padding: '8px 0' },
    modalFilters: {
      display: 'flex',
      gap: 10,
      marginTop: 10,
      justifyContent: 'flex-end',
    },
    modalSelect: {
      padding: '4px 8px',
      borderRadius: 4,
      border: '1px solid #ccc',
    },
  };
  const [keyword, setKeyword] = useState('');
  const [modalDepartment, setModalDepartment] = useState('');
  const [modalOwner, setModalOwner] = useState('');
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef();
  const modalRef = useRef();
  function filterOKRs(keyword, department, owner) {
    keyword = keyword.toLowerCase();
    return okrs.filter((okr) => {
      return (
        (!keyword || okr.objective.toLowerCase().includes(keyword)) &&
        (!department || okr.department === department) &&
        (!owner || okr.owner === owner)
      );
    });
  }
  useEffect(() => {
    function handleClick(e) {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        inputRef.current !== e.target
      ) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  useEffect(() => {
    if (keyword) setShowModal(true);
    else setShowModal(false);
  }, [keyword]);
  const predictiveResults = filterOKRs(keyword, modalDepartment, modalOwner);
  return (
    <div style={styles.container}>
      <Input
        ref={inputRef}
        placeholder="Search OKRs by keyword"
        value={keyword}
        allowClear
        onChange={(e) => setKeyword(e.target.value)}
        style={{ width: '100%' }}
      />
      {showModal && (
        <div ref={modalRef} style={styles.modal}>
          {predictiveResults.length === 0 ? (
            <div style={styles.modalOkrCard}>No OKRs found.</div>
          ) : (
            predictiveResults.map((okr, idx) => (
              <div key={idx} style={styles.modalOkrCard}>
                <strong>Objective:</strong> {okr.objective}
                <br />
                <strong>Department:</strong> {okr.department}
                <br />
                <strong>Owner:</strong> {okr.owner}
              </div>
            ))
          )}
          <div style={styles.modalFilters}>
            <select
              style={styles.modalSelect}
              value={modalDepartment}
              onChange={(e) => setModalDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
            <select
              style={styles.modalSelect}
              value={modalOwner}
              onChange={(e) => setModalOwner(e.target.value)}
            >
              <option value="">All Owners</option>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Charlie">Charlie</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
