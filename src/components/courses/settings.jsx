import { Button, Card, Form, Input } from 'antd'
import React, { useContext, useEffect, useRef } from 'react'
import { CourseContext } from '../../context/course-context'
import axiosInstance from '../../lib/axiosInstance'
import MediaProgressTracking from '../media-progress-tracking'

const Settings = () => {

    const {courseLandingData , setCourseLandingData , mediaUploadProgress , setMediaUploadProgress ,
        mediaUploadPercentage , setMediaUploadPercentage

    } = useContext(CourseContext)

    const inputRef = useRef(null)

    const triggerInputRef = ()=>{
        inputRef.current.click()
    }


    const handleImageUpload =async (e)=>{
        const selectedImage = e.target.files[0]

        if(selectedImage){
            const imageFormData = new FormData()
            imageFormData.append("file", selectedImage)

            try{
                setMediaUploadProgress(true)
                const response = await axiosInstance.post("/media/upload" , imageFormData , {
                    onUploadProgress : ((event)=>{
                        const percentCompleted = Math.round((event.loaded * 100)/ event.total)
                        setMediaUploadPercentage(percentCompleted)
                    })
                
            })
                if(response.data.success){
                   setCourseLandingData( {
                    ...courseLandingData ,
                    image : response?.data?.data?.url
                })
                }
                setMediaUploadProgress(false)     
            }catch(err){
                console.log(err)
            }
        }
    }

    useEffect(() => {
    }, [courseLandingData])

  return (
    <Card
    title="Course Settings"
    >
        <div className='p-4'>
            {
             mediaUploadProgress ?
             <MediaProgressTracking
             isMediaUploading={mediaUploadProgress}
             progress={mediaUploadPercentage}
             /> : null
            }
        </div>
        {
            courseLandingData?.image ? 
            <>
            <img src={courseLandingData.image} width="400px" height="100px"  />
                <Button className='mt-3 bg-black text-white font-semibold' onClick={triggerInputRef}>Change Image</Button>
            </>
            :
            <div>
            <Form>
                <Form.Item>Upload Course Image</Form.Item>
                <Input type='file' accept='image/*' onChange={handleImageUpload} />
            </Form>
        </div>

        }
       
       <input
                type="file"
                accept="image/*"
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />
    </Card>
  )
}

export default Settings