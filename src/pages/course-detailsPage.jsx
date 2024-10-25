import React, { useContext, useEffect, useState } from 'react'
import Header from '../components/studentsView/header'
import { StudentContext } from '../context/student-context'
import { useParams } from 'react-router-dom'
import axiosInstance from '../lib/axiosInstance'
import { Button, Card, Modal, Skeleton } from 'antd'
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react'
import { AuthContext } from '../context/auth-context'
import ReactPlayer from 'react-player'

const CourseDetailsPage = () => {

    const { studentCourseDetails , setStudentCourseDetails,
        currentCourseDetailsId , setCurrentCourseDetailsId} = useContext(StudentContext)

        const {auth} = useContext(AuthContext)

        const [showModal , setShowModal] = useState(false)
        const [disabled , setDisabled] = useState(false)

 
        const [loadingState , setLoadingState] = useState(true)
        const[approvalUrl , setApprovalUrl] = useState("")

        const {id} = useParams()

        const fetchCourseDetails =async (id)=>{
            try{
                const response = await axiosInstance.get(`/student/get/course/${id}/${auth?.user?._id}`)
                if(response?.data?.success){
                    setStudentCourseDetails(response?.data?.response)
                    setLoadingState(false)
                }else{
                    setStudentCourseDetails(null)
                    setLoadingState(false)
                }
            }catch(err){
                console.log(err)
            }
        }

        useEffect(()=>{
            if(location.pathname.includes("course/details")){
                setStudentCourseDetails(null) 
                setCurrentCourseDetailsId(null)
            }
        },[])

        useEffect(()=>{
            if(id)  setCurrentCourseDetailsId(id)
        },[id])

        useEffect(()=>{
            if(currentCourseDetailsId !== null) fetchCourseDetails(currentCourseDetailsId)
        },[currentCourseDetailsId])


          

        const handleCreatePayment =  async () => {
            setDisabled(true)

            const paymentPayload = {
                userId : auth?.user?._id , 
                userName : auth?.user?.name , 
                userEmail : auth?.user?.email,
                orderStatus : "pending" , 
                paymentMethod :"paypal",
                paymentStatus : "initiated" , 
                orderDate : new Date() ,
                paymentId : "",
                payerId : "" ,
                instuctorId : studentCourseDetails?.instructorId,
                instructorName : studentCourseDetails?.instructorName, 
                courseImage : studentCourseDetails?.image,  
                courseTitle : studentCourseDetails?.title , 
                courseId : studentCourseDetails?._id ,
                coursePricing : studentCourseDetails?.pricing, 
            }
            
         const response = await axiosInstance.post("/order/create" , paymentPayload )
        if(response?.data?.success){
            sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.data?.orderId))
            setApprovalUrl(response?.data?.data.aprroveUrl)
        }
        }
        const getIndexOfFreePreviewUrl = studentCourseDetails !== null ?
        studentCourseDetails?.curriculum?.findIndex(item => item.freePreview) 
        : -1

        if(loadingState) return <Skeleton />

        if(approvalUrl !== ""){
            window.location.href = approvalUrl
        }
       
  return (
    <>
        <Header />
        <div className='container mx-auto p-4'>
            <div className='bg-gray-900 text-white p-8 rounded-t-lg'>
                <h1 className='text-3xl font-bold mb-4'>
                    {studentCourseDetails?.title.toUpperCase()}
                </h1>
                <p className='text-xl mb-4'>{studentCourseDetails?.subtitle}</p>
                <div className='flex items-center space-x-4 mt-2 text-sm'>
                        <span>Created By - {studentCourseDetails?.instructorName.toUpperCase()}</span>
                        <span>created on : {studentCourseDetails?.date.split("T")[0]}</span>
                        <span className='flex items-center'>
                            <Globe className='mr-1 h-4 w-4' />
                            {studentCourseDetails?.primaryLanguage}
                        </span>
                        <span>{studentCourseDetails?.Students?.length}{" "} {studentCourseDetails?.Students?.length <= 1 ? "Students" : "Student"}</span>
                </div>
            </div>
            <div className='flex flex-col md:flex-row gap-8 mt-8'>
                    <main className='flex-grow'>
                        <Card className='mb-8' title="What you'll learn">
                            <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                {
                                    studentCourseDetails?.objectives.split(",").map((objective ,idx)=>(
                                        <li key={idx} className='flex items-start'>
                                            <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink' />
                                            <span>{objective}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </Card>
                        <Card className='mb-8' title="Course Description">
                            <p>{studentCourseDetails?.description}</p>
                        </Card>
                        <Card className='mb-8' title="Course Curriculum">
                            <div>
                                {
                                    studentCourseDetails?.curriculum?.map((item ,idx)=>(
                                        <li key={idx} className={`${ item?.freePreview ? "cursor-pointer" : "cursor-not-allowed"
                                        } flex items-center mb-4`}>
                                            {
                                                item?.freePreview ? <PlayCircle onClick={()=>setShowModal(true)} className='mr-2 h-4 w-4'/> : <Lock className='mr-2 h-4 w-4' />
                                            }
                                            <span>{item?.title}</span>
                                        </li>
                                    ))
                                }
                            </div>
                        </Card>
                        <Modal open={showModal}  onCancel={()=>setShowModal(false)} footer={false} title="Course Preview">  
                            <div className='p-4'>
                            <ReactPlayer url={getIndexOfFreePreviewUrl !== -1 ?
                                    studentCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.videoUrl : ""

                                }
                                height="200px"
                                width='450px'
                                controls
                                 />
                                <h1 className='mt-2 font-semibold text-xl'>Free Preview Available By Creator</h1>
                               
                                {
                                    studentCourseDetails?.curriculum?.filter(item => item.freePreview).map(filterItems =>
                                   <p  className='cursor-pointer text-[16px] mt-3 font-medium '>{filterItems.title}</p>)
                                    }
                           
                            </div>
                        </Modal>
                    </main>
                    <aside className='w-full md:w-[500px]'>
                            <Card className='sticky top-4'>
                                <div className='p-6'>
                                <div className='aspect-video mb-4 rounded-lg flex items-center justify-center'>
                                <ReactPlayer url={getIndexOfFreePreviewUrl !== -1 ?
                                    studentCourseDetails?.curriculum[getIndexOfFreePreviewUrl]?.videoUrl : ""

                                }
                                height="200px"
                                width='450px'
                                controls
                                 />
                                </div>
                                <div className='mb-4'>
                                    <span className='text-3xl font-bold'>
                                        $ {studentCourseDetails?.pricing}
                                    </span>
                                </div>
                                <Button onClick={()=>handleCreatePayment()} disabled={disabled} className='w-full bg-black text-white font-semibold p-1 rounded-lg'>Buy Now</Button>
                                </div>
                            </Card>
                    </aside>
            </div>
        </div>
    </>
  )
}

export default CourseDetailsPage