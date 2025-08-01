import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Collapse,
  Badge,
  Button,
  Tooltip,
  Tag,
  Avatar,
  Input,
  message,
} from 'antd';
import {
  StarFilled,
  UpOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { mockData } from '../utils/mockData';
import '../styles/Reporting.css';

function Reporting({ onAddFavorite }) {
  const [reports, setReports] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [seen, setSeen] = useState({});
  const [editingReport, setEditingReport] = useState(null);
  const [editDraft, setEditDraft] = useState('');
  const [feedbackDraft, setFeedbackDraft] = useState('');
  const [activeFeedbackReport, setActiveFeedbackReport] = useState(null);
  const [isAdmin] = useState(true); // For demo, assume admin

  const navigate = useNavigate();

  // Use centralized mock reports data
  useEffect(() => {
    // Deep clone to allow local edits without mutating the source
    setReports(JSON.parse(JSON.stringify(mockData.reports)));
  }, []);

  // --- Admin/Feedback Handlers ---
  const handleEditSummary = (reportIdx, updateIdx) => {
    setEditingReport({ reportIdx, updateIdx });
    setEditDraft(reports[reportIdx].updates[updateIdx].summary);
  };

  const handleSaveSummary = () => {
    const { reportIdx, updateIdx } = editingReport;
    const updatedReports = [...reports];
    updatedReports[reportIdx].updates[updateIdx].summary = editDraft;
    setReports(updatedReports);
    setEditingReport(null);
    setEditDraft('');
    message.success('Summary updated.');
  };

  const handleDeleteUpdate = (reportIdx, updateIdx) => {
    const updatedReports = [...reports];
    updatedReports[reportIdx].updates.splice(updateIdx, 1);
    setReports(updatedReports);
    message.success('Update deleted.');
  };

  const handleAddUpdate = (reportIdx) => {
    const updatedReports = [...reports];
    updatedReports[reportIdx].updates.push({
      summary: 'New update...',
      date: new Date().toISOString().slice(0, 10),
    });
    setReports(updatedReports);
    setSeen((old) => ({
      ...old,
      [updatedReports[reportIdx].id]: {
        ...(old[updatedReports[reportIdx].id] || {}),
        updates: 1,
      },
    }));
    message.success('Update added.');
  };

  const handleAddFeedback = (reportIdx) => {
    if (!feedbackDraft.trim()) return;
    const updatedReports = [...reports];
    updatedReports[reportIdx].feedback.push({
      user: {
        name: 'CurrentUser',
        avatar: '', // Add current user's avatar URL if available
      },
      comment: feedbackDraft,
      date: new Date().toISOString().slice(0, 10),
    });
    setReports(updatedReports);
    setSeen((old) => ({
      ...old,
      [updatedReports[reportIdx].id]: {
        ...(old[updatedReports[reportIdx].id] || {}),
        feedback: 1,
      },
    }));
    setFeedbackDraft('');
    setActiveFeedbackReport(null);
    message.success('Feedback submitted.');
  };

  // --- Render ---
  return (
    <div
      style={{
        maxHeight: 'calc(100vh - 48px)',
        overflowY: 'auto',
        padding: '16px 16px 75px 16px', // top right bottom left
      }}
    >
      {reports.map((report, reportIdx) => (
        <Card
          key={report.id}
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{report.title}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 100,
                  fontStyle: 'italic',
                  color:
                    report.status === 'Closed'
                      ? 'red'
                      : report.status === 'In Progress'
                        ? 'orange'
                        : 'green',
                }}
              >
                {report.status}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span
                  className={
                    report.status === 'Open' || report.status === 'In Progress'
                      ? 'indicator-flash'
                      : ''
                  }
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor:
                      report.status === 'Closed'
                        ? 'red'
                        : report.status === 'In Progress'
                          ? 'orange'
                          : 'green',
                  }}
                ></span>
              </span>
            </span>
          }
          style={{
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
            marginBottom: 8,
          }}
          extra={
            <Tooltip
              title="Add to favorites"
              color="#ffe957ff"
              overlayInnerStyle={{
                color: '#222',
                fontWeight: 500,
                fontSize: 11,
                border: '1px solid #ffe957ff',
                boxShadow: '0 2px 8px rgba(250,219,20,0.10)',
                padding: '6px 14px',
                minWidth: 120,
                textAlign: 'center',
              }}
            >
              <Button
                icon={<StarFilled style={{ color: '#fadb14' }} />}
                type="text"
                onClick={() => {
                  onAddFavorite(
                    'report',
                    report.id,
                    report.title,
                    `/reporting/${report.id}`,
                  );
                  message.success('Added to favorites!');
                }}
              />
            </Tooltip>
          }
        >
          {/* Owner and team info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
            }}
          >
            {report.owner && (
              <Tooltip
                title={`Go to ${report.owner.name}'s profile`}
                color="#ffae18ff"
                overlayInnerStyle={{
                  color: '#222',
                  fontWeight: 500,
                  fontSize: 11,
                  border: '1px solid #ffae18ff',
                  boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                  padding: '6px 14px',
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate(
                      `/collaboration?user=${encodeURIComponent(report.owner.name)}`,
                    )
                  }
                  title={`View ${report.owner.name} in Collaboration`}
                >
                  <Avatar src={report.owner.avatar} />
                  <span
                    style={{ marginLeft: 6, color: '#1890ff', fontWeight: 500 }}
                  >
                    {report.owner.name}
                  </span>
                </span>
              </Tooltip>
            )}
            {report.team && (
              <Tooltip
                title={`Go to ${report.team.name} team`}
                color="#ffae18ff"
                overlayInnerStyle={{
                  color: '#222',
                  fontWeight: 500,
                  fontSize: 11,
                  border: '1px solid #ffae18ff',
                  boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                  padding: '6px 14px',
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Tag
                  color={report.team.color}
                  style={{
                    fontWeight: 600,
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                  onClick={() =>
                    navigate(
                      `/collaboration?team=${encodeURIComponent(report.team.name)}`,
                    )
                  }
                >
                  {report.team.icon && (
                    <span style={{ marginRight: 4 }}>{report.team.icon}</span>
                  )}
                  {report.team.name}
                </Tag>
              </Tooltip>
            )}
            <Button
              type="link"
              onClick={() => {
                setExpanded((prev) => {
                  const isExpanding = !prev.includes(report.id);
                  if (isExpanding) {
                    setSeen((old) => ({
                      ...old,
                      [report.id]: { updates: 0, feedback: 0 },
                    }));
                  }
                  return isExpanding
                    ? [...prev, report.id]
                    : prev.filter((id) => id !== report.id);
                });
              }}
              style={{ marginLeft: 'auto' }}
              icon={
                expanded.includes(report.id) ? <UpOutlined /> : <DownOutlined />
              }
            />
          </div>

          {/* Collapsible panels for updates and feedback */}
          <Collapse
            activeKey={expanded.includes(report.id) ? ['1', '2'] : []}
            ghost
          >
            {/* Updates Panel */}
            <Collapse.Panel
              header={
                <span>
                  Updates{' '}
                  {typeof seen[report.id]?.updates === 'number' &&
                    seen[report.id]?.updates > 0 && (
                      <Badge
                        count={seen[report.id].updates}
                        size="small"
                        style={{ backgroundColor: '#333dffff', marginLeft: 4 }}
                        showZero={false}
                      />
                    )}
                </span>
              }
              key="1"
              showArrow={false}
            >
              {(report.updates || []).length === 0 && (
                <div style={{ color: '#888' }}>No updates yet.</div>
              )}
              {(report.updates || []).map((update, updateIdx) => (
                <div
                  key={updateIdx}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 500, marginRight: 8 }}>
                    {update.date}:
                  </span>
                  {editingReport &&
                  editingReport.reportIdx === reportIdx &&
                  editingReport.updateIdx === updateIdx ? (
                    <>
                      <Input
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        size="small"
                        style={{ width: 250, marginRight: 8 }}
                        autoFocus
                      />
                      <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        size="small"
                        onClick={handleSaveSummary}
                        style={{ marginRight: 4 }}
                      />
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        size="small"
                        danger
                        onClick={() => handleDeleteUpdate(reportIdx, updateIdx)}
                      />
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1 }}>{update.summary}</span>
                      {isAdmin && (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            type="link"
                            size="small"
                            onClick={() =>
                              handleEditSummary(reportIdx, updateIdx)
                            }
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            size="small"
                            danger
                            onClick={() =>
                              handleDeleteUpdate(reportIdx, updateIdx)
                            }
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
              {isAdmin && (
                <Button
                  icon={<PlusOutlined />}
                  type="dashed"
                  size="small"
                  onClick={() => handleAddUpdate(reportIdx)}
                  style={{ marginTop: 8 }}
                >
                  Draft Update
                </Button>
              )}
            </Collapse.Panel>

            {/* Feedback Panel */}
            <Collapse.Panel
              header={
                <span>
                  Feedback{' '}
                  {typeof seen[report.id]?.feedback === 'number' &&
                    seen[report.id]?.feedback > 0 && (
                      <Badge
                        count={seen[report.id].feedback}
                        size="small"
                        style={{ backgroundColor: '#fa1414ff', marginLeft: 8 }}
                        showZero={false}
                      />
                    )}
                </span>
              }
              key="2"
              showArrow={false}
            >
              {(report.feedback || []).length === 0 && (
                <div style={{ color: '#888' }}>No feedback yet.</div>
              )}
              {(report.feedback || []).map((fb, fbIdx) => (
                <div key={fbIdx} style={{ marginBottom: 8 }}>
                  <Tooltip
                    title={`Go to ${fb.user.name}'s profile`}
                    color="#ffe957ff"
                    overlayInnerStyle={{
                      color: '#222',
                      fontWeight: 500,
                      fontSize: 11,
                      border: '1px solid #ffe957ff',
                      boxShadow: '0 2px 8px rgba(250,219,20,0.10)',
                      padding: '6px 14px',
                      minWidth: 120,
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        navigate(
                          `/collaboration?user=${encodeURIComponent(fb.user.name)}`,
                        )
                      }
                      title={`View ${fb.user.name} in Collaboration`}
                    >
                      <Avatar
                        src={fb.user.avatar}
                        size={20}
                        style={{ marginRight: 4 }}
                      />
                      <b style={{ color: '#1890ff' }}>{fb.user.name}</b>
                    </span>
                  </Tooltip>
                  <span style={{ color: '#888', fontSize: 12, marginLeft: 4 }}>
                    ({fb.date})
                  </span>
                  : {fb.comment}
                </div>
              ))}
              {/* Feedback input for all users */}
              {activeFeedbackReport === reportIdx ? (
                <div style={{ marginTop: 8 }}>
                  <Input.TextArea
                    value={feedbackDraft}
                    onChange={(e) => setFeedbackDraft(e.target.value)}
                    rows={2}
                    placeholder="Enter your feedback..."
                  />
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleAddFeedback(reportIdx)}
                    style={{ marginTop: 4 }}
                  >
                    Submit Feedback
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => setActiveFeedbackReport(null)}
                    style={{ marginLeft: 8 }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="dashed"
                  size="small"
                  onClick={() => setActiveFeedbackReport(reportIdx)}
                  style={{ marginTop: 8 }}
                >
                  Add Feedback
                </Button>
              )}
            </Collapse.Panel>
          </Collapse>
        </Card>
      ))}
    </div>
  );
}

export default Reporting;
