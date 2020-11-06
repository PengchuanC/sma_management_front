import React from 'react';
import { Form, Input, Button, Space, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './allocate.less';

interface Option {
  label: string;
  value: string;
}

let options: Option[] = [
  { label: '沪深300', value: '000300' },
  { label: '中证500', value: '000905' },
];

export default function MVO() {
  // 提交时触发
  const onFinish = (values: []) => {
    console.log(values);
  };

  return (
    <div className="sma-allocate">
      <div className="sma-allocate-header">
        <p>指数</p>
        <p>下限(%)</p>
        <p>上限(%)</p>
      </div>
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.List name="index">
          {(fields, { add, remove }) => {
            return (
              <div style={{ width: '100%' }}>
                {fields.map(field => (
                  <Space
                    key={field.key}
                    style={{ display: 'flex', marginBottom: 2, width: '100%' }}
                    align="start"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      fieldKey={[field.fieldKey, 'name']}
                      rules={[{ required: true, message: '未选择指数' }]}
                    >
                      <Select
                        options={options}
                        style={{ width: '100%' }}
                        placeholder="请选择指数"
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      style={{ border: 'red 1px solid', width: '100%' }}
                      name={[field.name, 'low']}
                      fieldKey={[field.fieldKey, 'low']}
                      rules={[
                        { required: true, message: '请设置下限，最低为0' },
                      ]}
                    >
                      <Input placeholder="下限" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'high']}
                      fieldKey={[field.fieldKey, 'high']}
                      rules={[
                        { required: true, message: '请设置上限，最高为100' },
                      ]}
                    >
                      <Input placeholder="上限" style={{ width: '100%' }} />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    block
                  >
                    <PlusOutlined /> 添加指数
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
