import { Button, Card, Input, message, Switch, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef } from 'react';
import { CourseContext } from '../../context/course-context';
import { courseCurriculumInitialFormData } from '../../config';
import axiosInstance from '../../lib/axiosInstance';
import MediaProgressTracking from '../media-progress-tracking';
import VideoPlayer from '../video-player';
import { LucideMessageCircleQuestion, Upload } from 'lucide-react';

const Curriculum = () => {

    const {
        courseCurriculumData,
        setCourseCurriculumData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadPercentage,
        setMediaUploadPercentage,
    } = useContext(CourseContext);

    const bulkUplaodInputRef = useRef(null);

    const handleNewLecture = () => {
        setCourseCurriculumData([
            ...courseCurriculumData,
            {
                ...courseCurriculumInitialFormData[0],
            },
        ]);
    };

    const handleCourseTitleChange = (e, idx) => {
        const updatedCurriculumData = [...courseCurriculumData];
        updatedCurriculumData[idx] = { ...updatedCurriculumData[idx], title: e.target.value };
        setCourseCurriculumData(updatedCurriculumData);
    };

    const handleFreePreviewValue = (checked, idx) => {
        const updatedCurriculumData = [...courseCurriculumData];
        updatedCurriculumData[idx] = { ...updatedCurriculumData[idx], freePreview: checked };
        setCourseCurriculumData(updatedCurriculumData);
    };

    const handleVideoFile = async (e, idx) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append("file", selectedFile);

            try {
                setMediaUploadProgress(true);
                const result = await axiosInstance.post("/media/upload", videoFormData, {
                    onUploadProgress: (event) => {
                        const percentCompleted = Math.round((event.loaded * 100) / event.total);
                        setMediaUploadPercentage(percentCompleted);
                    },
                });

                if (result?.data?.success) {
                    const updatedCurriculumData = [...courseCurriculumData];
                    updatedCurriculumData[idx] = {
                        ...updatedCurriculumData[idx],
                        public_id: result?.data?.data?.public_id,
                        videoUrl: result?.data?.data?.url,
                    };
                    setCourseCurriculumData(updatedCurriculumData);
                } else {
                    message.error(result.data.message);
                }
            } catch (err) {
                message.error("Error during video upload. Please try again.");
                console.error(err);
            } finally {
                setMediaUploadProgress(false);
            }
        }
    };

    const handleReplaceVideo = async (idx) => {
        let cpyCourseCurriculumData = [...courseCurriculumData];
        const getCurentVideoPublicId = cpyCourseCurriculumData[idx].public_id;
        try {
            const result = await axiosInstance.delete(`/media/delete/${getCurentVideoPublicId}`);
            if (result?.data?.success) {
                cpyCourseCurriculumData[idx] = {
                    ...cpyCourseCurriculumData[idx],
                    public_id: "",
                    videoUrl: ""
                };
                message.success("Add another video");
                setCourseCurriculumData(cpyCourseCurriculumData);
            }
        } catch (err) {
            message.error("Error in replacing video");
            console.error(err);
        }
    };

    const handleDeleteVideo = async (idx)=>{
        let cpyCourseCurriculumData  = [...courseCurriculumData]
        const getCurrentVideoPublicId = cpyCourseCurriculumData[idx].public_id
        try{
            const response = await axiosInstance.delete(`/media/delete/${getCurrentVideoPublicId}`)
            if(response?.data?.success){
                cpyCourseCurriculumData = cpyCourseCurriculumData.filter((_ ,index) => index !== idx)
                setCourseCurriculumData(cpyCourseCurriculumData)
                message.success("Deleted")
            }
        }catch(err){
            console.log(err)
            message.error("error in deleting")
        }
      
    }

    const handleBulkUpload = () => {
        bulkUplaodInputRef.current?.click();
    };

    function areAllCourseCurriculumDataObjectsEntry(arr){
        return arr.every((obj)=>{
            return Object.entries(obj).every(([key , value])=>{
                if(typeof value === "boolean"){
                    return true
            }
            return value === ""
        }
    )})
    }

    const bulkUploadFunction = async (e) => {
        const selectedFiles = Array.from( e.target.files)
        const bulkData = new FormData()
        selectedFiles.forEach(item => bulkData.append("files" , item))

        try{    
            setMediaUploadProgress(true)
            const response = await axiosInstance.post( "/media/bulk/upload" ,bulkData ,{
                    onUploadProgress: (event) => {
                        const percentCompleted = Math.round((event.loaded * 100) / event.total);
                        setMediaUploadPercentage(percentCompleted);
                    },
            })


            if(response?.data?.success){
                let cpyCourseCurriculumData = areAllCourseCurriculumDataObjectsEntry(courseCurriculumData)
                ? [] : [...courseCurriculumData]

                cpyCourseCurriculumData = [
                    ...cpyCourseCurriculumData ,
                    ...response?.data?.data?.map((item , idx)=>({
                        videoUrl : item?.url,
                        public_id : item?.public_id,
                        freePreview : false,
                        title : `Lecture ${ cpyCourseCurriculumData.length + (idx + 1)}`
                    }))
                ]
                setCourseCurriculumData(cpyCourseCurriculumData)
                setMediaUploadProgress(false)
            }


        }catch(err){
            console.log(err)
            message.error("Error in bulking upload")
        }
    };

    const singleLectureUpload = () => {
        return courseCurriculumData.every((item) => item && typeof item === 'object' && item.title.trim() !== "" && item.videoUrl.trim() !== "");
    };

   

    return (
        <Card title="Create Course Curriculum">
            <div className='flex items-center justify-between'>
                <Button onClick={handleNewLecture} disabled={!singleLectureUpload() || mediaUploadProgress}>
                    Add Lecture
                </Button>
                <input
                    type='file'
                    accept='video/*'
                    multiple
                    className='hidden'
                    ref={bulkUplaodInputRef}
                    onChange={bulkUploadFunction}
                />
                <div className='flex gap-3 items-center'>
                <Button onClick={handleBulkUpload} className='text-white bg-red-600 font-semibold'>
                    <Upload className='w-4 h-4' />
                    Bulk Upload
                </Button>
                <Tooltip title="You Can upload multiple videos at a time">
                <LucideMessageCircleQuestion className='hover:cursor-pointer' />
                </Tooltip>
                </div>
              
               
            </div>
            {mediaUploadProgress && (
                <MediaProgressTracking isMediaUploading={mediaUploadProgress} progress={mediaUploadPercentage} />
            )}
            <div className='mt-4 space-y-4'>
                {courseCurriculumData.map((item, idx) => (
                    <div className='border p-5 rounded-md' key={idx}>
                        <div className='flex gap-5 items-center'>
                            <h3 className='font-semibold'>Lecture {idx + 1}</h3>
                            <Input
                                placeholder='Enter Lecture Title'
                                className='max-w-96'
                                onChange={(e) => handleCourseTitleChange(e, idx)}
                                value={courseCurriculumData[idx]?.title}
                            />
                            <div className='flex items-center space-x-2'>
                                <Switch
                                    checked={courseCurriculumData[idx]?.freePreview}
                                    id={`freePreview-${idx + 1}`}
                                    onChange={(value) => handleFreePreviewValue(value, idx)}
                                />
                                <label htmlFor={`freePreview-${idx + 1}`} className='font-semibold'>Free Preview</label>
                            </div>
                        </div>

                        <Card>
                            {courseCurriculumData[idx]?.videoUrl ? (
                                <div className='flex w-full h-min-screen gap-3'>
                                    <VideoPlayer url={courseCurriculumData[idx]?.videoUrl} />
                                    <div className='space-x-6 m-6'>
                                        <button className='bg-black text-white font-semibold p-2 rounded-md' onClick={() => handleReplaceVideo(idx)}>Replace Video</button>
                                        <button className='bg-red-900 text-white font-semibold p-2 rounded-md'  onClick={() => handleDeleteVideo(idx)}>Delete Lecture</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Input
                                        id={`videoInput-${idx}`}
                                        type="file"
                                        accept='video/*'
                                        className='mb-4'
                                        onChange={(e) => handleVideoFile(e, idx)}
                                        style={{ display: 'none' }}
                                    />
                                    <Input type="file" accept='video/*' className='mb-4' onChange={(e) => handleVideoFile(e, idx)} />
                                </>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Curriculum;
