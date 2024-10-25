import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../lib/axiosInstance';
import { AuthContext } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';



const SignInForm = () => {
  const {setAuth} = useContext(AuthContext)
  const [form] = Form.useForm(); 
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 

  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
        const response = await axiosInstance.post("/auth/login", values);

        if (response?.data?.success) {        
            const {payload} = response.data.data   
          
            setAuth({
                authenticate: true,
                user: payload, 
            });
            navigate("/"); 
            message.success("Login successfully");
        } else {
            setAuth({
                authenticate: false,
                user: null,
            });
            message.error("Login failed");
        }
    } catch (err) {
        message.error(err.response.data.message);
        console.log(err);
    }
};


  const handleFormChange = () => {
    const { email, password } = form.getFieldsValue();
    setIsButtonDisabled(!(email && password)); 
  };

  return (
    <div className="flex items-center justify-center text-center flex-col">
      <Form
        form={form}
        name="signin"
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
      >
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
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignInForm;
