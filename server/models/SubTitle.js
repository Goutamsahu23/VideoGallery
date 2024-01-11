const mongoose = require('mongoose');

const subtitleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  vttFileUrl: {
    type: String,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  },
});

const Subtitle = mongoose.model('Subtitle', subtitleSchema);

module.exports = Subtitle;
