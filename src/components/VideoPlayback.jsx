// VideoPlayback.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';

const VideoPlayback = () => {
  const { videoId } = useParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitlesUrl, setSubtitlesUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoResponse = await axios.get(`https://vdogallaery-api.onrender.com/api/v1/videos/${videoId}`);
        setVideoUrl(videoResponse.data.video.videoUrl);
        console.log(videoResponse.data.video.videoUrl)
        console.log(videoResponse.data.video.subtitles[0].vttFileUrl);
        setSubtitlesUrl(videoResponse.data.video.subtitles[0].vttFileUrl)



      } catch (error) {
        console.error('Error fetching video data:', error.message);
      }
    };

    fetchData();
  }, [videoId]);

  return (
    <div>
      <ReactPlayer
        url={videoUrl}
        controls
        width="full"
        height="450px"
        config={{
          file: {
            tracks: subtitlesUrl
              ? [
                {
                  kind: 'subtitles',
                  src: subtitlesUrl,
                  srcLang: 'en',
                  default: true,
                },
              ]
              : [],
          },
        }}
      />

    </div>
  );
};

export default VideoPlayback;
