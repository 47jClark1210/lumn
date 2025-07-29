import '../styles/LearningAndDevelopment.css';
import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Divider,
  Input,
  List,
  Modal,
  Tag,
  Avatar,
  Collapse,
} from 'antd';
import ReactPlayer from 'react-player';
import Leaderboard from '../components/Leaderboard';
import { StarFilled } from '@ant-design/icons';

function LearningAndDevelopment({ onAddFavorite }) {
  // Learning & Development page with backend integration
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUser, setAssignUser] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [isAdmin] = useState(true); // Simulate admin logic
  const [editMode, setEditMode] = useState(false);
  const [editDraft, setEditDraft] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    title: '',
    description: '',
    video: '',
    resources: [],
    skills: [],
    mentor: '',
    feedback: [],
  });

  // Fetch modules from backend
  useEffect(() => {
    async function fetchModules() {
      setLoading(true);
      try {
        const res = await fetch('/api/modules');
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
    await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createDraft),
    });
    setShowCreateModal(false);
    setCreateDraft({
      title: '',
      description: '',
      video: '',
      resources: [],
      skills: [],
      mentor: '',
      feedback: [],
    });
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
    setActiveModule(data.length ? data.length - 1 : null);
  };

  // Edit module
  const handleEditModule = async () => {
    if (!editDraft.title.trim() || !editDraft.video.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editDraft),
    });
    setEditMode(false);
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
  };

  // Delete module
  const handleDeleteModule = async () => {
    await fetch(`/api/modules/${modules[activeModule]._id}`, {
      method: 'DELETE',
    });
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
    setActiveModule(data.length ? 0 : null);
  };

  // Assign module
  const handleAssign = async () => {
    if (!assignUser.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: assignUser }),
    });
    setShowAssignModal(false);
    setAssignUser('');
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
  };

  // Add feedback
  const handleAddFeedback = async () => {
    if (!feedbackDraft.trim()) return;
    await fetch(`/api/modules/${modules[activeModule]._id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'You', comment: feedbackDraft }),
    });
    setShowFeedbackModal(false);
    setFeedbackDraft('');
    const res = await fetch('/api/modules');
    const data = await res.json();
    setModules(data);
  };

  // Example modules array
  const exampleModules = [
    {
      id: 'mod1',
      title: 'React Basics',
      description: 'Learn React fundamentals.',
    },
    {
      id: 'mod2',
      title: 'Advanced JS',
      description: 'Deep dive into JavaScript.',
    },
    // ...other modules
  ];

  return (
    <div className="learning-page">
      <h2 className="learning-header">Learning & Development</h2>
      <Collapse defaultActiveKey={['1']} ghost style={{ marginBottom: 24 }}>
        <Collapse.Panel header="Leaderboard Snapshot" key="1">
          <Leaderboard />
        </Collapse.Panel>
      </Collapse>
      <div className="learning-container">
        <Button
          type="primary"
          onClick={() => setShowCreateModal(true)}
          className="create-module-btn"
        >
          Create Module
        </Button>
        {loading ? (
          <Card
            className="module-card-loading"
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
              marginBottom: 24,
              border: 'none',
            }}
            styles={{ body: { padding: 32 } }}
          >
            Loading modules...
          </Card>
        ) : modules.length === 0 ? (
          <Card
            className="module-card-empty"
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
              marginBottom: 24,
              border: 'none',
            }}
            styles={{ body: { padding: 32 } }}
          >
            No training modules found.
          </Card>
        ) : (
          <Card
            className="module-card"
            title={
              editMode ? (
                <Input
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, title: e.target.value })
                  }
                />
              ) : (
                <span
                  style={{ fontWeight: 700, fontSize: 22, color: '#14184b' }}
                >
                  {modules[activeModule].title}
                </span>
              )
            }
            extra={
              <Tag
                color={modules[activeModule].assigned ? 'green' : 'orange'}
                style={{ fontWeight: 600, borderRadius: 8 }}
              >
                {modules[activeModule].assigned ? 'Assigned' : 'Unassigned'}
              </Tag>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
              marginBottom: 24,
              border: 'none',
            }}
            styles={{ body: { padding: 32 } }}
          >
            {editMode ? (
              <>
                <Input.TextArea
                  value={editDraft.description}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Description"
                  className="edit-description"
                />
                <Input
                  value={editDraft.video}
                  onChange={(e) =>
                    setEditDraft({ ...editDraft, video: e.target.value })
                  }
                  placeholder="Video URL"
                  className="edit-video"
                />
                <Button
                  type="primary"
                  onClick={handleEditModule}
                  className="save-btn"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditMode(false)}
                  className="cancel-btn"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <p>{modules[activeModule].description}</p>
                <Divider />
                <b>Training Video:</b>
                <div className="video-player-wrapper">
                  <ReactPlayer
                    url={modules[activeModule].video}
                    controls
                    width="100%"
                    height="360px"
                    className="video-player"
                  />
                </div>
                <Divider />
                <b>Resources:</b>
                <List
                  dataSource={modules[activeModule].resources}
                  renderItem={(item) => (
                    <List.Item>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </List.Item>
                  )}
                />
                <Divider />
                <b>Skill Matrix:</b>
                <div className="skills-list">
                  {modules[activeModule].skills &&
                    modules[activeModule].skills.map((skill) => (
                      <Tag
                        color="#1890ff"
                        key={skill}
                        style={{ fontWeight: 600, borderRadius: 8 }}
                      >
                        {skill}
                      </Tag>
                    ))}
                </div>
                <Divider />
                <b>Mentor:</b>
                <div className="mentor-info">
                  {modules[activeModule].mentor && (
                    <>
                      <Avatar
                        src={modules[activeModule].mentor.avatar}
                        size={40}
                        style={{ boxShadow: '0 2px 8px rgba(20,24,75,0.10)' }}
                      />
                      <span>{modules[activeModule].mentor.name}</span>
                    </>
                  )}
                </div>
                <Divider />
                <b>Feedback & Comments:</b>
                <List
                  dataSource={modules[activeModule].feedback}
                  renderItem={(item) => (
                    <List.Item>
                      <b>{item.user}:</b> {item.comment}
                    </List.Item>
                  )}
                  locale={{ emptyText: 'No feedback yet.' }}
                />
                <Button
                  type="link"
                  onClick={() => setShowFeedbackModal(true)}
                  className="add-feedback-btn"
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  Add Feedback
                </Button>
                <Divider />
                <b>OKR Integration:</b>
                <div className="okr-info">
                  <Tag color="purple">Objective: Upskill</Tag>
                  <Tag color="geekblue">Key Result: Complete modules</Tag>
                </div>
                {isAdmin && (
                  <Button
                    type="primary"
                    onClick={() => setShowAssignModal(true)}
                    className="assign-btn"
                  >
                    Assign Module
                  </Button>
                )}
                <Button
                  danger
                  className="delete-btn"
                  onClick={handleDeleteModule}
                  style={{ borderRadius: 8, fontWeight: 600, marginRight: 8 }}
                >
                  Delete
                </Button>
                <Button
                  className="edit-btn"
                  onClick={() => {
                    setEditMode(true);
                    setEditDraft(modules[activeModule]);
                  }}
                  style={{ borderRadius: 8, fontWeight: 600 }}
                >
                  Edit
                </Button>
              </>
            )}
            <Divider style={{ margin: '24px 0' }} />
            <b>Switch Module:</b>
            <div className="switch-module-btns">
              {modules.map((mod, idx) => (
                <Button
                  key={mod._id || mod.title}
                  type={activeModule === idx ? 'primary' : 'default'}
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
          onChange={(e) =>
            setCreateDraft({ ...createDraft, title: e.target.value })
          }
          placeholder="Module Title"
          className="modal-title-input"
        />
        <Input.TextArea
          value={createDraft.description}
          onChange={(e) =>
            setCreateDraft({ ...createDraft, description: e.target.value })
          }
          rows={2}
          placeholder="Description"
          className="modal-description-input"
        />
        <Input
          value={createDraft.video}
          onChange={(e) =>
            setCreateDraft({ ...createDraft, video: e.target.value })
          }
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
          onChange={(e) => setAssignUser(e.target.value)}
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
          onChange={(e) => setFeedbackDraft(e.target.value)}
          rows={3}
          className="modal-feedback-input"
          autoFocus
          placeholder="Write your feedback here..."
        />
      </Modal>
      <div>
        <h2>Learning Modules</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {exampleModules.map((mod) => (
            <Card key={mod.id} title={mod.title} style={{ width: 260 }}>
              <p>{mod.description}</p>
              <Button
                icon={<StarFilled style={{ color: '#fadb14' }} />}
                type="text"
                onClick={() =>
                  onAddFavorite({
                    key: `module-${mod.id}`,
                    type: 'settings', // or another type if you prefer
                    label: mod.title,
                    route: `/learning&development/${mod.id}`,
                  })
                }
                style={{ marginTop: 8 }}
              >
                Add to Favorites
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LearningAndDevelopment;
