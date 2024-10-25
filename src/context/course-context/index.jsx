import { createContext, useState } from "react";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "../../config";



export const CourseContext = createContext(null)

export default function CourseProvider({children}){

    const [courseCurriculumData , setCourseCurriculumData] = useState(courseCurriculumInitialFormData)
    const [mediaUploadProgress , setMediaUploadProgress] = useState(false)
    const [courseLandingData , setCourseLandingData ] = useState(courseLandingInitialFormData)
    const [mediaUploadPercentage , setMediaUploadPercentage] = useState(0)
    const [courseCurrentEditedIndex , setCourseCurrentEditedIndex] = useState(null)



    return (
        <CourseContext.Provider value={{
            courseCurriculumData , 
             setCourseCurriculumData , 
             mediaUploadProgress ,
             setMediaUploadProgress,
             courseLandingData ,
              setCourseLandingData ,
              mediaUploadPercentage ,
               setMediaUploadPercentage,
               courseCurrentEditedIndex , setCourseCurrentEditedIndex
            }
            }>
            {children} 
        </CourseContext.Provider>
    )
}