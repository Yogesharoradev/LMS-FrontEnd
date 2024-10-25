import React, { useContext, useEffect } from 'react';
import axiosInstance from '../../lib/axiosInstance';
import { Button, Card, message } from 'antd';
import Header from '../../components/studentsView/header';
import { courseCategories } from '../../config';
import  { StudentContext } from '../../context/student-context';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

const HomePage = () => {
  
  const {studentViewCourseData , setStudentViewCourseData} = useContext(StudentContext)

  const navigate = useNavigate()
  const {auth} = useContext(AuthContext)

  const fetchCourseData = async ()=>{
    try{
      const result = await axiosInstance.get("/student/get")

        setStudentViewCourseData(result?.data.result)

    }catch(err){
      console.log(err)
    }
  }

  const handleNavigate =async (id)=>{
    try{
        const response = await axiosInstance.get(`/student/get/course/${id}/${auth?.user?._id}`)
        if(response?.data?.success){
            if(response?.data?.isCoursepurchased){
                navigate(`/course-progress/${id}`)
            }else{
                navigate(`/course/details/${id}`)
            }
        }
    }catch(err){
        console.log(err)
    }
  }

  const handleFilters =(id)=>{
      sessionStorage.removeItem("filters")
      const currentFilter = {
        category : [id]
      }

      sessionStorage.setItem("filters" , JSON.stringify(currentFilter))
      navigate("/Student-Courses")
  }


  useEffect(()=>{
    fetchCourseData()
},[])

  return (
    <div>
      <Header />
      <div className='min-h-screen bg-white'>
      <section className='flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 gap-9 '>
        <div className='lg:w-1/2 lg:pr-1/2'>
        <h2 className='text-5xl font-bold mb-4'>Learning that Gets You</h2>
        <p className=' text-xl'>Skills for your Present and Future. Get started with us</p>
        </div>

        <div className='lg-w:full mb-8 lg:mb-0'>
          <img src='/pic.jpg' width={400} height={400} className='w-full h-auto rounded-lg shadow-lg'/>
        </div>
      </section>

      <section className='py-8 px-4 lg:px-8 bg-gray-100'>
        <h2 className='text-2xl font-bold mb-6'>Course Categories</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {
            courseCategories?.map((item)=>(
              <Button key={item.id} className='justify-center font-semibold' onClick={()=>handleFilters(item.id)}>{item.label}</Button>
            ))            
          }
        </div>
      </section>

      <section className='py-12 px-4 lg:px-8'>
      <h2 className='text-2xl font-bold mb-6'>Featured Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            { 
              studentViewCourseData && studentViewCourseData.length > 0 ?
              studentViewCourseData?.map((item , idx )=>(
                <Card key={idx} className='border rounded-lg overflow-hidden shadow cursor-pointer' onClick={()=>handleNavigate(item?._id)} >
                  <img src={item?.image} height={150} width={300} className='w-full h-40 object-cover' />
                  <div className='p-4'>
                  <h1 className='font-bold mb-2' >{item?.title}</h1>
                <h1 className='text-sm text-gray-700 mb-2'>{item?.instructorName}</h1>
                <p className='font-bold text-[16px]'>$ {item.pricing}</p>
                  </div>
                </Card>
              ))

              : <h1>No Courses Available</h1>
              
            }
      </div>
      </section>
      </div>
    </div>
  );
};

export default HomePage;
