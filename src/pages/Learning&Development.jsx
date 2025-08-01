import '../styles/LearningAndDevelopment.css';
import { useState } from 'react';
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
import { mockData } from '../utils/mockData';

function LearningAndDevelopment({ onAddFavorite }) {
  // Use mockData.modules instead of API
  const [modules, setModules] = useState(mockData.modules);
  const [activeModule, setActiveModule] = useState(
    mockData.modules.length ? 0 : null,
  );
  const [loading] = useState(false); // No loading needed for mock data
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUser, setAssignUser] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [isAdmin] = useState(true);
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

  // Create module (mock)
  const handleCreateModule = () => {
    if (!createDraft.title.trim() || !createDraft.video.trim()) return;
    const newModule = {
      ...createDraft,
      id: `mod${modules.length + 1}`,
      assigned: false,
    };
    const updatedModules = [...modules, newModule];
    setModules(updatedModules);
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
    setActiveModule(updatedModules.length - 1);
  };

  // Edit module (mock)
  const handleEditModule = () => {
    if (!editDraft.title.trim() || !editDraft.video.trim()) return;
    const updatedModules = modules.map((mod, idx) =>
      idx === activeModule ? { ...editDraft } : mod,
    );
    setModules(updatedModules);
    setEditMode(false);
  };

  // Delete module (mock)
  const handleDeleteModule = () => {
    const updatedModules = modules.filter((_, idx) => idx !== activeModule);
    setModules(updatedModules);
    setActiveModule(updatedModules.length ? 0 : null);
  };

  // Assign module (mock)
  const handleAssign = () => {
    if (!assignUser.trim()) return;
    const updatedModules = modules.map((mod, idx) =>
      idx === activeModule ? { ...mod, assigned: true } : mod,
    );
    setModules(updatedModules);
    setShowAssignModal(false);
    setAssignUser('');
  };

  // Add feedback (mock)
  const handleAddFeedback = () => {
    if (!feedbackDraft.trim()) return;
    const updatedModules = modules.map((mod, idx) =>
      idx === activeModule
        ? {
            ...mod,
            feedback: [
              ...(mod.feedback || []),
              { user: { name: 'You', avatar: '' }, comment: feedbackDraft },
            ],
          }
        : mod,
    );
    setModules(updatedModules);
    setShowFeedbackModal(false);
    setFeedbackDraft('');
  };

  return (
    <div className="learning-page">
      <div
        style={{
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          padding: 24,
        }}
      >
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tag
                    color={modules[activeModule].assigned ? 'green' : 'orange'}
                    style={{ fontWeight: 600, borderRadius: 8 }}
                  >
                    {modules[activeModule].assigned ? 'Assigned' : 'Unassigned'}
                  </Tag>
                  <Button
                    icon={<StarFilled style={{ color: '#fadb14' }} />}
                    type="text"
                    aria-label="Add to favorites"
                    onClick={() =>
                      onAddFavorite(
                        'module',
                        modules[activeModule].id,
                        modules[activeModule].title,
                        `/learning&development/${modules[activeModule].id}`,
                      )
                    }
                    style={{ marginLeft: 8 }}
                  />
                </div>
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
                      setEditDraft({
                        ...editDraft,
                        description: e.target.value,
                      })
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
                        <Avatar
                          src={item.user.avatar}
                          size={24}
                          style={{ marginRight: 8 }}
                        />
                        <b>{item.user.name}:</b> {item.comment}
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
                    key={mod.id || mod._id || mod.title}
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
      </div>
    </div>
  );
}

export default LearningAndDevelopment;
