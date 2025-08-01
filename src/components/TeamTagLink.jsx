// TeamTag.jsx
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function TeamTag({ team, style = {} }) {
  const navigate = useNavigate();
  if (!team) return null;
  return (
    <Tag
      color="#1890ff"
      style={{
        fontWeight: 600,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        ...style,
      }}
      onClick={() =>
        navigate(`/collaboration?team=${encodeURIComponent(team.name)}`)
      }
    >
      {team.icon && <span style={{ marginRight: 4 }}>{team.icon}</span>}
      {team.name}
    </Tag>
  );
}
