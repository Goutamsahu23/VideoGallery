const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  subtitles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtitle',
    },
  ],
  createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
