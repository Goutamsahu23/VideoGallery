// UploadVideo.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import { toast } from 'react-toastify';

const UploadVideo = () => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setVideoFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'video/*',
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles[0]);
    },
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    
  };

  const handleFileChange = (file) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('videoFile', videoFile);
  
      const response = await axios.post(`${process.env.BASE_URL}/uploadVideo`, formData);
  
      const newVideoId = response.data.data._id;
  
      toast.success('Video uploaded successfully');
      setTitle('');
      setVideoFile(null);
      navigate(`/addSubtitle/${newVideoId}`);
    } catch (error) {
      console.error('Error uploading video:', error);
  
      if (error.response) {

        const { success, message } = error.response.data;
        toast.error(message);
      } else if (error.request) {

        toast.error('No response received from the server');
      } else {
        toast.error('An error occurred while uploading the video');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4 text-green-500 italic">Upload your Video</h2>
      <form className='border border-green-300 rounded p-4 flex flex-col justify-center shadow-lg'>
        <label className="block mb-2 text-green-500">Title:</label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="border border-gray-300 p-2 rounded mb-4"
        />

        <div {...getRootProps()} style={dropzoneStyles} className="mb-4">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-600">Drop the video file here...</p>
          ) : (
            <div className="text-gray-600">
              Drag 'n' drop a video file here, or click to select one
            </div>
          )}
          {videoFile && <p className="text-green-500">Selected File: {videoFile.name}</p>}

          {videoPreview && (
          <div className=" mb-4 flex justify-center">
            <video
              src={videoPreview}
              controls
              className="w-fit"
              style={{ borderRadius: '4px' }}
            />
          </div>
        )}
        </div>

        

        <button
          type="button"
          onClick={handleUpload}
          disabled={!title || !videoFile}
          className={`${loading ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded disabled:opacity-50`}
        >
          {loading ? 'Uploading please wait ....' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed rgb(134 239 172 / var(--tw-border-opacity))',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default UploadVideo;
