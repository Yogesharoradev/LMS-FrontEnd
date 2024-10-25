import { BarChart, Book, LogOut } from 'lucide-react';
import React, { useContext, useState } from 'react';
import InstructorDashboard from '../components/instructorDashboard';
import InstructorCourses from '../components/courses';
import { Button, message } from 'antd';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

const AdminPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [coursesData, setCoursesData] = useState([]);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "Dashboard",
      component: <InstructorDashboard totalStudents={totalStudents} totalRevenue={totalRevenue} coursesData={coursesData}  />
    },
    {
      icon: Book,
      label: "Courses",
      value: "Courses",
      component: <InstructorCourses setTotalStudents={setTotalStudents} setTotalRevenue={setTotalRevenue} coursesData={coursesData} setCoursesData={setCoursesData} />
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null
    }
  ];

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      message.success(response?.data?.message);
      setAuth({
        authenticate: false,
        user: null
      });
      navigate("/auth");
    } catch (err) {
      message.error("failed login");
      console.log(err);
    }
  };

  const currentComponent = menuItems.find((item) => item.value === activeTab)?.component;

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block min-h-screen'>
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-4'> Instructor view</h2>
          <nav>
            {
              menuItems.map((item, idx) => (
                <Button key={idx} className={`w-full justify-start mb-2 ${activeTab === item.value ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                  onClick={item.value === 'logout' ? handleLogout : () => setActiveTab(item.value)}
                >
                  <item.icon className='h-4 w-4 mr-2' />
                  {item.label}
                </Button>
              ))
            }
          </nav>
        </div>
      </aside>
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className="mx-auto max-w-7xl">
          <h1 className='text-3xl font-bold mb-8'>
            {activeTab}
          </h1>
          <div>
            {currentComponent}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPage;
