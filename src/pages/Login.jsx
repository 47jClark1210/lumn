import { Button, Card, Typography, Row, Col, Avatar } from 'antd';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import '../styles/Login.css'; // Corrected path to login styles

const { Title, Text } = Typography;

function Login({ onLoginSuccess }) {
  // Simulate SSO login
  const handleSSOLogin = () => {
    // In a real app, redirect to SSO provider
    // For demo, just call onLoginSuccess
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        minWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          minWidth: '100vw',
          minHeight: '100vh',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/wave-background.mp4" type="video/mp4" />
      </video>

      {/* Login Content */}
      <Row justify="center" align="center" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <Card
            style={{
              marginTop: 80,
              border: 'transparent',
              borderRadius: 16,
              boxShadow:
                '0 8px 32px 0 rgba(20,24,75,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.12)',
              textAlign: 'center',
              padding: 32,
              backgroundColor: '#14184bff',
              backdropFilter: 'blur(2px)',
            }}
            styles={{ body: { padding: 32 } }}
          >
            <div style={{ marginBottom: 24 }}>
              <img
                src="/Solar Eclipse Logo.png"
                alt="Solar Eclipse Logo"
                style={{ height: 48, marginRight: 8, verticalAlign: 'middle' }}
              />
            </div>
            <Title
              level={2}
              style={{ fontStyle: 'italic', marginBottom: 2, color: '#ffffff' }}
            >
              lumn©
            </Title>
            <Text type="secondary" style={{ fontSize: 16, color: '#ffffff' }}>
              Sign in with your company SSO to continue
            </Text>
            <div style={{ margin: '32px 0' }}>
              <Button
                type="primary"
                icon={<LoginOutlined />}
                size="large"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}
                onClick={handleSSOLogin}
              >
                Sign in with SSO
              </Button>
            </div>
            <div style={{ marginTop: 24 }}>
              <Avatar
                size={40}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#dcdee1ff', marginRight: 8 }}
              />
              <Text strong style={{ color: '#ffffff' }}>
                User Profile (SSO)
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
