import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads"); // Ensure absolute path to 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now();
        cb(null, uniquePrefix + '-' + file.originalname); // Generate unique filename
    }
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};


const upload = multer({ storage, fileFilter });


export default upload;
