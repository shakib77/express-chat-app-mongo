const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = (io, socket) => {
    const authenticateSocket = async (token) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.userId });
            if (!user) throw new Error('User not found');
            return user;
        } catch (error) {
            throw new Error('Authentication failed');
        }
    };

    socket.on('authenticate', async (token) => {
        try {
            const user = await authenticateSocket(token);
            socket.user = user;
            socket.emit('authenticated');
        } catch (error) {
            socket.emit('unauthorized', { message: 'Authentication failed' });
        }
    });

    socket.on('join room', (room) => {
        if (!socket.user) {
            return socket.emit('error', { message: 'Authentication required' });
        }
        socket.join(room);
        socket.emit('joined', room);
    });

    socket.on('leave room', (room) => {
        socket.leave(room);
        socket.emit('left', room);
    });

    socket.on('chat message', async (data) => {
        if (!socket.user) {
            return socket.emit('error', { message: 'Authentication required' });
        }

        try {
            const message = new Message({
                sender: socket.user._id,
                content: data.message,
                room: data.room
            });
            await message.save();

            io.to(data.room).emit('chat message', {
                sender: socket.user.username,
                message: data.message,
                timestamp: message.timestamp
            });
        } catch (error) {
            socket.emit('error', { message: 'Error saving message' });
        }
    });

    socket.on('file shared', async (fileData) => {
        if (!socket.user) {
            return socket.emit('error', { message: 'Authentication required' });
        }

        try {
            const file = await File.findById(fileData.fileId).populate('uploader', 'username');
            io.to(fileData.room).emit('file shared', {
                sender: file.uploader.username,
                filename: file.originalName,
                fileId: file._id,
                timestamp: file.uploadDate
            });
        } catch (error) {
            socket.emit('error', { message: 'Error sharing file' });
        }
    });
};