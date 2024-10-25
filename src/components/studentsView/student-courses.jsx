import React, { useContext, useEffect, useState } from 'react';
import Header from './header';
import { Button, Card, Checkbox, Dropdown, Drawer } from 'antd';
import { ArrowUpDownIcon, FilterIcon } from 'lucide-react';
import { filterOptions } from '../../config';
import axiosInstance from '../../lib/axiosInstance';
import { StudentContext } from '../../context/student-context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

const StudentCourses = () => {
    const { studentViewCourseData, setStudentViewCourseData } = useContext(StudentContext);
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [sort, setSort] = useState("price-lowtohigh");
    const [filters, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const savedFilters = sessionStorage.getItem("filters");
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
    }, []);

    const handleNavigate = async (id) => {
        try {
            const response = await axiosInstance.get(`/student/get/course/${id}/${auth?.user?._id}`);
            if (response?.data?.success) {
                navigate(response?.data?.isCoursepurchased ? `/course-progress/${id}` : `/course/details/${id}`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const createSearchParamsHelper = (filterParams) => {
        const queryParams = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
            }
        }
        return queryParams.join("&");
    };

    useEffect(() => {
        setSearchParams(new URLSearchParams(createSearchParamsHelper(filters)));
    }, [filters]);

    const fetchCourseData = async (filters, sort) => {
        try {
            const query = new URLSearchParams({ ...filters, sortBy: sort });
            const result = await axiosInstance.get(`/student/get?${query}`);
            setStudentViewCourseData(result?.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCourseData(filters, sort);
    }, [filters, sort]);

    const items = [
        { id: "price-lowtohigh", label: "Price : Low To High", onClick: () => setSort("price-lowtohigh") },
        { id: "price-hightolow", label: "Price : High To Low", onClick: () => setSort("price-hightolow") },
        { id: "title-atoz", label: "Title : A To Z", onClick: () => setSort("title-atoz") },
        { id: "title-ztoa", label: "Title : Z To A", onClick: () => setSort("title-ztoa") },
    ];

    const handleFilterOnChange = (getSectionId, getCurrentOption) => {
        let cpyFilters = { ...filters };
        if (!cpyFilters[getSectionId]) cpyFilters[getSectionId] = [];
        const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
        
        if (indexOfCurrentOption === -1) {
            cpyFilters[getSectionId].push(getCurrentOption.id);
        } else {
            cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }
        
        setFilters(cpyFilters);
    };

    return (
        <>
            <Header />
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
                <div className='flex flex-col gap-4 md:flex-row'>
                    <aside className='w-full md:w-64 space-y-4 hidden md:block'>
                        {Object.keys(filterOptions).map((sectionId, idx) => (
                            <div key={idx} className='space-y-4'>
                                <h3 className='font-bold mb-3'>{sectionId.toUpperCase()}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {filterOptions[sectionId].map(option => (
                                        <label key={option.id} className='flex font-medium items-center gap-3'>
                                            <Checkbox
                                                checked={filters?.[sectionId]?.includes(option.id)}
                                                onChange={() => handleFilterOnChange(sectionId, option)}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </aside>

                    <Button className='flex md:hidden text-center items-center bg-black text-white font-semibold' onClick={() => setIsSidebarOpen(true)}>
                        <FilterIcon className='h-5 w-5 mr-2' /> Filters
                    </Button>

                    <Drawer
                        title="Filters"
                        placement="right"
                        onClose={() => setIsSidebarOpen(false)}
                        open={isSidebarOpen}
                        width={300}
                    >
                        {Object.keys(filterOptions).map((sectionId, idx) => (
                            <div key={idx} className='space-y-4'>
                                <h3 className='font-bold mt-3 mb-3'>{sectionId.toUpperCase()}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {filterOptions[sectionId].map(option => (
                                        <label key={option.id} className='flex font-medium items-center gap-3'>
                                            <Checkbox
                                                checked={filters?.[sectionId]?.includes(option.id)}
                                                onChange={() => handleFilterOnChange(sectionId, option)}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Drawer>

                    <main className='flex-1'>
                        <div className='flex justify-between items-center mb-4 gap-5 flex-wrap'>
                            <Dropdown menu={{ items }}>
                                <Button className='font-semibold text-[16px]'>
                                    <ArrowUpDownIcon className='h-4 w-4' /> Sort By
                                </Button>
                            </Dropdown>
                            <span className='text-sm text-black font-bold'>{studentViewCourseData?.length || 0} Results</span>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {studentViewCourseData?.length > 0 ? (
                                studentViewCourseData.map(item => (
                                    <Card
                                        onClick={() => handleNavigate(item?._id)}
                                        key={item?._id}
                                        className='hover:cursor-pointer hover:bg-gray-100'
                                    >
                                        <div className='flex flex-col gap-4 p-4'>
                                            <div className='w-48 h-32 flex-shrink-0'>
                                                <img src={item?.image} className='w-full h-full object-cover' alt={item?.title} />
                                            </div>
                                            <div className='flex-1'>
                                                <h1 className='text-xl mb-2'>{item?.title}</h1>
                                                <p className='text-sm text-gray-600 mb-1'>Created By{" "}
                                                    <span className='font-bold'>{item?.instructorName.toUpperCase()}</span>
                                                </p>
                                                <p className='text-[14px] text-gray-600 mb-2 mt-2'>
                                                    {`${item?.curriculum?.length} Lectures - ${item?.level.toUpperCase()} Level`}
                                                </p>
                                                <p className='font-bold'>
                                                    $ {item?.pricing}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : <h1 className='font-extrabold text-2xl p-3'>No Courses Found</h1>}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default StudentCourses;
