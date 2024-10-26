import { Button, message } from 'antd';
import { GraduationCap, TvMinimalPlay } from 'lucide-react';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance';
import { AuthContext } from '../../context/auth-context';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.get("/auth/logout");
            setAuth({
                authenticate: false,
                user: null,
            });
            message.success(response?.data?.message);
            navigate("/auth");
        } catch (err) {
            message.error("Error in logout");
        }
    };

    return (
        <header className='flex flex-col md:flex-row items-center justify-between p-4 border-b relative'>
            <div className='flex items-center space-x-4 mb-4 md:mb-0'>
                <Link to="/" className='flex items-center hover:text-black'>
                    <GraduationCap className='w-8 h-8 mr-4' />
                    <h1 className='font-extrabold md:text-xl text-[14px]'>LMS LEARN</h1>
                </Link>
                <div className='flex items-center space-x-1'>
                    <Button
                        className='font-medium md:text-[16px] text-[14px]'
                        onClick={() => {
                            location.pathname.includes("/Student-Courses")
                                ? null
                                : navigate("/Student-Courses");
                        }}
                    >
                        Explore Courses
                    </Button>
                </div>
            </div>
            <div className='flex flex-col md:flex-row items-center space-x-4'>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate("/my-courses-page")} className='font-extrabold md:text-xl text-[14px]'>
                        My Courses
                    </button>
                    <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
                </div>
                <Button className='bg-black text-white mt-3' type='primary' onClick={handleLogout}>
                    Sign Out
                </Button>
            </div>
        </header>
    );
};

export default Header;
