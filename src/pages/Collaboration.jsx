import { useState } from 'react';
import {
  generateMockUsers,
  generateMockTeams,
  getRandomFeaturedUser,
  generateMockOKRs,
} from '../utils/mockCollabData';
import '../styles/Collaboration.css';
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Divider,
  Popover,
  FloatButton,
  Button,
  Tooltip,
  Row,
  Col,
  Modal,
  Collapse,
  Progress,
} from 'antd';
import { TrophyOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';

function Collaboration({ onAddFavorite }) {
  // Generate random users and teams (can be replaced with real data)
  const [users] = useState(() => generateMockUsers(6));
  const [teams] = useState(() => generateMockTeams(3, users));
  const [featured, setFeatured] = useState(() => getRandomFeaturedUser(users));
  const [reportingModal, setReportingModal] = useState({
    visible: false,
    okr: null,
  });
  const navigate = useNavigate();
  const isAdmin = featured.data && featured.data.role === 'admin';

  function handleOpenReportingModal(okr) {
    setReportingModal({ visible: true, okr });
  }
  function handleCloseReportingModal() {
    setReportingModal({ visible: false, okr: null });
  }
  function handleNavigateToModule(moduleId) {
    navigate(`/Learning&Development?module=${moduleId}`);
  }

  function ReportingModal({ visible, okr, onClose, isAdmin }) {
    const [activeKey, setActiveKey] = useState([]);

    if (!okr) return null;
    return (
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        title={`OKR: ${okr.title}`}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>{okr.title}</div>
          <Tag
            color={okr.status === 'Active' ? 'green' : 'red'}
            style={{ borderRadius: 8, fontWeight: 500, marginLeft: 8 }}
          >
            {okr.status}
          </Tag>
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Progress
              type="circle"
              percent={okr.progress}
              width={48}
              strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
              format={(percent) => `${percent}%`}
              style={{ fontWeight: 700 }}
            />
          </div>
        </div>
        {isAdmin && (
          <Button
            type="primary"
            style={{ marginBottom: 12 }}
            onClick={() =>
              setActiveKey((keys) =>
                keys.includes('1')
                  ? keys.filter((k) => k !== '1')
                  : [...keys, '1'],
              )
            }
          >
            {activeKey.includes('1') ? 'Hide Draft Summary' : 'Draft Summary'}
          </Button>
        )}
        <Collapse
          activeKey={activeKey}
          onChange={setActiveKey}
          defaultActiveKey={isAdmin ? [] : ['2']}
        >
          {isAdmin && (
            <Collapse.Panel header="Draft Summary" key="1">
              <div style={{ marginBottom: 8 }}>
                Draft a summary for this OKR:
              </div>
              <textarea
                style={{ width: '100%', minHeight: 80, marginBottom: 8 }}
                placeholder="Enter summary..."
              />
              <Button type="primary">Save Summary</Button>
            </Collapse.Panel>
          )}
          <Collapse.Panel header="Feedback" key="2">
            <div style={{ marginBottom: 8 }}>Leave feedback for this OKR:</div>
            <textarea
              style={{ width: '100%', minHeight: 60, marginBottom: 8 }}
              placeholder="Enter feedback..."
            />
            <Button type="primary">Submit Feedback</Button>
          </Collapse.Panel>
        </Collapse>
      </Modal>
    );
  }

  // Helper: Render Featured Card
  const renderFeaturedCard = () => {
    if (featured.type === 'user') {
      return (
        <Card
          style={{
            height: 400,
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
            marginBottom: 24,
            padding: 0,
            border: 'none',
            overflow: 'auto',
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 220, maxWidth: 350 }}>
              <Descriptions
                title={
                  <Tooltip
                    title={`Go to ${featured.data.name}'s Profile`}
                    color="#18ff3eff"
                    overlayInnerStyle={{
                      color: '#222',
                      fontWeight: 500,
                      fontSize: 11,
                      border: '1px solid #18ff3eff',
                      boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                      padding: '6px 14px',
                      minWidth: 120,
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 22,
                        color: '#14184b',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        setFeatured({
                          type: 'user',
                          data: featured.data,
                          okrs: featured.okrs,
                        })
                      }
                    >
                      {featured.data.name}
                    </span>
                  </Tooltip>
                }
                column={1}
                labelStyle={{ fontWeight: 600, color: '#888' }}
              >
                <Descriptions.Item label="Email">
                  {featured.data.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {featured.data.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Team">
                  <Tooltip
                    title={`Go to ${featured.data.team}`}
                    color="#18ff3eff"
                    overlayInnerStyle={{
                      color: '#222',
                      fontWeight: 500,
                      fontSize: 11,
                      border: '1px solid #18ff3eff',
                      boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                      padding: '6px 14px',
                      minWidth: 120,
                      textAlign: 'center',
                    }}
                  >
                    <Tag
                      color="#1890ff"
                      style={{
                        fontWeight: 600,
                        borderRadius: 8,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const t = teams.find(
                          (t) => t.name === featured.data.team,
                        );
                        if (t)
                          setFeatured({ type: 'team', data: t, okrs: t.okrs });
                      }}
                    >
                      {featured.data.team}
                    </Tag>
                  </Tooltip>
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Tooltip
                title={`Go to ${featured.data.name}'s Profile`}
                color="#18ff3eff"
                overlayInnerStyle={{
                  color: '#222',
                  fontWeight: 500,
                  fontSize: 11,
                  border: '1px solid #18ff3eff',
                  boxShadow: '0 2px 8px rgba(24,144,255,0.10)',
                  padding: '6px 14px',
                  minWidth: 120,
                  textAlign: 'center',
                }}
              >
                <Avatar
                  src={featured.data.avatar}
                  size={128}
                  style={{
                    boxShadow: '0 2px 8px rgba(20,24,75,0.10)',
                    cursor: 'pointer',
                  }}
                />
              </Tooltip>
              <Button
                icon={<StarFilled style={{ color: '#fadb14' }} />}
                type="text"
                onClick={() =>
                  onAddFavorite({
                    key: `user-${featured.data.name}`,
                    type: 'user',
                    label: featured.data.name,
                    route: `/user/${featured.data.name}`,
                    avatar: featured.data.avatar,
                  })
                }
                style={{ marginLeft: 0, color: '#888', fontStyle: 'italic' }}
              >
                {`Add ${featured.data.name} to Favorites`}
              </Button>
            </div>
          </div>
          <Divider style={{ margin: '24px 0' }} />
          <h3 style={{ fontWeight: 700, color: '#14184b', marginBottom: 16 }}>
            Involvement
          </h3>
          <div style={{ width: '100%' }}>
            {/* Playground Grid: First Row - OKRs */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                OKRs Involved With
              </span>
              <div style={{ marginTop: 12 }}>
                <Row gutter={[16, 16]}>
                  {featured.okrs && featured.okrs.length > 0 ? (
                    featured.okrs.map((okr) => (
                      <Col key={okr.id}>
                        <Tooltip
                          title={`View and interact with reporting for ${okr.title}`}
                          color="#1890ff"
                        >
                          <Card
                            hoverable
                            style={{
                              minWidth: 220,
                              maxWidth: 260,
                              borderRadius: 10,
                              border: '1px solid #e6f7ff',
                            }}
                            onClick={() => handleOpenReportingModal(okr)}
                          >
                            <div style={{ fontWeight: 600, fontSize: 15 }}>
                              {okr.title}
                            </div>
                            <Tag
                              color={okr.status === 'Active' ? 'green' : 'red'}
                              style={{
                                borderRadius: 8,
                                fontWeight: 500,
                                marginTop: 8,
                              }}
                            >
                              {okr.status}
                            </Tag>
                            <div
                              style={{
                                marginTop: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Progress
                                type="circle"
                                percent={okr.progress}
                                width={40}
                                strokeColor={{
                                  '0%': '#1890ff',
                                  '100%': '#52c41a',
                                }}
                                format={(percent) => `${percent}%`}
                                style={{ fontWeight: 700 }}
                              />
                            </div>
                          </Card>
                        </Tooltip>
                      </Col>
                    ))
                  ) : (
                    <Col>
                      <span style={{ color: '#888' }}>No OKRs</span>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
            {/* Playground Grid: Second Row - Training Modules */}
            <div>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Training Modules
              </span>
              <div style={{ marginTop: 12 }}>
                <Row gutter={[16, 16]}>
                  {featured.data.trainingModules &&
                  featured.data.trainingModules.length > 0 ? (
                    featured.data.trainingModules.map((mod) => (
                      <Col key={mod.id}>
                        <Tooltip
                          title={`Go to ${mod.title} in Learning & Development`}
                          color="#52c41a"
                        >
                          <Card
                            hoverable
                            style={{
                              minWidth: 220,
                              maxWidth: 260,
                              borderRadius: 10,
                              border: '1px solid #e6fffb',
                            }}
                            onClick={() => handleNavigateToModule(mod.id)}
                          >
                            <div style={{ fontWeight: 600, fontSize: 15 }}>
                              {mod.title}
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <Tag
                                color="#52c41a"
                                style={{ borderRadius: 8, fontWeight: 500 }}
                              >
                                {mod.status || 'Active'}
                              </Tag>
                            </div>
                            <div
                              style={{
                                marginTop: 8,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Progress
                                type="circle"
                                percent={mod.progress || 0}
                                width={36}
                                strokeColor={{
                                  '0%': '#1890ff',
                                  '100%': '#52c41a',
                                }}
                                format={(percent) => `${percent}%`}
                                style={{ fontWeight: 700 }}
                              />
                            </div>
                          </Card>
                        </Tooltip>
                      </Col>
                    ))
                  ) : (
                    <Col>
                      <span style={{ color: '#888' }}>No Training Modules</span>
                    </Col>
                  )}
                </Row>
              </div>
            </div>
          </div>
          <ReportingModal
            visible={reportingModal.visible}
            okr={reportingModal.okr}
            onClose={handleCloseReportingModal}
            isAdmin={isAdmin}
            user={featured.data}
          />
        </Card>
      );
    } else if (featured.type === 'team') {
      return (
        <Card
          style={{
            height: 400,
            maxWidth: 800,
            margin: '0 auto',
            borderRadius: 16,
            boxShadow: '0 2px 16px rgba(20,24,75,0.10)',
            marginBottom: 24,
            padding: 0,
            border: 'none',
            overflow: 'auto',
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              marginBottom: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 220, maxWidth: 350 }}>
              <Descriptions
                title={
                  <span
                    style={{ fontWeight: 700, fontSize: 22, color: '#14184b' }}
                  >
                    {featured.data.name}
                  </span>
                }
                column={1}
                labelStyle={{ fontWeight: 600, color: '#888' }}
              >
                <Descriptions.Item label="Team Leads">
                  {featured.data.leads && featured.data.leads.length > 0
                    ? featured.data.leads.map((lead, idx) => {
                        const userObj = users.find((u) => u.name === lead);
                        return (
                          <Tag>
                            <span
                              key={lead}
                              style={{
                                cursor: userObj ? 'pointer' : 'default',
                                color: userObj ? '#1890ff' : undefined,
                                marginRight: 6,
                              }}
                              onClick={() => {
                                if (userObj) {
                                  setFeatured({
                                    type: 'user',
                                    data: userObj,
                                    okrs: generateMockOKRs(2),
                                  });
                                }
                              }}
                            >
                              {lead}
                              {idx < featured.data.leads.length - 1 ? ', ' : ''}
                            </span>
                          </Tag>
                        );
                      })
                    : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Collaborators">
                  {featured.data.collaborators &&
                  featured.data.collaborators.length > 0
                    ? featured.data.collaborators.map((collab, idx) => {
                        const userObj = users.find((u) => u.name === collab);
                        return (
                          <Tag>
                            <span
                              key={collab}
                              style={{
                                cursor: userObj ? 'pointer' : 'default',
                                color: userObj ? '#1890ff' : undefined,
                                marginRight: 6,
                              }}
                              onClick={() => {
                                if (userObj) {
                                  setFeatured({
                                    type: 'user',
                                    data: userObj,
                                    okrs: generateMockOKRs(2),
                                  });
                                }
                              }}
                            >
                              {collab}
                              {idx < featured.data.collaborators.length - 1
                                ? ', '
                                : ''}
                            </span>
                          </Tag>
                        );
                      })
                    : 'N/A'}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Avatar
                icon={<StarFilled style={{ color: '#1890ff', fontSize: 64 }} />}
                size={128}
                style={{ boxShadow: '0 2px 8px rgba(20,24,75,0.10)' }}
              />
              <Button
                icon={<StarFilled style={{ color: '#fadb14' }} />}
                type="text"
                onClick={() =>
                  onAddFavorite({
                    key: `team-${featured.data.id}`,
                    type: 'team',
                    label: featured.data.name,
                    route: `/team/${featured.data.id}`,
                  })
                }
                style={{ marginLeft: 0 }}
              >
                {`Add ${featured.data.name} to Favorites`}
              </Button>
            </div>
          </div>
          <Divider style={{ margin: '24px 0' }} />
          <h3 style={{ fontWeight: 700, color: '#14184b', marginBottom: 16 }}>
            OKRs Involvement
          </h3>
          <Row gutter={[16, 16]}>
            {featured.okrs && featured.okrs.length > 0 ? (
              featured.okrs.map((okr) => (
                <Col key={okr.id}>
                  <Tooltip
                    title={`View and interact with reporting for ${okr.title}`}
                    color="#1890ff"
                  >
                    <Card
                      hoverable
                      style={{
                        minWidth: 220,
                        maxWidth: 260,
                        borderRadius: 10,
                        border: '1px solid #e6f7ff',
                      }}
                      onClick={() => handleOpenReportingModal(okr)}
                    >
                      <div style={{ fontWeight: 600, fontSize: 15 }}>
                        {okr.title}
                      </div>
                      <Tag
                        color={okr.status === 'Active' ? 'green' : 'red'}
                        style={{
                          borderRadius: 8,
                          fontWeight: 500,
                          marginTop: 8,
                        }}
                      >
                        {okr.status}
                      </Tag>
                      <div
                        style={{
                          marginTop: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Progress
                          type="circle"
                          percent={okr.progress}
                          width={40}
                          strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
                          format={(percent) => `${percent}%`}
                          style={{ fontWeight: 700 }}
                        />
                      </div>
                    </Card>
                  </Tooltip>
                </Col>
              ))
            ) : (
              <Col>
                <span style={{ color: '#888' }}>No OKRs</span>
              </Col>
            )}
          </Row>
        </Card>
      );
    }
    return null;
  };

  // Helper: Render User/Team Card (for list)
  const renderMiniCard = (item, type) => (
    <Card
      key={item.id}
      style={{
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 12,
        cursor: 'pointer',
        border:
          featured.type === type && featured.data.id === item.id
            ? '2px solid #1890ff'
            : undefined,
      }}
      onClick={() =>
        setFeatured({
          type,
          data: item,
          okrs: type === 'user' ? generateMockOKRs(2) : item.okrs,
        })
      }
    >
      {type === 'user' ? (
        <Avatar
          src={item.avatar}
          size={48}
          style={{
            margin: '12px 0',
            boxShadow: '0 2px 8px rgba(20,24,75,0.10)',
          }}
        />
      ) : (
        <Avatar
          icon={<StarFilled style={{ color: '#1890ff', fontSize: 32 }} />}
          size={48}
          style={{
            margin: '12px 0',
            boxShadow: '0 2px 8px rgba(20,24,75,0.10)',
          }}
        />
      )}
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
        {item.name}
      </div>
      <Tooltip
        title="Add to favorites"
        color="#fadb14"
        overlayInnerStyle={{
          color: '#222',
          fontWeight: 500,
          fontSize: 13,
          border: '1px solid #ffe58f',
          boxShadow: '0 2px 8px rgba(250,219,20,0.10)',
          padding: '6px 14px',
          minWidth: 120,
          textAlign: 'center',
        }}
      >
        <Button
          icon={<StarFilled style={{ color: '#fadb14' }} />}
          type="text"
          onClick={(e) => {
            e.stopPropagation();
            onAddFavorite({
              key: `${type}-${item.id}`,
              type,
              label: item.name,
              route: `/${type}/${item.id}`,
              avatar: item.avatar,
            });
          }}
          style={{ marginLeft: 8 }}
        >
          Add to Favorites
        </Button>
      </Tooltip>
    </Card>
  );

  return (
    <div
      style={{
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        padding: 24,
      }}
    >
      {renderFeaturedCard()}
      <div>
        <h2>Users</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {users.map((user) => renderMiniCard(user, 'user'))}
        </div>
        <h2 style={{ marginTop: 32 }}>Teams</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {teams.map((team) => renderMiniCard(team, 'team'))}
        </div>
      </div>
      <Popover
        content={<Leaderboard />}
        title="Leaderboard"
        trigger="click"
        placement="left"
      >
        <FloatButton
          icon={<TrophyOutlined />}
          style={{ right: 24, bottom: 24 }}
          tooltip="Show Leaderboard"
        />
      </Popover>
    </div>
  );
}

export default Collaboration;
