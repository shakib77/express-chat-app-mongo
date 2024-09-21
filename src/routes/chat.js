const express = require('express');
const Message = require('../models/Message');
const File = require('../models/File');
const auth = require('../middleware/auth');
const { saveFile, getFileStream } = require('../utils/fileHandler');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_DIR || 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});


router.get('/history/:room', auth, async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.room })
            .sort({ timestamp: -1 })
            .limit(50)
            .populate('sender', 'username');
        res.json(messages);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching chat history' });
    }
});

router.post('/upload/:room', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ error: 'No file uploaded' });
        }
        const newFile = new File({
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploader: req.user._id,
            room: req.params.room
        });
        await newFile.save();
        res.status(201).json(newFile);
    } catch (error) {
        res.status(500).send({ error: 'Error uploading file' });
    }
});

router.get('/file/:filename', auth, async (req, res) => {
    try {
        const file = await File.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).send({ error: 'File not found' });
        }
        const fileStream = getFileStream(file.filename);
        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        fileStream.pipe(res);
    } catch (error) {
        res.status(500).send({ error: 'Error downloading file' });
    }
});

module.exports = router;