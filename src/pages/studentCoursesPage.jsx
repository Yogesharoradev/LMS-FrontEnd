import React, { useContext, useEffect } from 'react'
import Header from '../components/studentsView/header'
import { StudentContext } from '../context/student-context'
import axiosInstance from '../lib/axiosInstance'
import { AuthContext } from '../context/auth-context'
import { Button, Card } from 'antd'
import { Watch } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StudentCoursesPage = () => {

    const {studentBoughtCoursesList , setStudentBoughtCoursesList} = useContext(StudentContext) 
    const {auth} = useContext(AuthContext)
    const navigate = useNavigate()

    const fetchBoughtCoursesByStudent  = async ()=>{
        try{
                const response = await axiosInstance.get(`student/getBoughtCourse/${auth?.user?._id}`)

                if(response?.data?.success){
                    setStudentBoughtCoursesList(response?.data?.data)
                }
        }catch(err){
            setStudentBoughtCoursesList([])
        }
    }

    useEffect(()=>{
            fetchBoughtCoursesByStudent()
    },[])


  return (
    <>
    <Header />
    <div className='p-4'>
    <h1 className='text-3xl font-bold mb-8'>My Courses</h1>
    <div className='grid gird-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {
            studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? 
            studentBoughtCoursesList.map((item , idx)=>(
                    <Card key={idx} className='flex flex-col shadow-2xl'>
                        <div className='p-4 flex-grow' >
                            <img 
                            src={item.courseImage}
                            alt={item.title}
                            className='h-52 w-full object-cover rounded-md mb-4'
                            />
                            <h3 className='font-bold mb-1'>{item?.title}</h3>
                            <p className='text-sm text-gray-700 mb-2'> {item.instructorName}</p>
                        </div>
                        <Button className='bg-black text-white w-full p-2 font-bold' type='primary'
                            onClick={()=>navigate(`/course-progress/${item?.courseId}`)}
                        >
                            <Watch className='h-4 w-4' />
                            Start Watching
                        </Button>
                    </Card>

            )) : <h1 className='font-bold text-xl'>No Courses Bought Yet</h1>
        }
    </div>
    </div>
    </>
  )
}

export default StudentCoursesPage