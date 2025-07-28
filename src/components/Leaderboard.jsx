import { useState, useEffect } from 'react';
import { Card, List, Avatar, Tag } from 'antd';

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

  if (loading)
    return (
      <Card
        style={{
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          borderRadius: 16,
          marginBottom: 32,
          minHeight: 120,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 120,
          }}
        >
          <span style={{ fontSize: 20, color: '#888' }}>
            Loading leaderboard...
          </span>
        </div>
      </Card>
    );

  return (
    <div>
      <Card
        title={
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              background: 'linear-gradient(90deg,#1890ff,#6f42c1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Team Rankings
          </span>
        }
        style={{
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          borderRadius: 16,
          marginBottom: 32,
          border: 'none',
          padding: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={teamRanks}
          renderItem={(team, idx) => (
            <List.Item
              style={{
                background:
                  idx === 0 ? 'linear-gradient(90deg,#e3f0ff,#fffbe6)' : '#fff',
                borderRadius: 14,
                margin: '8px 16px',
                boxShadow: idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none',
                transition: 'box-shadow 0.2s',
                border: idx === 0 ? '2px solid #1890ff' : '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 18px',
                cursor: 'pointer',
                gap: 12,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(24,144,255,0.18)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none')
              }
            >
              <Avatar
                style={{
                  background:
                    idx === 0
                      ? 'gold'
                      : idx === 1
                        ? 'silver'
                        : idx === 2
                          ? '#ff7875'
                          : '#1890ff',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 20,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                }}
                size={48}
              >
                {idx + 1}
              </Avatar>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, fontSize: 18 }}>
                  {team.name}
                </span>
                <div style={{ fontSize: 14, color: '#888', marginTop: 2 }}>
                  Score: <b style={{ color: '#1890ff' }}>{team.score}</b>
                </div>
              </div>
              <Tag
                color={
                  idx === 0
                    ? 'gold'
                    : idx === 1
                      ? 'silver'
                      : idx === 2
                        ? 'volcano'
                        : 'blue'
                }
                style={{ fontSize: 16, padding: '4px 12px', borderRadius: 8 }}
              >
                {idx === 0
                  ? '🥇'
                  : idx === 1
                    ? '🥈'
                    : idx === 2
                      ? '🥉'
                      : idx + 1}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
      <Card
        title={
          <span
            style={{
              fontWeight: 700,
              fontSize: 22,
              background: 'linear-gradient(90deg,#6f42c1,#1890ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            User Rankings (by Team)
          </span>
        }
        style={{
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          borderRadius: 18,
          border: 'none',
          padding: 0,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {userRanks.length === 0 ? (
          <div
            style={{
              padding: 32,
              textAlign: 'center',
              color: '#888',
              fontSize: 18,
            }}
          >
            No user rankings found.
          </div>
        ) : (
          userRanks.map((team) => (
            <div
              key={team.teamName}
              style={{ marginBottom: 32, padding: '0 12px' }}
            >
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: '#6f42c1',
                  marginBottom: 12,
                }}
              >
                {team.teamName}
              </h3>
              <List
                itemLayout="horizontal"
                dataSource={team.users}
                renderItem={(user, idx) => (
                  <List.Item
                    style={{
                      background:
                        idx === 0
                          ? 'linear-gradient(90deg,#e3f0ff,#fffbe6)'
                          : '#fff',
                      borderRadius: 12,
                      margin: '6px 0',
                      boxShadow:
                        idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none',
                      border:
                        idx === 0 ? '2px solid #1890ff' : '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px 16px',
                      gap: 10,
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        '0 4px 16px rgba(24,144,255,0.18)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        idx < 3 ? '0 2px 8px rgba(24,144,255,0.08)' : 'none')
                    }
                  >
                    <Avatar
                      src={user.avatar}
                      size={40}
                      style={{
                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        border: idx === 0 ? '2px solid gold' : 'none',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, fontSize: 16 }}>
                        {user.name}
                      </span>
                      <div
                        style={{ fontSize: 13, color: '#888', marginTop: 2 }}
                      >
                        Score: <b style={{ color: '#1890ff' }}>{user.score}</b>
                      </div>
                    </div>
                    <Tag
                      color={
                        idx === 0
                          ? 'gold'
                          : idx === 1
                            ? 'silver'
                            : idx === 2
                              ? 'volcano'
                              : 'blue'
                      }
                      style={{
                        fontSize: 15,
                        padding: '3px 10px',
                        borderRadius: 8,
                      }}
                    >
                      {idx === 0
                        ? '🥇'
                        : idx === 1
                          ? '🥈'
                          : idx === 2
                            ? '🥉'
                            : idx + 1}
                    </Tag>
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

export default Leaderboard;
