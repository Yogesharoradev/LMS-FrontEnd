import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ size = '450px', width = '450px', url , onProgressUpdate , progressData }) => {
  const [played, setPlayed] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  const handleProgress = (state) => {
    setPlayed(state.played); 
  };

  const handleVideoEnd = () => {
    setIsVideoCompleted(true); 
  };

  useEffect(()=>{
    if(isVideoCompleted && played === 1){
      onProgressUpdate({
        ...progressData , 
        progressValue : played
      })
    }
  },[played , isVideoCompleted])

  return (
    <div>
      <ReactPlayer
        width={width}
        height={size}
        url={url}
        controls
        onProgress={handleProgress} 
        onEnded={handleVideoEnd} 
      />
    </div>
  );
};

export default VideoPlayer;
