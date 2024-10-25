import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../lib/axiosInstance';

const SignUpForm = () => {
  const [form] = Form.useForm(); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 

  const onFinish =async (values) => {
    try{
    await axiosInstance.post("/auth/register" , {...values , role: "Student"} ,{withCredentials :true} )
      message.success("Sign up successfully , Login ")
      form.resetFields()
    }catch(err){
      message.error("error in signup")
    }
   
  };

  
  const handleFormChange = () => {
    const { name, email, password } = form.getFieldsValue();
    setIsButtonDisabled(!(name && email && password)); 
  };

  return (
    <div className="flex items-center justify-center text-center flex-col">
      <Form
        form={form}
        name="signup"
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange} 
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Your Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block disabled={isButtonDisabled}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpForm;
