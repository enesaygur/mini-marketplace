import multer from "multer";

const storage = multer.memoryStorage();

const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const hasValidMimetype = file.mimetype.startsWith("image/");
    const hasValidExtension = allowedExtensions.test(file.originalname);

    if (hasValidMimetype && hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export default upload;