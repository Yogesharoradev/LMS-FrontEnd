import { createContext, useState } from "react";



export const StudentContext = createContext(null)


export default function StudentProvider ({children}) {

    const [studentViewCourseData , setStudentViewCourseData] = useState([])
    const [studentCourseDetails , setStudentCourseDetails] = useState(null)
    const [currentCourseDetailsId , setCurrentCourseDetailsId] = useState(null)
    const [studentBoughtCoursesList , setStudentBoughtCoursesList] = useState([])
    const [studentCourseProgress , setStudentCourseProgress] = useState({})


    return (
        <StudentContext.Provider  value={{studentViewCourseData , setStudentViewCourseData ,
            studentCourseDetails , setStudentCourseDetails,
            currentCourseDetailsId , setCurrentCourseDetailsId,
            studentBoughtCoursesList , setStudentBoughtCoursesList,
            studentCourseProgress , setStudentCourseProgress
        }}>
        {children}
    </StudentContext.Provider>
    ) 
}