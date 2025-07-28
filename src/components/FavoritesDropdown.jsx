import { Dropdown, Menu, Avatar, Tag, Empty } from 'antd';
import { Link } from 'react-router-dom';
import {
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  AimOutlined,
} from '@ant-design/icons';

// Example favorite types: okr, report, user, team, settings, custom
const iconMap = {
  okr: <AimOutlined />,
  report: <FileTextOutlined />,
  user: <UserOutlined />,
  team: <TeamOutlined />,
  settings: <SettingOutlined />,
  default: <StarOutlined />,
};

function FavoritesDropdown({ favorites = [] }) {
  const menu = (
    <Menu>
      {favorites.length === 0 ? (
        <Menu.Item disabled key="empty">
          <Empty
            description="No favorites yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Menu.Item>
      ) : (
        favorites.map((fav) => (
          <Menu.Item
            key={fav.key || fav.id}
            icon={iconMap[fav.type] || iconMap.default}
          >
            <Link
              to={fav.route}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {fav.avatar && (
                <Avatar src={fav.avatar} size={20} style={{ marginRight: 6 }} />
              )}
              <span>{fav.label}</span>
              {fav.tag && (
                <Tag color={fav.tagColor || 'blue'} style={{ marginLeft: 8 }}>
                  {fav.tag}
                </Tag>
              )}
            </Link>
          </Menu.Item>
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
      <span
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <StarOutlined style={{ color: '#faad14', fontSize: 18 }} /> Favorites
      </span>
    </Dropdown>
  );
}

export default FavoritesDropdown;
