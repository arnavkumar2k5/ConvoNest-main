import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, uploadFile } from "../controllers/messages.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();

router.route("/get-messages").get(verifyJWT, getMessages);
router.route("/upload-file").post(verifyJWT, upload.single("file"), uploadFile);

export default router;