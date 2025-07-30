import '../styles/Analytics.css';
import { useState, useEffect } from 'react';
import {
  Card,
  Flex,
  Input,
  Button,
  Tooltip,
  Progress,
  Avatar,
  Tag,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  DownOutlined,
  UpOutlined,
  StarFilled,
} from '@ant-design/icons';
import { generateObjective, getProgressGradient } from '../utils/helpers';

function Analytics({ onAddFavorite }) {
  const [objectives, setObjectives] = useState(
    Array.from({ length: 7 }).map((_, idx) => generateObjective(idx)),
  );
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editObjIndex, setEditObjIndex] = useState(null);
  const [editKRIndex, setEditKRIndex] = useState({ obj: null, kr: null });
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

  // Helper for pseudo divider
  const PseudoDivider = () => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 1,
        background: '#e0e0e0',
        zIndex: 1,
      }}
    />
  );

  return (
    <div>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
        Objectives & Key Results
      </h2>
      <div className="objective-list">
        {objectives.map((obj, cardIdx) => (
          <div
            key={cardIdx}
            className={`analytics-card-anim-wrapper${expandedIndex === cardIdx ? ' expanded' : ''}`}
            style={{
              transition:
                'transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s',
              willChange: 'transform, opacity',
            }}
          >
            <Card
              className={
                expandedIndex === cardIdx ? 'card-expanded' : 'card-collapsed'
              }
              style={{
                width: '100%',
                marginBottom: 12,
                minHeight: expandedIndex === cardIdx ? 140 : 70,
                transition: 'height 0.3s',
                borderRadius: 16,
                boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
                border: 'none',
                alignContent: 'center',
                justifyContent: 'space-between',
              }}
              bodyStyle={{
                padding: expandedIndex === cardIdx ? '12px 32px 32px 32px' : 32,
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <Flex align="center" style={{ flex: 1 }}>
                {/* Title Section */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Flex
                    vertical
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '0 12px',
                      background: 'transparent',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#888',
                        fontWeight: 'bold',
                        transform: 'translateY(2px)',
                      }}
                    >
                      Title
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'row',
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
                            onClick={() => handleSaveObj(cardIdx)}
                            style={{
                              marginLeft: 8,
                              borderRadius: 8,
                              fontWeight: 600,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <span
                            style={{
                              flex: 1,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {obj.title}
                          </span>
                          <Button
                            icon={<EditOutlined />}
                            type="link"
                            size="small"
                            onClick={() => handleEditObj(cardIdx)}
                            style={{
                              marginLeft: 8,
                              borderRadius: 8,
                              fontWeight: 600,
                            }}
                          />
                        </>
                      )}
                    </div>
                  </Flex>
                </div>

                {/* Owner Section */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <PseudoDivider />
                  <Flex
                    vertical
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '0 12px',
                      background: 'transparent',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#888',
                        fontWeight: 'bold',
                      }}
                    >
                      Owner
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <Avatar
                        src={obj.owner.avatar}
                        size={24}
                        style={{ boxShadow: '0 2px 8px rgba(20,24,75,0.10)' }}
                      />
                      <span>{obj.owner.name}</span>
                    </div>
                  </Flex>
                </div>

                {/* Team Section */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <PseudoDivider />
                  <Flex
                    vertical
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '0 12px',
                      background: 'transparent',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#888',
                        fontWeight: 'bold',
                      }}
                    >
                      Team
                    </div>
                    <Flex align="center" gap={8}>
                      {obj.team.icon}
                      <Tag
                        color="#1890ff"
                        style={{
                          fontWeight: 600,
                          borderRadius: 8,
                          marginRight: 8,
                        }}
                      >
                        {obj.team.name}
                      </Tag>
                    </Flex>
                  </Flex>
                </div>

                {/* Date Created Section */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <PseudoDivider />
                  <Flex
                    vertical
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '0 12px',
                      background: 'transparent',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#888',
                        fontWeight: 'bold',
                      }}
                    >
                      Date Created
                    </div>
                    <div>{obj.dateCreated}</div>
                  </Flex>
                </div>

                {/* Progress, Favorite, and Expand/Collapse Section */}
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <PseudoDivider />
                  <Flex
                    align="center"
                    justify="space-between"
                    style={{
                      flex: 1,
                      padding: '0 12px',
                      minWidth: 0,
                      gap: 16,
                      background: 'transparent',
                      zIndex: 2,
                    }}
                  >
                    {/* Progress Circle */}
                    <Tooltip
                      title={`${obj.objectiveSuccess}% done / ${obj.objectivePercent - obj.objectiveSuccess}% in progress`}
                      overlayInnerStyle={{
                        background: getProgressGradient(
                          obj.objectiveSuccess,
                          obj.objectivePercent,
                        ),
                        color: '#222',
                        fontWeight: 500,
                        fontSize: 13,
                        border: '1px solid #bae7ff',
                        boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                        padding: '6px 14px',
                        minWidth: 120,
                        textAlign: 'center',
                      }}
                    >
                      <Progress
                        percent={obj.objectivePercent}
                        success={{ percent: obj.objectiveSuccess }}
                        type="circle"
                        width={48}
                        style={{}}
                      />
                    </Tooltip>

                    {/* Add to Favorites Button */}
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
                        onClick={() =>
                          onAddFavorite({
                            key: `okr-${obj.id}`,
                            type: 'okr',
                            label: obj.title,
                            route: `/okrs/${obj.id}`,
                            // avatar: obj.owner.avatar, // Uncomment if you want to show avatar in favorites
                          })
                        }
                        style={{ marginLeft: 0 }}
                      />
                    </Tooltip>

                    {/* Expand/Collapse Button */}
                    <Button
                      type="text"
                      icon={
                        expandedIndex === cardIdx ? (
                          <UpOutlined />
                        ) : (
                          <DownOutlined />
                        )
                      }
                      onClick={() =>
                        setExpandedIndex(
                          expandedIndex === cardIdx ? null : cardIdx,
                        )
                      }
                      style={{
                        marginLeft: 0,
                      }}
                      aria-label={
                        expandedIndex === cardIdx ? 'Collapse' : 'Expand'
                      }
                    />
                  </Flex>
                </div>
              </Flex>
              {/* Divider */}
              {expandedIndex === cardIdx && (
                <div
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    width: '100%',
                    marginTop: 2,
                  }}
                />
              )}
              {/* Key Results */}
              {expandedIndex === cardIdx &&
                obj.keyResults.map((kr, idx) => (
                  <div
                    key={idx}
                    className={`key-result-slide${showKeyResults ? ' visible' : ''}`}
                    style={{ transitionDelay: `${idx * 80}ms` }}
                  >
                    <Tooltip
                      title={`${kr.success}% done / ${kr.percent - kr.success}% in progress`}
                      overlayInnerStyle={{
                        background: getProgressGradient(kr.success, kr.percent),
                        color: '#222',
                        fontWeight: 500,
                        fontSize: 10,
                        border: '1px solid #bae7ff',
                        boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                        padding: '6px 14px',
                        minWidth: 120,
                        textAlign: 'center',
                      }}
                    >
                      <Flex align="center" style={{ padding: '2px 0' }}>
                        {editKRIndex.obj === cardIdx &&
                        editKRIndex.kr === idx ? (
                          <>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onPressEnter={() => handleSaveKR(cardIdx, idx)}
                              size="small"
                              style={{ flex: 1, marginLeft: 4, marginRight: 8 }}
                              autoFocus
                            />
                            <Button
                              icon={<SaveOutlined />}
                              type="link"
                              size="small"
                              onClick={() => handleSaveKR(cardIdx, idx)}
                              style={{ marginRight: 0 }}
                            />
                          </>
                        ) : (
                          <>
                            {/* Objective Key Result Text */}
                            <span
                              style={{
                                color: '#888',
                                flex: 1,
                                fontWeight: 600,
                                fontSize: 12,
                                marginRight: 8,
                              }}
                            >
                              {kr.text}
                            </span>
                            <Button
                              icon={<EditOutlined />}
                              type="link"
                              size="small"
                              onClick={() => handleEditKR(cardIdx, idx)}
                              style={{ marginRight: 12 }}
                            />
                            {/* Vertical divider */}
                            <div
                              style={{
                                width: 1,
                                height: 18,
                                background: '#e0e0e0',
                                margin: '0 8px',
                                alignSelf: 'auto',
                                transform: 'translateX(-8px)',
                              }}
                            />
                            {/* Progress bar (linear, no tooltip, no info) */}
                            <Progress
                              percent={kr.percent}
                              success={{ percent: kr.success }}
                              style={{ marginRight: 12, width: 700 }}
                              showInfo={false}
                            />
                          </>
                        )}
                      </Flex>
                    </Tooltip>
                    {idx < obj.keyResults.length - 1 && (
                      <div
                        style={{
                          borderBottom: '1px solid #e0e0e0',
                          width: '100%',
                        }}
                      />
                    )}
                  </div>
                ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics;
