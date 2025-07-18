import './App.css';
import { Layout, Menu, Card, Input, Button, Tooltip, Progress, Flex, Avatar, Descriptions, List, Tag, Divider, Modal, Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import { PieChartOutlined, ExperimentOutlined, StarOutlined, TeamOutlined, SolutionOutlined, SettingOutlined, UserOutlined, EditOutlined, UpOutlined, DownOutlined, SaveOutlined, RocketOutlined, ToolOutlined, PoweroffOutlined } from '@ant-design/icons';

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
  // Example user and OKR data (replace with your real data)
  const user = {
    name: "Jane Doe",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "jane.doe@email.com",
    phone: "555-1234",
    team: "Product Development"
  };
  const okrs = [
    { title: "Improve User Engagement", status: "Active", progress: 80 },
    { title: "Launch New Feature", status: "Completed", progress: 100 }
  ];

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Avatar src={user.avatar} size={64} />
        <Descriptions title={user.name} column={1}>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Team">
            <Tag color="blue">{user.team}</Tag>
          </Descriptions.Item>
        </Descriptions>
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
                  Progress: {okr.progress}%
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
}
function Reporting() {
  // Use the same structure as Analytics
  // Always show random objectives, no add functionality
  const [objectives, setObjectives] = useState(() => Array.from({ length: 7 }).map((_, idx) => generateObjective(idx)));
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editObjIndex, setEditObjIndex] = useState(null);
  const [editKRIndex, setEditKRIndex] = useState({ obj: null, kr: null });
  const [editValue, setEditValue] = useState('');
  const [showKeyResults, setShowKeyResults] = useState(false);
  const [newKRIdx, setNewKRIdx] = useState(null);
  const [newKRText, setNewKRText] = useState('');
  const [summaryIdx, setSummaryIdx] = useState(null);
  const [summaryDraft, setSummaryDraft] = useState('');
  const [removingIdx, setRemovingIdx] = useState(null);
  const [feedbackIdx, setFeedbackIdx] = useState({ obj: null, kr: null });
  const [feedbackDraft, setFeedbackDraft] = useState('');

  useEffect(() => {
    if (expandedIndex !== null) {
      setTimeout(() => setShowKeyResults(true), 10);
    } else {
      setShowKeyResults(false);
    }
  }, [expandedIndex]);

  // Remove objective when summary is submitted
  const handleRemoveObjective = idx => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

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

  // Add Key Result
  const handleAddKR = idx => {
    if (!newKRText.trim()) return;
    const updated = [...objectives];
    updated[idx].keyResults.push({ text: newKRText, percent: 0, success: 0, feedback: '' });
    setObjectives(updated);
    setNewKRIdx(null);
    setNewKRText('');
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

  // Draft Summary and animate removal
  const handleSaveSummary = idx => {
    setSummaryIdx(null);
    setSummaryDraft('');
    setRemovingIdx(idx);
    // Wait for animation to finish before removing
    setTimeout(() => {
      handleRemoveObjective(idx);
      setRemovingIdx(null);
    }, 600); // match animation duration
  };

  // Provide Feedback
  const handleSaveFeedback = (objIdx, krIdx) => {
    const updated = [...objectives];
    updated[objIdx].keyResults[krIdx].feedback = feedbackDraft;
    setObjectives(updated);
    setFeedbackIdx({ obj: null, kr: null });
    setFeedbackDraft('');
  };

  return (
    <div>
      <h2>Reporting</h2>
      {/* No add objective UI here, just show objectives */}
      {objectives.map((obj, cardIdx) => (
        <div
          key={cardIdx}
          className={`reporting-card-anim-wrapper${removingIdx === cardIdx ? ' exit-right' : ''}${removingIdx !== null && cardIdx > removingIdx ? ' slide-up' : ''}`}
          style={{ transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s', willChange: 'transform, opacity' }}
        >
          <Card
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
{/* Summary Drafting (Modal) */}
          {expandedIndex === cardIdx && (
            <div style={{ margin: '12px 0' }}>
              <b>Summary:</b>
              <span style={{ marginLeft: 8 }}>{obj.summary || <i>No summary drafted</i>}</span>
              <Button type="link" size="small" onClick={() => { setSummaryIdx(cardIdx); setSummaryDraft(obj.summary); }}>Draft/Edit</Button>
              {/* Modal for summary editing */}
              <Modal
                title="Draft/Edit Summary"
                open={summaryIdx === cardIdx}
                onOk={() => handleSaveSummary(cardIdx)}
                onCancel={() => { setSummaryIdx(null); setSummaryDraft(''); }}
                okText="Save"
                cancelText="Cancel"
                className={removingIdx === cardIdx ? 'modal-shrink' : ''}
                maskClosable={false}
              >
                <Input.TextArea
                  value={summaryDraft}
                  onChange={e => setSummaryDraft(e.target.value)}
                  rows={4}
                  autoFocus
                  placeholder="Write your summary here..."
                />
              </Modal>
            </div>
          )}
          {/* Key Results */}
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
                {/* Feedback */}
                {feedbackIdx.obj === cardIdx && feedbackIdx.kr === idx ? (
                  <>
                    <Input
                      value={feedbackDraft}
                      onChange={e => setFeedbackDraft(e.target.value)}
                      size="small"
                      style={{ width: 120, marginLeft: 8 }}
                      autoFocus
                    />
                    <Button type="primary" size="small" onClick={() => handleSaveFeedback(cardIdx, idx)} style={{ marginLeft: 4 }}>Save</Button>
                  </>
                ) : (
                  <Button type="link" size="small" onClick={() => { setFeedbackIdx({ obj: cardIdx, kr: idx }); setFeedbackDraft(kr.feedback || ''); }} style={{ marginLeft: 8 }}>Feedback</Button>
                )}
              </Flex>
              <div style={{ marginTop: 8 }}>
                <b>Feedback:</b> {kr.feedback ? kr.feedback : <i>No feedback</i>}
              </div>
              {idx < obj.keyResults.length - 1 && (
                <div style={{ borderBottom: '1px solid #e0e0e0', width: '100%' }} />
              )}
            </div>
          ))}
          {/* Add Key Result */}
          {expandedIndex === cardIdx && (
            newKRIdx === cardIdx ? (
              <div style={{ marginTop: 8 }}>
                <Input
                  value={newKRText}
                  onChange={e => setNewKRText(e.target.value)}
                  placeholder="Key Result description..."
                  size="small"
                  style={{ width: 200, marginRight: 8 }}
                  autoFocus
                />
                <Button type="primary" size="small" onClick={() => handleAddKR(cardIdx)}>Add</Button>
                <Button size="small" onClick={() => { setNewKRIdx(null); setNewKRText(''); }} style={{ marginLeft: 4 }}>Cancel</Button>
              </div>
            ) : (
              <Button type="dashed" size="small" onClick={() => setNewKRIdx(cardIdx)} style={{ marginTop: 8 }}>Add Key Result</Button>
            )
          )}
          </Card>
        </div>
      ))}
    </div>
  );
}
function Favorites() {
  return <h2>Favorites</h2>;
}

const profileMenu = (
  <Menu>
    <Menu.Item key="profile">
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
    onSearch={value => console.log(value)}
  />
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
    </Router>
  );
}

export default App;