const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', FileSchema);