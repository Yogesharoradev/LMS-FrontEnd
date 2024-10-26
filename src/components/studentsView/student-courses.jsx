import React, { useContext, useEffect, useState } from 'react';
import Header from './header';
import { Button, Card, Checkbox, Dropdown } from 'antd';
import { ArrowUpDownIcon } from 'lucide-react';
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
                if (response?.data?.isCoursepurchased) {
                    navigate(`/course-progress/${id}`);
                } else {
                    navigate(`/course/details/${id}`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const createSearchParamsHelper = (filterParams) => {
        const queryParams = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                const paramsValue = value.join(",");
                queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`);
            }
        }
        return queryParams.join("&");
    };

    useEffect(() => {
        const buildQueryStringForFilters = createSearchParamsHelper(filters);
        setSearchParams(new URLSearchParams(buildQueryStringForFilters));
    }, [filters]);

    const fetchCourseData = async (filters, sort) => {
        try {
            const query = new URLSearchParams({
                ...filters,
                sortBy: sort
            });
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
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

        if (indexOfCurrentSection === -1) {
            cpyFilters = {
                ...cpyFilters,
                [getSectionId]: [getCurrentOption.id]
            };
        } else {
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
            if (indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOption.id);
            } else {
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
        }
        setFilters(cpyFilters);
    };

    return (
        <>
            <Header />
            <div className='container mx-auto p-4'>
                <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
                <div className='flex flex-col gap-4 md:flex-row'>
                    <aside className='w-full md:w-64 space-y-4'>
                        <div className='border rounded p-4'>
                            <h3 className='font-semibold'>Filters</h3>
                            <div>
                                <h4 className='font-semibold'>Categories</h4>
                                {/* Example for category filter */}
                                {filters.category?.map((category) => (
                                    <Checkbox
                                        key={category}
                                        onChange={() => handleFilterOnChange("category", { id: category })}
                                        checked={filters.category.includes(category)}
                                    >
                                        {category}
                                    </Checkbox>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className='flex-1'>
                        <div className='flex justify-between items-center mb-4'>
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <Button onClick={(e) => e.preventDefault()}>
                                    Sort By <ArrowUpDownIcon />
                                </Button>
                            </Dropdown>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {
                                studentViewCourseData && studentViewCourseData.length > 0 ?
                                    studentViewCourseData?.map((item, idx) => (
                                        <Card key={idx} className='border rounded-lg overflow-hidden shadow cursor-pointer' onClick={() => handleNavigate(item?._id)}>
                                            <img src={item?.image} height={150} width={300} className='w-full h-40 object-cover' />
                                            <div className='p-4'>
                                                <h1 className='font-bold mb-2'>{item?.title}</h1>
                                                <h1 className='text-sm text-gray-700 mb-2'>{item?.instructorName}</h1>
                                                <p className='font-bold text-[16px]'>$ {item.pricing}</p>
                                            </div>
                                        </Card>
                                    ))
                                    : <h1>No Courses Available</h1>
                            }
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default StudentCourses;
