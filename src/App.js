import './App.css';
import { Layout, Menu, Card, Input, Button, Tooltip, Progress, Flex, Avatar } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { PieChartOutlined, ExperimentOutlined, StarOutlined, TeamOutlined, SolutionOutlined, SettingOutlined, UserOutlined, HighlightOutlined, EditOutlined, UpOutlined, DownOutlined, SaveOutlined, RocketOutlined, ToolOutlined } from '@ant-design/icons';
import SubMenu from 'antd/es/menu/SubMenu';

const { Header, Content, Footer, Sider } = Layout;

// Sample data arrays
const titles = [
  "Improve User Engagement", "Increase Revenue", "Enhance Security", "Boost Performance", "Expand Market Share", "Reduce Churn", "Launch New Feature"
];
const owners = [
  { name: "Jane Doe", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "John Smith", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Alice Lee", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Bob Brown", avatar: "https://randomuser.me/api/portraits/men/15.jpg" }
];
const teams = [
  { name: "Product Development", icon: <RocketOutlined /> },
  { name: "Engineering", icon: <ToolOutlined /> },
  { name: "Marketing", icon: <TeamOutlined /> }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateKeyResults() {
  const num = getRandomInt(2, 4);
  return Array.from({ length: num }).map((_, idx) => ({
    text: `Key Result ${idx + 1}`,
    percent: getRandomInt(40, 100),
    success: getRandomInt(20, 80)
  }));
}

function generateObjective(idx) {
  const owner = owners[getRandomInt(0, owners.length - 1)];
  const team = teams[getRandomInt(0, teams.length - 1)];
  return {
    title: titles[idx % titles.length],
    owner,
    team,
    dateCreated: `2025-07-${getRandomInt(1, 15).toString().padStart(2, '0')}`,
    objectivePercent: getRandomInt(50, 100),
    objectiveSuccess: getRandomInt(20, 80),
    keyResults: generateKeyResults()
  };
}

function Analytics() {
  const [objectives, setObjectives] = useState(
    Array.from({ length: 7 }).map((_, idx) => generateObjective(idx))
  );
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editObjIndex, setEditObjIndex] = useState(null); // For editing objective title
  const [editKRIndex, setEditKRIndex] = useState({ obj: null, kr: null }); // For editing key result
  const [editValue, setEditValue] = useState('');
  const [showKeyResults, setShowKeyResults] = useState(false);

  useEffect(() => {
    if (expandedIndex !== null) {
      setTimeout(() => setShowKeyResults(true), 10);
    } else {
      setShowKeyResults(false);
    }
  }, [expandedIndex]);

  // Edit Objective Title
  const handleEditObj = (idx) => {
    setEditObjIndex(idx);
    setEditValue(objectives[idx].title);
  };
  const handleSaveObj = (idx) => {
    const updated = [...objectives];
    updated[idx].title = editValue;
    setObjectives(updated);
    setEditObjIndex(null);
    setEditValue('');
  };

  // Edit Key Result
  const handleEditKR = (objIdx, krIdx) => {
    setEditKRIndex({ obj: objIdx, kr: krIdx });
    setEditValue(objectives[objIdx].keyResults[krIdx].text);
  };
  const handleSaveKR = (objIdx, krIdx) => {
    const updated = [...objectives];
    updated[objIdx].keyResults[krIdx].text = editValue;
    setObjectives(updated);
    setEditKRIndex({ obj: null, kr: null });
    setEditValue('');
  };

  return (
    <div>
      <h2>Objectives & Key Results</h2>
      <div className="objective-list">
        {objectives.map((obj, cardIdx) => (
          <Card
            key={cardIdx}
            className={expandedIndex === cardIdx ? 'card-expanded' : 'card-collapsed'}
            style={{ width: '100%', marginBottom: 10, minHeight: expandedIndex === cardIdx ? 140 : 70, transition: 'height 0.3s' }}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <Flex align="center" style={{ height: '70px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Title</div>
                <div style={{ fontSize: 11, fontWeight: '700', marginTop: 3, display: 'flex', alignItems: 'center' }}>
                  {editObjIndex === cardIdx ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onPressEnter={() => handleSaveObj(cardIdx)}
                        size="small"
                        style={{ width: '80%' }}
                        autoFocus
                      />
                      <Button
                        icon={<SaveOutlined />}
                        type="link"
                        size="small"
                        onClick={() => handleSaveObj(cardIdx)}
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{obj.title}</span>
                      <Button
                        icon={<EditOutlined />}
                        type="link"
                        size="small"
                        onClick={() => handleEditObj(cardIdx)}
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Owner</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar src={obj.owner.avatar} size={24} />
                  <span>{obj.owner.name}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Team</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {obj.team.icon}
                  <span>{obj.team.name}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>Date Created</div>
                <div>{obj.dateCreated}</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 12px', borderLeft: '1px solid #e0e0e0' }}>
                <Tooltip title={`${obj.objectiveSuccess}% done / ${obj.objectivePercent - obj.objectiveSuccess}% in progress`}>
                  <Progress percent={obj.objectivePercent} success={{ percent: obj.objectiveSuccess }} type="circle" width={48} />
                </Tooltip>
              </div>
              <div style={{ marginLeft: 12, cursor: 'pointer', height: '100%', display: 'flex', alignItems: 'center' }}
                onClick={() => setExpandedIndex(expandedIndex === cardIdx ? null : cardIdx)}>
                {expandedIndex === cardIdx ? <UpOutlined /> : <DownOutlined />}
              </div>
            </Flex>
            {expandedIndex === cardIdx && (
              <div style={{ borderBottom: '1px solid #e0e0e0', width: '100%' }} />
            )}
            {expandedIndex === cardIdx && obj.keyResults.map((kr, idx) => (
              <div
                key={idx}
                className={`key-result-slide${showKeyResults ? ' visible' : ''}`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <Flex align="center" style={{ padding: '12px 0' }}>
                  {editKRIndex.obj === cardIdx && editKRIndex.kr === idx ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onPressEnter={() => handleSaveKR(cardIdx, idx)}
                        size="small"
                        style={{ flex: 1, marginRight: 8 }}
                        autoFocus
                      />
                      <Button
                        icon={<SaveOutlined />}
                        type="link"
                        size="small"
                        onClick={() => handleSaveKR(cardIdx, idx)}
                        style={{ marginRight: 12 }}
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontWeight: '400', fontSize: 15, marginRight: 8 }}>
                        {kr.text}
                      </span>
                      <Button
                        icon={<EditOutlined />}
                        type="link"
                        size="small"
                        onClick={() => handleEditKR(cardIdx, idx)}
                        style={{ marginRight: 12 }}
                      />
                    </>
                  )}
                  <Tooltip title={`${kr.success}% done / ${kr.percent - kr.success}% in progress`}>
                    <div style={{ flex: 2 }}>
                      <Progress percent={kr.percent} success={{ percent: kr.success }} />
                    </div>
                  </Tooltip>
                </Flex>
                {idx < obj.keyResults.length - 1 && (
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

function Learning() {
  return <h2>Learning</h2>;
}
function Collaboration() {
  return <h2>Collaboration</h2>;
}
function Reporting() {
  return <h2>Reporting</h2>;
}
function Favorites() {
  return <h2>Favorites</h2>;
}
function Settings() {
  return <h2>Settings</h2>;
}

function App() {
  const [collapsed, setCollapsed] = useState(false);

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
            <SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
              <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/settings">Profile</Link>
              </Menu.Item>
              <Menu.Item key="preferences" icon={<HighlightOutlined />}>
                <Link to="/settings">Preferences</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, textAlign: 'left', fontWeight: 'bolder', borderBottom: '1px solid #e0e0e0', marginLeft: '8px', height: 32, lineHeight: '32px' }}>
            Search
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
                <Route path="/settings" element={<Settings />} />
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