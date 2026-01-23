import multer from 'multer';

const storage = multer.memoryStorage();

const allowedMimetype = [
  //Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',

  //Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',

  //audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',

  //Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (req, file, cb) => {
  if (allowedMimetype.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only images, video, audio, and documents are allowedS',
      ),
      false,
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 10,
  },
  fileFilter,
});
