// OwnerLink.jsx
import { Avatar, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function OwnerLink({ owner, style = {} }) {
  const navigate = useNavigate();
  if (!owner) return null;
  return (
    <Tooltip
      title={`Go to ${owner.name}'s profile`}
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
          ...style,
        }}
        onClick={() =>
          navigate(`/collaboration?user=${encodeURIComponent(owner.name)}`)
        }
        title={`View ${owner.name} in Collaboration`}
      >
        <Avatar src={owner.avatar} />
        <span
          style={{
            marginLeft: 6,
            color: '#1890ff',
            fontWeight: 500,
          }}
        >
          {owner.name}
        </span>
      </span>
    </Tooltip>
  );
}
