import { Avatar, Empty } from 'antd';
import { Link } from 'react-router-dom';
import {
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  AimOutlined,
} from '@ant-design/icons';

const iconMap = {
  okr: <AimOutlined />,
  report: <FileTextOutlined />,
  user: <UserOutlined />,
  team: <TeamOutlined />,
  settings: <SettingOutlined />,
  default: <StarOutlined />,
};

function FavoritesDropdown({ favorites = [] }) {
  if (!favorites.length) {
    return (
      <div style={{ padding: '12px 16px', color: '#888' }}>
        <Empty description="No favorites yet" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        padding: '8px 0',
      }}
    >
      {favorites.map((fav) => (
        <Link
          key={fav.key || fav.id}
          to={fav.route}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 6,
            transition: 'background 0.2s',
          }}
        >
          {iconMap[fav.type] || iconMap.default}
          {fav.avatar && (
            <Avatar src={fav.avatar} size={20} style={{ marginRight: 6 }} />
          )}
        </Link>
      ))}
    </div>
  );
}

export default FavoritesDropdown;
