// SubtitleAddition.js
import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubtitleAddition = () => {
  const navigate =useNavigate();
  const location = useLocation();
  const videoId = location.pathname.split('/').pop(); // Extracting videoId from the URL
  const [text, setText] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTimestampChange = (e) => {
    setTimestamp(e.target.value);
  };

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handleAddSubtitle = async () => {
    setLoading(true);
    try {
      const response=await axios.post(`https://vdogallaery-api.onrender.com/api/v1/addSubtitle/${videoId}`, {
        text,
        timestamp,
        duration
      });

      // Optionally, you can handle success and reset the form
      toast.success(response.data.message);
      
      
      setText('');
      setTimestamp('');
      navigate('/')
    } catch (error) {
      console.error('Error adding subtitle:', error.response.data.message);
      const {message}=error.response.data;
      toast.error(message)
    }
    setLoading(false);
  };

  return (
    <div className=" container mx-auto p-4">
    <h2 className="text-3xl font-semibold mb-4 text-green-500 italic text-center">Add Subtitle</h2>
    <form className="max-w-sm mx-auto border border-green-300 rounded p-4 flex flex-col justify-center ">
      <div className="mb-4">
        <label className="block text-green-500">Subtitle Text:</label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          className="border text-green-500 p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-green-500">Initital time of the video:</label>
        <input
          type="text"
          value={timestamp}
          onChange={handleTimestampChange}
          className="border text-green-500 p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-green-500">Duration of the video:</label>
        <input
          type="text"
          value={duration}
          onChange={handleDurationChange}
          className="border text-green-500 p-2 rounded w-full"
        />
      </div>

      <button
        type="button"
        onClick={handleAddSubtitle}
        className={`${loading ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2 rounded disabled:opacity-50`}
      >
        {loading ? 'Adding Subtitle!! please wait ....' : 'Add Subtitles'}
      </button>
    </form>
  </div>
  );
};

export default SubtitleAddition;
