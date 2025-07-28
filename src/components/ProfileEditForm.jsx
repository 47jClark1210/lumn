import React from 'react';
import { Form, Input, Button, Spin } from 'antd';

function ProfileEditForm({ user, onUpdate, updating }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || '',
        email: user.email || '',
        team: user.team || '',
      });
    }
  }, [user, form]);

  const handleFinish = (values) => {
    onUpdate(values);
  };

  return (
    <Spin spinning={updating}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 400, margin: '0 auto' }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter a valid email',
            },
          ]}
        >
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label="Team" name="team">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updating} block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}

export default ProfileEditForm;
