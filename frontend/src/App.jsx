import React, { useEffect, useState } from 'react';
import {
  Layout, Menu, Upload, message, Button, Alert, Table, Space, Input,
} from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import Form from 'antd/lib/form/Form';

const axios = require('axios');

const { Header, Content } = Layout;

async function getRoster() {
  try {
    const resp = await axios.get('/api/getRoster');
    console.log('roster');
    console.log(resp.data);
    return resp.data;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key={1}>Automatic Cold Caller</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <RunScript />
        <Space />
        <DisplayRoster />
        <Space />
        <UploadRoster />
      </Content>
    </Layout>
  );
}

function DisplayRoster() {
  const [roster, setRoster] = useState(false);
  useEffect(async () => {
    if (roster === false) {
      setRoster(await getRoster());
    }
  });

  let hasRoster = false;
  if (roster !== false && roster != null && roster.error == null) {
    hasRoster = true;
  }

  // TODO: make this give an error message
  if (!hasRoster) {
    return <Alert type="warning" message="Was not able to find a roster." />;
  }

  console.log(roster);
  console.log(roster[0]);
  const columnNames = ['name', 'email', 'netid', 'section', 'team', 'skips', 'switches'];
  const columns = columnNames.map((column) => ({
    title: column,
    dataIndex: column,
    key: column,
  }));

  const data = roster.map((row, idx) => ({
    ...row,
    key: idx,
  }));

  return (
    <Table columns={columns} dataSource={data} />
  );
}

// // view for run script form
function RunScript(props) {
  // const roster = getRoster();

  const onFinish = (response) => {
    console.log(response);
  };

  const onFinishFailed = (response) => {
    console.log(response);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

// view for uploading roster
function UploadRoster() {
  const uploadProps = {
    name: 'file',
    action: '/api/uploadRoster',
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('file uploaded successfully');
      } else if (info.file.status === 'error') {
        message.error('file upload failed.');
      }
    },
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to Upload New Roster</Button>
    </Upload>
  );
}

export default App;
