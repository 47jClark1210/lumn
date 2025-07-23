import './App.css';
import { Layout, Menu, Card, Input, Button, Tooltip, Progress, Flex, Avatar, Descriptions, List, Tag, Divider, Modal, Dropdown } from 'antd';
import ReactPlayer from 'react-player';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { PieChartOutlined, ExperimentOutlined, StarOutlined, TeamOutlined, SolutionOutlined, SettingOutlined, UserOutlined, EditOutlined, UpOutlined, DownOutlined, SaveOutlined, RocketOutlined, ToolOutlined, PoweroffOutlined} from '@ant-design/icons';
import Login from './Login.js';

const { Header, Content, Footer, Sider } = Layout;

// Leaderboard component: ranks users within teams and teams against other teams
function Leaderboard() {
  const [userRanks, setUserRanks] = useState([]);
  const [teamRanks, setTeamRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const userRes = await fetch('/api/leaderboard/users');
        const teamRes = await fetch('/api/leaderboard/teams');
        setUserRanks(await userRes.json());
        setTeamRanks(await teamRes.json());
      } catch (err) {
        setUserRanks([]);
        setTeamRanks([]);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <Card style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)', borderRadius: 16, marginBottom: 32, minHeight: 120 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
        <span style={{ fontSize: 20, color: '#888' }}>Loading leaderboard...</span>
      </div>
    </Card>
  );

  return (
    <div>
      <Card
        title={<span style={{ fontWeight: 700, fontSize: 22, background: 'linear-gradient(90deg,#1890ff,#6f42c1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Team Rankings</span>}
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08)', borderRadius: 16, marginBottom: 32, border: 'none', padding: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={teamRanks}
          renderItem={(team, idx) => (
            <List.Item
              style={{
                background: idx === 0 ? 'linear-gradient(90deg,#e3f0ff,#fffbe6)' : '#fff',
                borderRadius: 14,
                margin: '8px 16px',
                boxShadow: idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none',
                transition: 'box-shadow 0.2s',
                border: idx === 0 ? '2px solid #1890ff' : '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 18px',
                cursor: 'pointer',
                gap: 12
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,144,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none'}
            >
              <Avatar style={{ background: idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? '#ff7875' : '#1890ff', color: '#fff', fontWeight: 700, fontSize: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} size={48}>{idx + 1}</Avatar>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 18 }}>{team.name}</span>
                <div style={{ fontSize: 14, color: '#888', marginTop: 2 }}>Score: <b style={{ color: '#1890ff' }}>{team.score}</b></div>
              </div>
              <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'volcano' : 'blue'} style={{ fontSize: 16, padding: '4px 12px', borderRadius: 8 }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</Tag>
            </List.Item>
          )}
        />
      </Card>
      <Card
        title={<span style={{ fontWeight: 700, fontSize: 22, background: 'linear-gradient(90deg,#6f42c1,#1890ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>User Rankings (by Team)</span>}
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.10)', borderRadius: 18, border: 'none', padding: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        {userRanks.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#888', fontSize: 18 }}>No user rankings found.</div>
        ) : (
          userRanks.map(team => (
            <div key={team.teamName} style={{ marginBottom: 32, padding: '0 12px' }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#6f42c1', marginBottom: 12 }}>{team.teamName}</h3>
              <List
                itemLayout="horizontal"
                dataSource={team.users}
                renderItem={(user, idx) => (
                  <List.Item
                    style={{
                      background: idx === 0 ? 'linear-gradient(90deg,#e3f0ff,#fffbe6)' : '#fff',
                      borderRadius: 12,
                      margin: '6px 0',
                      boxShadow: idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none',
                      border: idx === 0 ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      gap: 10,
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,144,255,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none'}
                  >
                    <Avatar src={user.avatar} size={40} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: idx === 0 ? '2px solid gold' : 'none' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>{user.name}</span>
                      <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>Score: <b style={{ color: '#1890ff' }}>{user.score}</b></div>
                    </div>
                    <Tag color={idx === 0 ? 'gold' : idx === 1 ? 'silver' : idx === 2 ? 'volcano' : 'blue'} style={{ fontSize: 15, padding: '3px 10px', borderRadius: 8 }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</Tag>
                  </List.Item>
                )}
              />
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

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
  // Learning & Development page with backend integration
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUser, setAssignUser] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [isAdmin, setIsAdmin] = useState(true); // Simulate admin logic
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDraft, setCreateDraft] = useState({ title: "", description: "", video: "", resources: [], skills: [], mentor: "", feedback: [] });

  // Fetch modules from backend
  useEffect(() => {
    async function fetchModules() {
      setLoading(true);
      try {
        const res = await fetch("/api/modules");
        const data = await res.json();
        setModules(data);
        setActiveModule(data.length ? 0 : null);
      } catch (err) {
        setModules([]);
      }
      setLoading(false);
    }
    fetchModules();
  }, []);

  // Create module
  const handleCreateModule = async () => {
    if (!createDraft.title.trim() || !createDraft.video.trim()) return;
    await fetch("/api/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createDraft)
    });
    setShowCreateModal(false);
    setCreateDraft({ title: "", description: "", video: "", resources: [], skills: [], mentor: "", feedback: [] });
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
    setActiveModule(data.length ? data.length - 1 : null);
  };

  // Edit module
  const handleEditModule = async () => {
    if (!editDraft.title.trim() || !editDraft.video.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editDraft)
    });
    setEditMode(false);
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
  };

  // Delete module
  const handleDeleteModule = async () => {
    await fetch(`/api/modules/${modules[activeModule]._id}`, { method: "DELETE" });
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
    setActiveModule(data.length ? 0 : null);
  };

  // Assign module
  const handleAssign = async () => {
    if (!assignUser.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: assignUser })
    });
    setShowAssignModal(false);
    setAssignUser("");
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
  };

  // Add feedback
  const handleAddFeedback = async () => {
    if (!feedbackDraft.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "You", comment: feedbackDraft })
    });
    setShowFeedbackModal(false);
    setFeedbackDraft("");
    const res = await fetch("/api/modules");
    const data = await res.json();
    setModules(data);
  };

  return (
    <div className="learning-page">
      <h2 className="learning-header">Learning & Development</h2>
      <Leaderboard />
      <div className="learning-container">
        <Button type="primary" onClick={() => setShowCreateModal(true)} className="create-module-btn">Create Module</Button>
        {loading ? (
          <Card className="module-card-loading">Loading modules...</Card>
        ) : modules.length === 0 ? (
          <Card className="module-card-empty">No training modules found.</Card>
        ) : (
          <Card
            className="module-card"
            title={editMode ? (
              <Input value={editDraft.title} onChange={e => setEditDraft({ ...editDraft, title: e.target.value })} />
            ) : (
              modules[activeModule].title
            )}
            extra={<Tag color={modules[activeModule].assigned ? "green" : "orange"}>{modules[activeModule].assigned ? "Assigned" : "Unassigned"}</Tag>}
          >
            {editMode ? (
              <>
                <Input.TextArea
                  value={editDraft.description}
                  onChange={e => setEditDraft({ ...editDraft, description: e.target.value })}
                  rows={2}
                  placeholder="Description"
                  className="edit-description"
                />
                <Input
                  value={editDraft.video}
                  onChange={e => setEditDraft({ ...editDraft, video: e.target.value })}
                  placeholder="Video URL"
                  className="edit-video"
                />
                <Button type="primary" onClick={handleEditModule} className="save-btn">Save</Button>
                <Button onClick={() => setEditMode(false)} className="cancel-btn">Cancel</Button>
              </>
            ) : (
              <>
                <p>{modules[activeModule].description}</p>
                <Divider />
                <b>Training Video:</b>
                <div className="video-player-wrapper">
                  <ReactPlayer url={modules[activeModule].video} controls width="100%" height="360px" className="video-player" />
                </div>
                <Divider />
                <b>Resources:</b>
                <List
                  dataSource={modules[activeModule].resources}
                  renderItem={item => (
                    <List.Item>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    </List.Item>
                  )}
                />
                <Divider />
                <b>Skill Matrix:</b>
                <div className="skills-list">
                  {modules[activeModule].skills && modules[activeModule].skills.map(skill => (
                    <Tag color="blue" key={skill}>{skill}</Tag>
                  ))}
                </div>
                <Divider />
                <b>Mentor:</b>
                <div className="mentor-info">
                  {modules[activeModule].mentor && (
                    <>
                      <Avatar src={modules[activeModule].mentor.avatar} />
                      <span>{modules[activeModule].mentor.name}</span>
                    </>
                  )}
                </div>
                <Divider />
                <b>Feedback & Comments:</b>
                <List
                  dataSource={modules[activeModule].feedback}
                  renderItem={item => (
                    <List.Item>
                      <b>{item.user}:</b> {item.comment}
                    </List.Item>
                  )}
                  locale={{ emptyText: "No feedback yet." }}
                />
                <Button type="link" onClick={() => setShowFeedbackModal(true)} className="add-feedback-btn">Add Feedback</Button>
                <Divider />
                <b>OKR Integration:</b>
                <div className="okr-info">
                  <Tag color="purple">Objective: Upskill</Tag>
                  <Tag color="geekblue">Key Result: Complete modules</Tag>
                </div>
                {isAdmin && (
                  <Button type="primary" onClick={() => setShowAssignModal(true)} className="assign-btn">Assign Module</Button>
                )}
                <Button danger className="delete-btn" onClick={handleDeleteModule}>Delete</Button>
                <Button className="edit-btn" onClick={() => { setEditMode(true); setEditDraft(modules[activeModule]); }}>Edit</Button>
              </>
            )}
            <Divider />
            <b>Switch Module:</b>
            <div className="switch-module-btns">
              {modules.map((mod, idx) => (
                <Button
                  key={mod._id || mod.title}
                  type={activeModule === idx ? "primary" : "default"}
                  className="switch-module-btn"
                  onClick={() => setActiveModule(idx)}
                >
                  {mod.title}
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
      {/* Create Module Modal */}
      <Modal
        title="Create Training Module"
        open={showCreateModal}
        onOk={handleCreateModule}
        onCancel={() => setShowCreateModal(false)}
        okText="Create"
        cancelText="Cancel"
      >
        <Input
          value={createDraft.title}
          onChange={e => setCreateDraft({ ...createDraft, title: e.target.value })}
          placeholder="Module Title"
          className="modal-title-input"
        />
        <Input.TextArea
          value={createDraft.description}
          onChange={e => setCreateDraft({ ...createDraft, description: e.target.value })}
          rows={2}
          placeholder="Description"
          className="modal-description-input"
        />
        <Input
          value={createDraft.video}
          onChange={e => setCreateDraft({ ...createDraft, video: e.target.value })}
          placeholder="Video URL"
          className="modal-video-input"
        />
      </Modal>
      {/* Assign Modal */}
      <Modal
        title="Assign Module"
        open={showAssignModal}
        onOk={handleAssign}
        onCancel={() => setShowAssignModal(false)}
        okText="Assign"
        cancelText="Cancel"
      >
        <Input
          value={assignUser}
          onChange={e => setAssignUser(e.target.value)}
          placeholder="Enter user name..."
          className="modal-assign-input"
          autoFocus
        />
      </Modal>
      {/* Feedback Modal */}
      <Modal
        title="Add Feedback"
        open={showFeedbackModal}
        onOk={handleAddFeedback}
        onCancel={() => setShowFeedbackModal(false)}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input.TextArea
          value={feedbackDraft}
          onChange={e => setFeedbackDraft(e.target.value)}
          rows={3}
          className="modal-feedback-input"
          autoFocus
          placeholder="Write your feedback here..."
        />
      </Modal>
    </div>
  );
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

function ProfileMenu({ onLogout }) {
  return (
    <Menu>
      <Menu.Item key="profile">
        <UserOutlined style={{ marginRight: 8 }} />
        Profile
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined style={{ marginRight: 8 }} />
        Settings
      </Menu.Item>
      <Menu.Item key="logout" onClick={onLogout}>
        <PoweroffOutlined style={{ marginRight: 8 }} />
        Logout
      </Menu.Item>
    </Menu>
  );
}

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    navigate('/login');
  };

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
  );
}

export default App;