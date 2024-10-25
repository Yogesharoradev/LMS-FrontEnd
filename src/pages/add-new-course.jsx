import { Button, Card, message, Tabs } from 'antd';
import React, { useContext, useEffect } from 'react';
import Curriculum from '../components/courses/curriculum';
import Settings from '../components/courses/settings';
import CourseLandingPage from '../components/courses/course-landing-page';
import { CourseContext } from '../context/course-context';
import { AuthContext } from '../context/auth-context';
import axiosInstance from '../lib/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '../config';

const NewCoursePage = () => {

    const {courseCurriculumData , 
        setCourseCurriculumData , 
        setCourseLandingData , 
        courseLandingData ,
        courseCurrentEditedIndex ,
        setCourseCurrentEditedIndex
        } = useContext(CourseContext)

    const {auth} = useContext(AuthContext)
    const navigate = useNavigate()
    const params = useParams()

    function isEmpty(value){
        if(Array.isArray(value)){
            return value.length === 0 
        }

        return value === "" || value === null || value === undefined
    }

    const validateFormData =()=>{
        for(const key in courseLandingData){
            if(isEmpty(courseLandingData[key])){
                return false
            }
        }
        let hasFreePreview = false
        for(const item of courseCurriculumData){
            if(isEmpty(item.title) || isEmpty(item.public_id) || isEmpty(item.videoUrl)){
                return false
            }

            if(item.freePreview){
                hasFreePreview = true
            }
    
            return hasFreePreview

        }


      
    }

    const handleCreateCourse =async ()=>{
         const formData = { 
             instructorId : auth?.user?._id ,
            instructorName : auth?.user?.name,
            date : new Date() , 
            ...courseLandingData ,
            Students :[],
            curriculum : courseCurriculumData,
            ispublished : true
        }
    
        try{
            const response = 
            courseCurrentEditedIndex !== null ? await axiosInstance.put(`/instructor/course/update/${courseCurrentEditedIndex}` , formData)
           : await axiosInstance.post("/instructor/course/add" , formData)
  
            if(response?.data?.success){
                setCourseCurriculumData(courseCurriculumInitialFormData)
                setCourseLandingData(courseLandingInitialFormData)
                message.success(response?.data?.message || "Task Successfull")
                setCourseCurrentEditedIndex(null)
                navigate(-1)

            }

        }catch(err){
            message.error("Error in  adding Course ")
                    console.log(err)
        }
    }


    const editCourseById = async ()=>{
        try{
            const result = await axiosInstance.get(`/instructor/course/get/details/${courseCurrentEditedIndex}`)
          
            if(result?.data?.success){
                const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc , key)=>{
                    acc[key] = result?.data?.data[key] || courseLandingInitialFormData

                    return acc
                },{})

                setCourseLandingData(setCourseFormData)
                setCourseCurriculumData(result?.data?.data?.curriculum)
            }
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
         if(courseCurrentEditedIndex !== null )  editCourseById()
    },[courseCurrentEditedIndex])

    useEffect(()=>{
        if(params?.courseId) setCourseCurrentEditedIndex(params?.courseId)
    },[params?.courseId])

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-extrabold mb-5'>Create a New Course</h1>
        <Button 
        disabled={!validateFormData()} 
        className='text-sm tracking-widest font-bold px-8 bg-black text-white'
        onClick={handleCreateCourse}
         >
          Submit
        </Button>
      </div>
      <Card>
        <div className='mx-auto p-4 container'>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Curriculum" key="1">
              <Curriculum />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Course Landing Page" key="2">
              <CourseLandingPage />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Settings" key="3">
              <Settings />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default NewCoursePage;
