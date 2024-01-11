// AllVideos.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RiVideoAddLine } from "react-icons/ri";

const AllVideos = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/videos`);
      console.log(response)
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4 text-green-500 italic">Video Gallery</h2>

      {/* Search input */}
      <div className='flex justify-between gap-5'>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" w-full mb-4 p-2 border text-green-500 rounded"
      />

      <Link to="/uploadVideo">
        <button className="flex items-center bg-green-500 text-white px-10 py-3 rounded hover:bg-green-600">
          <RiVideoAddLine />
        </button>
      </Link>

      </div>
      

      {filteredVideos.length > 0 ? (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredVideos.map((video) => (
            <li key={video._id} className="mb-8 transition-transform duration-300 transform hover:scale-105">
              <Link to={`/video-playback/${video._id}`}>
                <div className="relative overflow-hidden">
                <video
                    src={video.videoUrl}
                    alt={video.title}
                    className="w-full h-40 object-cover object-center"
                    autoPlay={false} 
                    muted
                    loop // Loop the video
                    playsInline // Ensure consistent behavior on iOS
                  />
                </div>
                <div className="mt-2">
                  <strong className="block text-xl leading-tight text-green-500">{video.title}</strong>
                  <span className="text-green-500">{formatDate(new Date(video.createdAt))}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xl text-green-500">No videos available.</p>
      )}
    </div>
  );
};



const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default AllVideos;
