import { useState, useEffect } from 'react';
import { mockData, getRandomFeaturedUser } from '../utils/mockData';
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
  message,
} from 'antd';
import { TrophyOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import { useFavorites } from '../context/FavoritesContext';

function Collaboration() {
  // Use centralized mock data for users, teams, okrs, modules
  const [users] = useState(() => mockData.users);
  const [teams] = useState(() => mockData.teams);
  const [okrs] = useState(() => mockData.okrs);
  const [modules] = useState(() => mockData.modules);

  // Featured can be a user or a team, with their related OKRs
  const [featured, setFeatured] = useState(() => getRandomFeaturedUser());
  const [reportingModal, setReportingModal] = useState({
    visible: false,
    okr: null,
  });
  const [okrSummaries, setOkrSummaries] = useState({}); // { okrId: summaryText }
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = featured.data && featured.data.role === 'admin';

  // Use context for favorites
  const { addFavorite } = useFavorites();

  // Add to favorites handler (calls context)
  const handleAddFavorite = async (favoriteObj) => {
    try {
      await addFavorite(
        favoriteObj.type,
        favoriteObj.key.replace(`${favoriteObj.type}-`, ''),
      );
      message.success('Added to favorites!');
    } catch (err) {
      message.error('Failed to add to favorites.');
    }
  };

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
    const [activeKey, setActiveKey] = useState(isAdmin ? [] : ['2']);
    const [draftSummary, setDraftSummary] = useState(
      okr && okrSummaries[okr.id] ? okrSummaries[okr.id] : '',
    );

    if (!okr) return null;

    const summaryExists = !!okrSummaries[okr.id];

    const handleSaveSummary = () => {
      setOkrSummaries((prev) => ({
        ...prev,
        [okr.id]: draftSummary.trim(),
      }));
    };

    return (
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={700}
        title={`OKR: ${okr.objective || okr.title}`}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 18 }}>
            {okr.objective || okr.title}
          </div>
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
        <Collapse
          activeKey={activeKey}
          onChange={setActiveKey}
          defaultActiveKey={isAdmin ? [] : ['1', '2']}
        >
          <Collapse.Panel header="Updates" key="1">
            {summaryExists ? (
              <div style={{ whiteSpace: 'pre-line', marginBottom: 8 }}>
                {okrSummaries[okr.id]}
              </div>
            ) : (
              <div style={{ color: '#888', fontStyle: 'italic' }}>
                Nothing to show yet.
              </div>
            )}
          </Collapse.Panel>
          {isAdmin && (
            <Collapse.Panel header="Draft Summary" key="3">
              <div style={{ marginBottom: 8 }}>
                Draft a summary for this OKR:
              </div>
              <textarea
                style={{ width: '100%', minHeight: 80, marginBottom: 8 }}
                placeholder="Enter summary..."
                value={draftSummary}
                onChange={(e) => setDraftSummary(e.target.value)}
              />
              <Button type="primary" onClick={handleSaveSummary}>
                Save Summary
              </Button>
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
      // Get OKRs for this user from mockData
      const userOKRs = okrs.filter((okr) => okr.ownerId === featured.data.id);
      return (
        <Card
          className="hide-scrollbar"
          style={{
            height: 400,
            maxWidth: 600,
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
                        okrs: userOKRs,
                      })
                    }
                  >
                    {featured.data.name}
                  </span>
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
                          setFeatured({
                            type: 'team',
                            data: t,
                            okrs: okrs.filter((okr) => okr.teamId === t.id),
                          });
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
              <Avatar
                src={featured.data.avatar}
                size={128}
                style={{
                  boxShadow: '0 2px 8px rgba(20,24,75,0.10)',
                  cursor: 'pointer',
                }}
              />
              <Button
                icon={<StarFilled style={{ color: '#fadb14' }} />}
                type="text"
                onClick={() =>
                  handleAddFavorite({
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
            {/* OKRs for this user */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                OKRs Involved With
              </span>
              <div style={{ marginTop: 12 }}>
                <Row gutter={[16, 16]}>
                  {userOKRs.length > 0 ? (
                    userOKRs.map((okr) => (
                      <Col key={okr.id}>
                        <Tooltip
                          title={`View and interact with reporting for ${okr.objective || okr.title}`}
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
                              {okr.objective || okr.title}
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
            {/* Training Modules for this user */}
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Training Modules
              </span>
              <div style={{ marginTop: 12 }}>
                <Row gutter={[16, 16]}>
                  {featured.data.assignedModules &&
                  featured.data.assignedModules.length > 0 ? (
                    featured.data.assignedModules.map((modId) => {
                      const mod = modules.find((m) => m.id === modId);
                      return (
                        <Col key={modId}>
                          <Tooltip
                            title={`Go to module: ${mod?.name || modId}`}
                          >
                            <Card
                              hoverable
                              style={{
                                minWidth: 180,
                                maxWidth: 220,
                                borderRadius: 10,
                                border: '1px solid #e6f7ff',
                              }}
                              onClick={() => handleNavigateToModule(modId)}
                            >
                              <div style={{ fontWeight: 600, fontSize: 15 }}>
                                {mod?.name || 'Unknown Module'}
                              </div>
                              <div style={{ color: '#888', marginTop: 4 }}>
                                {mod?.category}
                              </div>
                              <div style={{ color: '#888', marginTop: 4 }}>
                                Instructor: {mod?.instructor}
                              </div>
                            </Card>
                          </Tooltip>
                        </Col>
                      );
                    })
                  ) : (
                    <Col>
                      <span style={{ color: '#888' }}>No assigned modules</span>
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
      // Get OKRs for this team from mockData
      const teamOKRs = okrs.filter((okr) => okr.teamId === featured.data.id);
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
                          <Tag key={lead}>
                            <span
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
                                    okrs: okrs.filter(
                                      (okr) => okr.ownerId === userObj.id,
                                    ),
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
                          <Tag key={collab}>
                            <span
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
                                    okrs: okrs.filter(
                                      (okr) => okr.ownerId === userObj.id,
                                    ),
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
                  handleAddFavorite({
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
            {teamOKRs.length > 0 ? (
              teamOKRs.map((okr) => (
                <Col key={okr.id}>
                  <Tooltip
                    title={`View and interact with reporting for ${okr.objective || okr.title}`}
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
                        {okr.objective || okr.title}
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
          okrs:
            type === 'user'
              ? okrs.filter((okr) => okr.ownerId === item.id)
              : okrs.filter((okr) => okr.teamId === item.id),
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
          onClick={async (e) => {
            e.stopPropagation();
            await handleAddFavorite({
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

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const params = new URLSearchParams(location.search);
    const userName = params.get('user');
    const teamName = params.get('team');
    if (userName) {
      const user = users.find((u) => u.name === userName);
      if (user) setFeatured({ type: 'user', data: user });
    } else if (teamName) {
      const team = teams.find((t) => t.name === teamName);
      if (team) setFeatured({ type: 'team', data: team });
    }
  }, [location.search, users, teams]);

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
