import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal, Tabs } from 'antd'
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'
import { AuthContext } from '../context/auth-context'
import { StudentContext } from '../context/student-context'
import VideoPlayer from '../components/video-player'
import Confetti from "react-confetti"

const CourseProgressPage = () => {

    const navigate = useNavigate()
    const {id} = useParams()

    const {auth} = useContext(AuthContext)
    const[lockCourse , setLockCourse] = useState(false)

    const {studentCourseProgress , setStudentCourseProgress} =useContext(StudentContext)

    const [currentLecture , setCurrentLecture] = useState(null)
    const [showLectureComplete , setShowLectureCompleted] = useState(false)
    const [isSideBarOpen , setIsSideBarOpen] = useState(true)
    const [showConfetti , setShowConfetti] = useState(false)

    const updateCourseProgress = async()=>{
        if(currentLecture){
            const response = await axiosInstance.post("student/course-progress/mark-lecture-viewed" ,{
                userId: auth?.user?._id, 
                courseId: studentCourseProgress?.CourseDetails?._id, 
                lectureId: currentLecture?._id
            })
            if(response?.data?.success){
                studentProgress()
            }
        }

    }
    useEffect(()=>{ 
        if(currentLecture?.progressValue === 1) updateCourseProgress()
        },[currentLecture])

        const studentProgress = async () => {
            try {
                const response = await axiosInstance.get(`/student/course-progress/get/${auth?.user?._id}/${id}`);
                const data = response?.data?.data;
                if (response?.data?.success && data) {
            
                    if (!data?.isPurchased) {
                        setLockCourse(true);
                    } else {
                        setStudentCourseProgress({
                            CourseDetails: data.courseDetails,
                            progress: data.progress,
                        });
        
                        if (data.completed) {
                            setCurrentLecture(data.courseDetails?.curriculum[0]);
                            setShowLectureCompleted(true);
                            setShowConfetti(true);
                            return;
                        }
        
                         else if (data.progress.length === 0) {
                            setCurrentLecture(data.courseDetails?.curriculum[0]);
                        } else {
                        
                            const lastIndexOfViewedAsTrue = data.progress.reduceRight(
                                (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
                                -1
                            );
                            setCurrentLecture(data.courseDetails.curriculum[lastIndexOfViewedAsTrue + 1]);
                           
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching course progress:", err);
            }
        };
        

    useEffect(()=>{
        studentProgress()
    },[id])

    useEffect(()=>{
      if(showConfetti)  setTimeout(() => {
            showConfetti(false)
      }, 3000);
    },[showConfetti])

    const handleResetProgress = async () => {
        try{
            const response  = await axiosInstance.post("/student/course-progress/reset-progress" , {
                userId: auth?.user?._id, 
                courseId: studentCourseProgress?.CourseDetails?._id, 
            } )
            if(response?.data?.success){
                setCurrentLecture(null)
                setShowConfetti(false)
                setShowLectureCompleted(false)
                studentProgress()
            }
        }catch(err){
            console.log(err)
        }
    }

  return (
    <>
    <div className='flex flex-col h-screen bg-[#1c1d1f] text-white'>
        {
            showConfetti && <Confetti className='w-full' />
        }
        <div className='flex items-center justify-between p-4  bg-[#1c1d1f] border-b border-gray-700 '>
            <div className='flex items-center space-x-4'>
                <Button className='font-bold' onClick={()=>navigate("/my-courses-page")}>
                    <ChevronLeft className='h-4 w-4 ' />
                    Back To My Courses
                </Button>
                <h1 className='text-lg font-bold hidden md:block'>
                    {studentCourseProgress?.CourseDetails?.title}
                </h1>
            </div>
            <Button onClick={()=>setIsSideBarOpen(!isSideBarOpen)}>
                {
                    isSideBarOpen ? <ChevronRight className='h-5 w-5' /> : <ChevronLeft  className='h-5 w-5'/>
                }
            </Button>
        </div>
            <div className='flex flex-col  overflow-hidden'>
                <div className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : "mr-0"} transition-all duration-300`}>
                    <VideoPlayer 
                        height="900px"
                        width='100%'
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                </div>
                <div className="p-6 ">
                <h2 className='text-2xl font-bold mb-2'>
                   {currentLecture?.title}
                </h2>
                </div>
            </div>

<div
  className={`fixed top-[68px] right-0 bottom-0 w-[400px] border-left border-gray-700 bg-[#1c1d1f] transition-transform duration-300 ${
    isSideBarOpen ? 'translate-x-0' : 'translate-x-full'
  }`}
>
  <Tabs defaultActiveKey="1" className='bg-white text-black min-h-screen font-bold' >
    <Tabs.TabPane tab="Course Content" key="1" >
      <div className="p-4  text-white">
        {studentCourseProgress?.CourseDetails?.curriculum?.map((item, index) => (
          <div key={index} className="mb-2 text-black flex items-center space-x-2 text-sm font-bold cursor-pointer">
            {
                studentCourseProgress?.progress?.find(progressItem => progressItem.lectureId === item._id)?.viewed ?
                <Check className='h-4 w-4 text-green-400'/> :
                <Play className='h-4 w-4'/>
            }
            <h3 className="font-semibold">{item.title}</h3>
          </div>
        ))}
      </div>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Overview" key="2">
      <div className="p-4 text-black">
        <h2 className='text-xl font-bold mb-4'>About this Course</h2>
        <p className="mt-2 text-gray-400">{studentCourseProgress?.CourseDetails?.description}</p>
      </div>
    </Tabs.TabPane>
  </Tabs>
</div>  

        <Modal open={lockCourse} footer={false}>
            <div className='font-semibold flex flex-col space-y-5 items-center justify-center p-9 m-5'>
                <h1 className='font-bold text-xl'> You Can't view this page</h1>
                <p className='font-semibold text-gray-500 text-md'> Please Purchase this Course to get access </p>
            </div>
        </Modal>

        <Modal open={showLectureComplete} footer={false}>
            <div className='font-semibold flex flex-col space-y-5 items-center justify-center p-9 m-5 '>
                <h1 className='font-bold text-xl'> Congrats!! You Have Completed the Course</h1>
                <div className='flex gap-5'> 
                    <Button
                     className='bg-black text-white rounded-md font-semibold'
                     type='primary'
                     onClick={()=>navigate("/my-courses-page")}
                     >
                        My Courses</Button>
                    <Button className='bg-red-500 text-white font-semibold' type='primary' onClick={()=>handleResetProgress()}>Rewatch Course</Button>
                </div>
            </div>
        </Modal>
    
    </div>
    </>
  )
}

export default CourseProgressPage