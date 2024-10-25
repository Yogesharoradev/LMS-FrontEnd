import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion"

const MediaProgressTracking = ({isMediaUploading , progress}) => {

    const [showProgress , setShowProgress] = useState(false)
    const [animatedProgress , setAnimatedProgress] = useState(0)

    useEffect(()=>{
        if(isMediaUploading){
            setShowProgress(true)
            setAnimatedProgress(progress)
        }else{
            const timer = setTimeout(() => {
                    showProgress(false)
            },1000 );

            return ()=>clearTimeout(timer)
        }

    },[isMediaUploading , progress])

    if(!showProgress) return null

  return (
    <div className='w-full rounded-full h-3 mb-5 mt-5 relative bg-gray-200 overflow-hidden'>
        <motion.div className='bg-blue-600 h-3 rounded-full'
        initial={{width : 0}}
        animate = {{
            width : `${animatedProgress}%`,
            transition : {duration:0.5 , ease : "easeInOut"}

        }}
        >  
        {
            progress >= 100 && isMediaUploading && 
            (
                <motion.div 
                    className='absolute top-0 left-0 right-0 bottom-0 bg-blue-400 opacity-50'
                    animate= {{
                        x :['0%' , "100%", '0%'],

                    }}
                    transition={{
                        duration : 2,
                        repeat :Infinity
                    }}
                />
            )
        }

            </motion.div>    
    
    </div>
  )
}

export default MediaProgressTracking