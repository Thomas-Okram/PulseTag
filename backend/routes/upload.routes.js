import express from "express";
import fileUpload from "express-fileupload";
import { uploadProfilePicture } from "../controllers/upload.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Enable file upload middleware
router.use(fileUpload({ useTempFiles: true }));

router.post("/profile-picture", verifyToken, uploadProfilePicture);

export default router;
