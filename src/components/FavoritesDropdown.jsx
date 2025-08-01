import { Avatar, Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import {
  StarOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined,
  AimOutlined,
  MinusCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const iconMap = {
  okr: <AimOutlined />,
  report: <FileTextOutlined />,
  user: <UserOutlined />,
  team: <TeamOutlined />,
  settings: <SettingOutlined />,
  default: <StarOutlined />,
};

function FavoritesDropdown({
  favorites = [],
  onLinkClick,
  onRemoveFavorite,
  onReorderFavorites,
  editMode,
}) {
  if (!favorites.length) {
    return (
      <div style={{ padding: '12px 16px', color: '#888' }}>
        <Empty
          description="No favorites yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (result.source.index !== result.destination.index) {
      onReorderFavorites(result.source.index, result.destination.index);
    }
  };

  return (
    <div style={{ padding: '8px 0' }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="favorites-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {favorites.map((fav, idx) => {
                const favKey = fav.key || fav.id || fav.favorite_id;
                return (
                  <Draggable
                    key={favKey}
                    draggableId={String(favKey)}
                    index={idx}
                    isDragDisabled={!editMode}
                  >
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '6px 0',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: 6,
                          transition: 'background 0.2s',
                          background: editMode ? '#223355' : 'transparent',
                          ...dragProvided.draggableProps.style,
                        }}
                      >
                        {editMode && (
                          <span
                            {...dragProvided.dragHandleProps}
                            style={{
                              cursor: 'grab',
                              marginRight: 4,
                              color: '#aaa',
                              fontSize: 18,
                            }}
                          >
                            <MenuOutlined />
                          </span>
                        )}
                        <Link
                          to={fav.route}
                          onClick={onLinkClick}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#fff',
                            flex: 1,
                            textDecoration: 'none',
                          }}
                        >
                          {iconMap[fav.type] || iconMap.default}
                          {fav.avatar && (
                            <Avatar
                              src={fav.avatar}
                              size={20}
                              style={{ marginRight: 6 }}
                            />
                          )}
                          <span>{fav.label}</span>
                        </Link>
                        {editMode && (
                          <Button
                            type="text"
                            icon={
                              <MinusCircleOutlined
                                style={{ color: '#ff4d4f' }}
                              />
                            }
                            aria-label={`Remove favorite ${fav.label}`}
                            onClick={() => onRemoveFavorite(fav.type, fav.key)}
                            style={{ marginLeft: 4 }}
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default FavoritesDropdown;
