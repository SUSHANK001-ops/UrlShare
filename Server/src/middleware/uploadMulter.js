const multer = require('multer');
// 2. create memory storage
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});
// 3. export configured multer that accepts any single file regardless of field name
module.exports = upload.any();