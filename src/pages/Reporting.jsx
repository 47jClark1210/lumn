import { useState } from 'react';
import {
  Button,
  Input,
  Progress,
  Tooltip,
  Avatar,
  Modal,
  Splitter,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';

function Reporting() {
  // State hooks
  const [objectives, setObjectives] = useState([
    {
      title: 'Increase Sales',
      owner: { name: 'Alice', avatar: '' },
      team: { name: 'Sales', icon: null },
      dateCreated: '2025-07-01',
      objectivePercent: 80,
      objectiveSuccess: 60,
      summary: '',
      keyResults: [
        { text: 'Close 10 new deals', percent: 80, success: 60, feedback: '' },
      ],
    },
  ]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [removingIdx] = useState(null);
  const [editObjIndex, setEditObjIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [summaryIdx, setSummaryIdx] = useState(null);
  const [summaryDraft, setSummaryDraft] = useState('');
  // Feedback for summary (per objective)
  const [feedbackModalIdx, setFeedbackModalIdx] = useState(null);
  const [feedbackDraft, setFeedbackDraft] = useState('');

  // Utility: safely update objectives
  const updateObjectives = (updater) => {
    setObjectives((prev) => {
      try {
        return updater(prev);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error updating objectives:', e);
        return prev;
      }
    });
  };

  // Handlers
  const handleSaveObj = (cardIdx) => {
    if (!editValue.trim()) return;
    updateObjectives((prev) =>
      prev.map((obj, idx) =>
        idx === cardIdx ? { ...obj, title: editValue } : obj,
      ),
    );
    setEditObjIndex(null);
    setEditValue('');
  };

  const handleEditObj = (cardIdx) => {
    setEditObjIndex(cardIdx);
    setEditValue(objectives[cardIdx]?.title || '');
  };

  const handleSaveSummary = (cardIdx) => {
    updateObjectives((prev) =>
      prev.map((obj, idx) =>
        idx === cardIdx ? { ...obj, summary: summaryDraft } : obj,
      ),
    );
    setSummaryIdx(null);
    setSummaryDraft('');
  };

  // Save feedback for summary (per objective)
  const handleSaveFeedback = (cardIdx) => {
    updateObjectives((prev) =>
      prev.map((obj, idx) =>
        idx === cardIdx
          ? {
              ...obj,
              summaryFeedback: [
                ...(obj.summaryFeedback || []),
                feedbackDraft.trim(),
              ],
            }
          : obj,
      ),
    );
    setFeedbackModalIdx(null);
    setFeedbackDraft('');
  };

  // Render helpers
  const renderTitle = (obj, cardIdx) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        marginTop: 3,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {editObjIndex === cardIdx ? (
        <>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onPressEnter={() => handleSaveObj(cardIdx)}
            size="small"
            style={{ width: '80%' }}
            autoFocus
          />
          <Button
            icon={<SaveOutlined />}
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSaveObj(cardIdx);
            }}
            style={{ marginLeft: 8, borderRadius: 8, fontWeight: 600 }}
          />
        </>
      ) : (
        <>
          <span style={{ flex: 1 }}>{obj.title}</span>
          <Button
            icon={<EditOutlined />}
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleEditObj(cardIdx);
            }}
            style={{ marginLeft: 8, borderRadius: 8, fontWeight: 600 }}
          />
        </>
      )}
    </div>
  );

  // Main render
  return (
    <div>
      <Splitter
        layout="vertical"
        style={{
          minHeight: 400,
          boxShadow: '0 0 10px rgba(0,0,0,0.08)',
          border: 'none',
        }}
      >
        {objectives.map((obj, cardIdx) => (
          <Splitter.Panel key={cardIdx}>
            <div
              className={`reporting-thread-header${removingIdx === cardIdx ? ' exit-right' : ''}${removingIdx !== null && cardIdx > removingIdx ? ' slide-up' : ''}${expandedIndex === cardIdx ? ' expanded' : ''}`}
              style={{
                cursor: 'pointer',
                padding: '20px 32px',
                background: expandedIndex === cardIdx ? '#f6f8fa' : '#fff',
                borderRadius: expandedIndex === cardIdx ? '8px 8px 0 0' : 0,
                boxShadow:
                  expandedIndex === cardIdx
                    ? '0 4px 24px rgba(20,24,75,0.10)'
                    : '0 1px 2px rgba(20,24,75,0.04)',
                border:
                  expandedIndex === cardIdx
                    ? '1px solid #e0e0e0'
                    : '1px solid #f0f0f0',
                borderBottom:
                  expandedIndex === cardIdx ? 'none' : '1px solid #f0f0f0',
                transition:
                  'background 0.25s, box-shadow 0.25s, border-radius 0.25s, border 0.25s',
                display: 'flex',
                alignItems: 'center',
                minHeight: 70,
                position: 'relative',
                zIndex: expandedIndex === cardIdx ? 2 : 1,
              }}
              onClick={() =>
                setExpandedIndex(expandedIndex === cardIdx ? null : cardIdx)
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#f0f4fa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  expandedIndex === cardIdx ? '#f6f8fa' : '#fff')
              }
            >
              {/* Unified Header Section - Reddit style */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 24,
                  flexWrap: 'wrap',
                  padding: 0,
                }}
              >
                {/* Progress (like Reddit upvote) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Tooltip
                    title={`${obj.objectiveSuccess}% done / ${obj.objectivePercent - obj.objectiveSuccess}% in progress`}
                  >
                    <Progress
                      percent={obj.objectivePercent}
                      success={{ percent: obj.objectiveSuccess }}
                      type="circle"
                      width={40}
                      style={{ marginRight: 8 }}
                    />
                  </Tooltip>
                </div>
                {/* Title and Team */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minWidth: 180,
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}
                  >
                    Title
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    {renderTitle(obj, cardIdx)}
                    <span
                      style={{
                        fontWeight: 600,
                        borderRadius: 8,
                        color: '#1890ff',
                        background: '#e6f7ff',
                        padding: '2px 8px',
                        marginLeft: 8,
                        fontSize: 12,
                      }}
                    >
                      {obj.team.icon}
                      {obj.team.name}
                    </span>
                  </div>
                </div>
                {/* Owner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    minWidth: 120,
                  }}
                >
                  <Avatar
                    src={obj.owner.avatar}
                    size={24}
                    style={{ boxShadow: '0 2px 8px rgba(20,24,75,0.10)' }}
                  />
                  <span style={{ fontWeight: 500 }}>{obj.owner.name}</span>
                </div>
                {/* Date Created */}
                <div
                  style={{
                    fontSize: 12,
                    color: '#888',
                    fontWeight: 'bold',
                    minWidth: 100,
                  }}
                >
                  {obj.dateCreated}
                </div>
              </div>
              {/* Expand Icon */}
              <div
                style={{
                  marginLeft: 12,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {expandedIndex === cardIdx ? <UpOutlined /> : <DownOutlined />}
              </div>
            </div>
            {/* Expandable Section */}
            <div
              className={`reporting-thread-expandable${expandedIndex === cardIdx ? ' expanded' : ''}`}
              style={{
                maxHeight: expandedIndex === cardIdx ? 1000 : 0,
                opacity: expandedIndex === cardIdx ? 1 : 0,
                transform:
                  expandedIndex === cardIdx
                    ? 'translateY(0)'
                    : 'translateY(-8px)',
                overflow: 'hidden',
                background: '#fff',
                boxShadow:
                  expandedIndex === cardIdx
                    ? '0 8px 32px rgba(20,24,75,0.08)'
                    : 'none',
                padding:
                  expandedIndex === cardIdx ? '24px 32px 8px 32px' : '0 32px',
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderTop:
                  expandedIndex === cardIdx ? '1px solid #e0e0e0' : 'none',
                marginBottom: expandedIndex === cardIdx ? 0 : -8,
                transition:
                  'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s, transform 0.25s, box-shadow 0.25s, padding 0.25s, margin-bottom 0.25s',
                zIndex: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {expandedIndex === cardIdx && (
                <div>
                  {/* Summary */}
                  <div style={{ margin: '12px 0' }}>
                    <b>Summary:</b>
                    <span style={{ marginLeft: 8 }}>
                      {obj.summary || <i>No summary drafted</i>}
                    </span>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setSummaryIdx(cardIdx);
                        setSummaryDraft(obj.summary);
                      }}
                    >
                      Draft/Edit
                    </Button>
                    <Modal
                      title="Draft/Edit Summary"
                      open={summaryIdx === cardIdx}
                      onOk={() => handleSaveSummary(cardIdx)}
                      onCancel={() => {
                        setSummaryIdx(null);
                        setSummaryDraft('');
                      }}
                      okText="Save"
                      cancelText="Cancel"
                      className={removingIdx === cardIdx ? 'modal-shrink' : ''}
                      maskClosable={false}
                    >
                      <Input.TextArea
                        value={summaryDraft}
                        onChange={(e) => setSummaryDraft(e.target.value)}
                        rows={4}
                        autoFocus
                        placeholder="Write your summary here..."
                      />
                    </Modal>
                  </div>
                  {/* Feedback Section for Summary */}
                  <div style={{ margin: '12px 0 0 0' }}>
                    <b>Feedback:</b>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setFeedbackModalIdx(cardIdx);
                        setFeedbackDraft('');
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      Add Feedback
                    </Button>
                    <Modal
                      title="Add Feedback"
                      open={feedbackModalIdx === cardIdx}
                      onOk={() => handleSaveFeedback(cardIdx)}
                      onCancel={() => {
                        setFeedbackModalIdx(null);
                        setFeedbackDraft('');
                      }}
                      okText="Submit"
                      cancelText="Cancel"
                      maskClosable={false}
                    >
                      <Input.TextArea
                        value={feedbackDraft}
                        onChange={(e) => setFeedbackDraft(e.target.value)}
                        rows={3}
                        autoFocus
                        placeholder="Write your feedback for this summary..."
                      />
                    </Modal>
                    <div style={{ marginTop: 8 }}>
                      {obj.summaryFeedback && obj.summaryFeedback.length > 0 ? (
                        <ul style={{ paddingLeft: 20 }}>
                          {obj.summaryFeedback.map((fb, i) => (
                            <li key={i} style={{ marginBottom: 4 }}>
                              {fb}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <i>No feedback yet</i>
                      )}
                    </div>
                  </div>
                  )
                </div>
              )}
            </div>
          </Splitter.Panel>
        ))}
      </Splitter>
    </div>
  );
}

export default Reporting;
