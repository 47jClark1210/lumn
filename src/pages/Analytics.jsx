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
import { generateObjective, getProgressGradient } from '../utils/helpers'; // Update this path after moving helpers

function Analytics({ onAddFavorite }) {
  const [objectives, setObjectives] = useState(
    Array.from({ length: 7 }).map((_, idx) => generateObjective(idx)),
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
              styles={{
                body: {
                  padding:
                    expandedIndex === cardIdx ? '12px 32px 32px 32px' : 32,
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                },
              }} // <-- add flex styles to body
            >
              <Flex
                align="center"
                style={{ flex: 1 /* remove height: '70px' */ }}
              >
                <div
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}
                  >
                    Title
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      marginTop: 3,
                      flexDirection: 'initial',
                      display: 'flex',
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
                        <span style={{ flex: 1 }}>{obj.title}</span>
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
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 12px',
                    borderLeft: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}
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
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 12px',
                    borderLeft: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}
                  >
                    Team
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
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
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 12px',
                    borderLeft: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}
                  >
                    Date Created
                  </div>
                  <div>{obj.dateCreated}</div>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 12px',
                    borderLeft: '1px solid #e0e0e0',
                  }}
                >
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
                      style={{ transform: 'translateX(-30px)' }}
                    />
                  </Tooltip>
                </div>
                <div
                  style={{
                    marginLeft: 12,
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === cardIdx ? null : cardIdx)
                  }
                >
                  <Tooltip title="Add to favorites" color="#188fffff">
                    <Button
                      icon={<StarFilled style={{ color: '#a0a0a0ff' }} />}
                      type="text"
                      onClick={() => onAddFavorite(obj)}
                      style={{
                        marginLeft: 0,
                        transform: 'translate(-55px, 0px)',
                      }}
                    />
                  </Tooltip>
                  {expandedIndex === cardIdx ? (
                    <UpOutlined />
                  ) : (
                    <DownOutlined />
                  )}
                </div>
              </Flex>
              {expandedIndex === cardIdx && (
                <div
                  style={{
                    borderBottom: '1px solid #e0e0e0',
                    width: '100%',
                    marginTop: 2,
                  }}
                />
              )}
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
                      <Flex align="center" style={{ padding: '12px 0' }}>
                        {editKRIndex.obj === cardIdx &&
                        editKRIndex.kr === idx ? (
                          <>
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
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
                            <span
                              style={{
                                flex: 1,
                                fontWeight: '400',
                                fontSize: 15,
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
                                margin: '0 12px',
                                alignSelf: 'stretch',
                                transform: 'translateX(-8px)',
                              }}
                            />
                          </>
                        )}
                        <Tooltip
                          title={`${kr.success}% done / ${kr.percent - kr.success}% in progress`}
                          overlayInnerStyle={{
                            background: getProgressGradient(
                              kr.success,
                              kr.percent,
                            ),
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
                          <div
                            style={{
                              flex: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 20,
                            }}
                          >
                            <Progress
                              percent={kr.percent}
                              success={{ percent: kr.success }}
                            />
                          </div>
                        </Tooltip>
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
