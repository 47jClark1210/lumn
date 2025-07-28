import { Avatar, Upload, Spin, Tooltip, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

function ProfileAvatar({ avatarUrl, onUpload, uploading }) {
  const beforeUpload = (file) => {
    onUpload(file);
    return false; // Prevent auto upload
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: 16 }}>
      <Spin spinning={uploading} data-testid="avatar-upload-spin">
        <Avatar
          size={96}
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
          style={{
            marginBottom: 8,
            border: '2px solid #e0e0e0',
            background: '#f5f5f5',
          }}
        />
      </Spin>
      <div>
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept="image/*"
          disabled={uploading}
        >
          <Tooltip title="Upload new avatar">
            <Button
              icon={<UploadOutlined />}
              size="small"
              loading={uploading}
              data-testid="avatar-upload-input"
            >
              Change Avatar
            </Button>
          </Tooltip>
        </Upload>
      </div>
    </div>
  );
}

export default ProfileAvatar;
