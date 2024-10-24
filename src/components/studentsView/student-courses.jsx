import React, { useContext, useEffect, useState } from 'react'
import Header from './header'
import { Button, Card, Checkbox, Dropdown } from 'antd'
import { ArrowUpDownIcon } from 'lucide-react'
import { filterOptions } from '../../config'
import axiosInstance from '../../lib/axiosInstance'
import { StudentContext } from '../../context/student-context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'

const StudentCourses = () => {

      
  const {studentViewCourseData , setStudentViewCourseData} = useContext(StudentContext) 

  const navigate = useNavigate()

  const {auth} = useContext(AuthContext)

  const [sort , setSort] = useState("price-lowtohigh")
  const [filters , setFilters] = useState({})

  const [searchParams , setSearchParams] = useSearchParams()

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


  const createSearchParamsHelper =(filterParams)=>{

    const queryParams = []

    for(const [key,value] of Object.entries(filterParams)){
            if (Array.isArray(value) && value.length > 0){
                const paramsValue = value.join(",")
                queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`)
            }
    }
    return queryParams.join("&")

  }

  useEffect(()=>{
    const buildQueryStringForFilters = createSearchParamsHelper(filters)
    setSearchParams(new URLSearchParams(buildQueryStringForFilters))
  },[filters])


  const fetchCourseData = async (filters ,sort)=>{
    try{
        const query = new URLSearchParams({
            ...filters, 
            sortBy  : sort
        })
      const result = await axiosInstance.get(`/student/get?${query}`)

        setStudentViewCourseData(result?.data.result)

    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    if(filters !== null && sort !== null)
    fetchCourseData(filters , sort) 
},[filters ,sort ])


    const items =[
        { id: "price-lowtohigh" , label :"Price : Low To High" , onClick: () => setSort("price-lowtohigh"), },
        { id: "price-hightolow" , label :"Price : high To Low" , onClick: () => setSort("price-hightolow") },
        { id: "title-atoz" , label :"Title : A To Z" ,  onClick: () => setSort("title-atoz") },
        { id: "title-ztoa" , label :"Title : Z To A" ,  onClick: () => setSort("title-ztoa"), },
    ]

    const handleFilterOnCahnge = (getSectionId , getCurrentOption)=>{

        let cpyFilters = {...filters}

        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId)

        if(indexOfCurrentSection === -1){
            cpyFilters = {
                ...cpyFilters ,
                [getSectionId] : [getCurrentOption.id]
            }
        }else{
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id)  

            if(indexOfCurrentOption === -1){
                    cpyFilters[getSectionId].push(getCurrentOption.id)
            }else{
                cpyFilters[getSectionId].splice(indexOfCurrentOption , 1)
            }
        }
        setFilters(cpyFilters)
    }

  return (
    <>
    <Header />
    <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
        <div className='flex flex-col gap-4 md:flex-row'>
            <aside className='w-full md:w-64 space-y-4'>
                <div className= 'space-y-4'>
                    {
                        Object.keys(filterOptions).map((items , idx)=>(
                            <div key={idx} className=' space-y-4'>
                                <h3 className='font-bold mb-3'>{items.toUpperCase()}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {
                                        filterOptions[items].map(options => (
                                            <label key={options.id} className='flex font-medium items-center gap-3 '>
                                                <Checkbox
                                                 checked={
                                                    filters && Object.keys(filters).length > 0 
                                                    && filters[items] && filters[items].indexOf(options.id) > -1
                                                 } 
                                                onChange={()=>handleFilterOnCahnge(items , options)} 
                                                />
                                                <span>{options.label}</span>
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </aside>
            <main className='flex-1'>
                <div className='flex justify-end items-center mb-4 gap-5 '>
                    <Dropdown menu={{items}} >
                    <Button className='font-semibold text-[16px]'> 
                        <ArrowUpDownIcon  className='h-4 w-4'/>
                        Sort By
                    </Button>
                    </Dropdown>
                    <span className='text-sm text-black font-bold'> {studentViewCourseData?.length || 0} Results </span>
                </div>

                <div className='space-y-4'>
                        {
                            studentViewCourseData && studentViewCourseData.length > 0  ?
                            studentViewCourseData.map((items)=>(
                                <Card onClick={()=>handleNavigate(items?._id)}
                                 key={items?._id}
                                 className='hover:cursor-pointer hover:bg-gray-100'
                                 >
                                    <div className='flex gap-4 p-4'>
                                        <div className='w-48 h-32 flex-shrink-0'>
                                            <img src={items?.image} className='w-full h-full object-cover' />
                                        </div>
                                        <div className='flex-1'>
                                        <h1 className='text-xl mb-2'>{items?.title}</h1>
                                        <p className='text-sm text-gray-600 mb-1'>Created By {"  "}
                                            <span className='font-bold'>{items?.instructorName.toUpperCase()}</span>
                                        </p>
                                        <p className='text-[14px] text-gray-600 mb-2 mt-2'>
                                           {
                                            `${items?.curriculum?.length} Lectures - ${items?.level.toUpperCase()} Level`
                                           }
                                        </p>
                                        <p className='font-bold'>
                                            $ {items?.pricing}
                                        </p>
                                        </div>

                                    </div>
                                </Card> 
                            )) 
                           
                             : <h1 className='font-extrabold text-2xl p-3'>No Courses Found</h1>
                        }
                </div>
            </main>
        </div>
    </div>
    </>
  )
}

export default StudentCourses