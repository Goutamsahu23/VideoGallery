const Video = require('../models/Video');
const Subtitle = require('../models/Subtitle');
const cloudinary = require("cloudinary").v2;
require('dotenv').config();


const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);



async function uploadContentToCloudinary(content, folder, options = {}) {
  const defaultOptions = {
    folder,
    resource_type: 'raw',
    allowed_origins: ['*'],
  };

  try {
    // Create the 'temp' folder if it doesn't exist
    const tempFolderPath = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath);
    }

    // Use a random filename for the temporary file
    const tempFileName = `${Date.now()}_temp.vtt`;
    const tempFilePath = path.join(tempFolderPath, tempFileName);

    // Save the content to the temporary file
    await writeFileAsync(tempFilePath, content, 'utf8');

    // Upload the temporary file to Cloudinary
    const response = await cloudinary.uploader.upload(tempFilePath, {
      ...defaultOptions,
      ...options,
    });

    // Remove the temporary file
    fs.unlinkSync(tempFilePath);

    return response;
  } catch (error) {
    throw error;
  }
}



exports.addSubtitle = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text, timestamp, duration } = req.body;


    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (!text || ! timestamp || !duration) {
      return res.status(404).json({ message: 'Fill all the fields' });
    }

    

    // Create a new subtitle
    const newSubtitle = new Subtitle({
      text,
      timestamp,
      duration,
      video: video._id,
    });

    const savedSubtitle = await newSubtitle.save();

    video.subtitles.push(savedSubtitle);


    await video.save();

    const webVTTContent = formatWebVTT(video.subtitles);

    const response = await uploadContentToCloudinary(webVTTContent, process.env.CLOUDINARY_FOLDER, {
      public_id: `subtitles/${videoId}`,
    });


    savedSubtitle.vttFileUrl = response.secure_url;
    await savedSubtitle.save();

    res.status(201).json({ message: 'Subtitle added successfully', cloudinaryUrl: response.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Function to format subtitles as WebVTT
function formatWebVTT(subtitles) {
  let webVTTContent = 'WEBVTT\n\n';

  subtitles.forEach((subtitle, index) => {
    const startTimestamp = formatTimestamp(subtitle.timestamp);
    const endTimestamp = formatTimestamp(subtitle.timestamp + subtitle.duration);

    webVTTContent += `${index + 1}\n${startTimestamp} --> ${endTimestamp}\n${subtitle.text}\n\n`;
  });

  return webVTTContent;
}

// Function to format timestamp (assuming timestamp is in seconds)
function formatTimestamp(timestamp) {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor(timestamp % 60);
  const milliseconds = Math.round((timestamp % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}



exports.getSubtitles = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Find the video in the database and populate the subtitles
    const video = await Video.findById(videoId).populate('subtitles');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json(video.subtitles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



