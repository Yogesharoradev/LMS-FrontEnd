import { Button, Card, Space, Table, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '../../config';
import { CourseContext } from '../../context/course-context';
import axiosInstance from '../../lib/axiosInstance';


const InstructorCourses = ({setTotalRevenue ,setTotalStudents , coursesData, setCoursesData}) => {

  const navigate = useNavigate();


  const { 
    setCourseCurriculumData , 
     setCourseLandingData ,
     setCourseCurrentEditedIndex} = useContext(CourseContext)
 

  const getAllCourses = async () => {
    try {
      const result = await axiosInstance.get("/instructor/course/get");

      if (result?.data?.success) {
        const formattedCourses = result?.data?.coursesList
        .map((course, index) => ({
          key: course._id, 
          name: course.title, 
          students: course.Students.length, 
          revenue: course.pricing * course.Students.length,
          CourseName : course.title,
          studentDetails: course.Students.map((student) => ({
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          })),
        }));
        setCoursesData(formattedCourses);

        const totalStudentsCount = formattedCourses.reduce((acc, course) => acc + course.students, 0);
        const totalRevenueAmount = formattedCourses.reduce((acc, course) => acc + course.revenue ,0)

        setTotalStudents(totalStudentsCount);
        setTotalRevenue(totalRevenueAmount);



      } else {
        message.error("Error fetching courses data");
      }
    } catch (err) {
      message.error("Error getting data");
    }
  };

  const handleDelete =async(id)=>{
    try{
        
        await axiosInstance.delete(`/instructor/course/delete/${id}`)
        message.success("Deleted Course SuccessFully")
        setCoursesData(prevCourse => prevCourse.filter(course => course.key !== id))

    }catch(err){
        message.error("error in deleting")
        console.log(err)
    }
  }

  useEffect(() => {
    getAllCourses();
  }, []);

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Students Enrolled',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
             type="link" 
             onClick={() => {
             navigate(`/admin/course/edit/${record.key}`)}
             }>Edit</Button>
          <Button 
            type="link" 
            danger 
            onClick={()=>{
                handleDelete(record.key)}
            }>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='min-h-screen'>
      <Card>
        <div className='flex justify-between items-center'>
          <h1 className='font-bold text-3xl'>All Courses</h1>
          <Button
            size='large'
            className='font-semibold'
            onClick={() => {
                setCourseCurrentEditedIndex(null)
                navigate("/admin/add-new-course")
                setCourseCurriculumData(courseCurriculumInitialFormData)
                setCourseLandingData(courseLandingInitialFormData)
            }}
          >
            Create New Course
          </Button>
        </div>
        <Table
          className='py-7'
          dataSource={coursesData}
          columns={columns}
          pagination={false}
          rowKey="key"
        />
      </Card>
    </div>
  );
}

export default InstructorCourses;
