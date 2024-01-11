const express=require('express')
const router=express.Router();

const {uploadVideo,getAllVideos,getVideo}=require('../controller/uploadVideoController')
const {addSubtitle,getSubtitles,getSubtitleByIndex}=require('../controller/subtitleController');


router.post('/uploadVideo',uploadVideo);
router.post('/addSubtitle/:videoId',addSubtitle);
router.get('/Subtitle/:videoId',getSubtitles);

router.get('/videos', getAllVideos);
router.get('/videos/:videoId', getVideo);
// router.get('/Subtitle/:videoId/', getSubtitleByIndex);




module.exports = router;