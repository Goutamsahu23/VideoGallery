import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AllVideos from './components/AllVideos';
import VideoUpload from './components/VideoUpload';
import SubtitleAddition from './components/SubtitleAddition';
import VideoPlayback from './components/VideoPlayback';

function App() {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<AllVideos />}/>
        <Route path='/uploadVideo' element={<VideoUpload />}/>
        <Route path='/addSubtitle/:videoId' element={<SubtitleAddition />}/>
        <Route path="/video-playback/:videoId" element={<VideoPlayback />} />
      </Routes>
    </div>
  );
}

export default App;
