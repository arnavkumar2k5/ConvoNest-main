import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createChannel, getChannelMessages, getUserChannel } from "../controllers/channel.controllers.js";


const router = Router();

router.route("/create-channel").post(verifyJWT, createChannel);
router.route("/get-user-channels").get( verifyJWT, getUserChannel);
router.route("/get-channel-messages/:channelId").get( verifyJWT, getChannelMessages);

export default router;