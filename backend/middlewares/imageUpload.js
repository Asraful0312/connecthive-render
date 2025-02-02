import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const handleFileUpload = upload.single("profilePic");
