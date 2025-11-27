import multer from "multer";

// Configure memory storage
const storage = multer.memoryStorage();

// Set up Multer to handle multiple files
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Optional: Limit file size to 10MB
}).array("files", 20); // Accept up to 30 files with the key "files"

export default upload;
