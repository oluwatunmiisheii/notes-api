const multer = require('multer');

function fileFilter (req, file, cb) {
  switch(req.path) {
    case '/me/avatar':
      const filetypes = /jpeg|jpg|png|gif/;
      if (filetypes.test(file.mimetype.split('/')[1])) {
        cb(null, true)
      }
      else {
        cb(new Error('Invalid file type'), false);
      }
      break;
    case '/me/upload-cover':
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb({ message: "Unsupported file format" }, false);
      }
      else {
        cb({ message: "Unsupported file format" }, false);
      }
      break;
    default:
      cb(null, false)
      break;
  }
}

const upload = multer({
  fileFilter,
  limits: {
    fileSize: 1000000
  }
})

module.exports = upload;