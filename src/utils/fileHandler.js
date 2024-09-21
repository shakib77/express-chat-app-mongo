const fs = require('fs');
const path = require('path');

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const getFileStream = (filename) => {
    const filePath = path.join(uploadDir, filename);
    return fs.createReadStream(filePath);
};

module.exports = { getFileStream };