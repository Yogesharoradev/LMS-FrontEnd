import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tabs } from 'antd';
import { GraduationCap } from 'lucide-react';
import SignInForm from '../../components/signInForm';
import SignUpForm from '../../components/signupForm';

const { TabPane } = Tabs;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
        <Link to="/" className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </h1>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            centered 
            tabBarStyle={{ width: '100%' }}
            className='font-bold shadow-2xl'
          >
            <TabPane tab="Sign In" key="signin" className='font-semibold text-2xl ss'>
              <Card className='p-5 shadow-2xl' >
              <SignInForm />
              </Card>
            </TabPane>
            <TabPane tab="Sign Up" key="signup" className='font-semibold text-2xl'>
              <Card className='p-5 shadow-2xl'>
              <SignUpForm />
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
