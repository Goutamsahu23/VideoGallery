const Video = require('../models/Video');
const cloudinary = require("cloudinary").v2;
require('dotenv').config();


function isFileTypeSupported(supportTypes, fileType) {
    return supportTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder) {
    const options = { folder }
    options.resource_type = "auto";
    try {
        const response = await cloudinary.uploader.upload(file.tempFilePath, options);
        return response;
    } catch (error) {
        throw error;
    }
}

exports.uploadVideo = async (req, res) => {
    try {
        const { title } = req.body;
        const file = req.files.videoFile;

        console.log(title);
        console.log(file);

        // validation
        const supportTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1];
        console.log(fileType);

        // if file format not supported
        // if file format not supported
        if (!isFileTypeSupported(supportTypes, fileType)) {
            return res.status(400).json({
                success: false,
                message: "file format not supported",
            });
        }




        // if support
        const response = await uploadFileToCloudinary(file, process.env.FOLDER_NAME);
        console.log('support file typr cross')
        // console.log(response);

        const fileData = await Video.create({
            title,
            videoUrl: response.secure_url,
        })
        console.log(fileData);

        return res.status(200).json({
            success: true,
            message: "video store successfully",
            videoUrl: response.secure_url,
            data: fileData,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}


exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json({
            success: true,
            message: 'Videos retrieved successfully',
            videos,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};


exports.getVideo = async (req, res) => {
    try {

        const { videoId } = req.params;
        const video = await Video.findById(videoId).populate('subtitles');
        res.status(200).json({
            success: true,
            message: 'Videos retrieved successfully',
            video,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }


}