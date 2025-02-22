import { Message } from "../models/messages.model.js";
import {mkdirSync, renameSync} from "fs"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { timeStamp } from "console";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getMessages = asyncHandler(async(req, res, next) => {
    console.log("User ID from JWT: ", req.userId);
    console.log("Query ID from Frontend: ", req.query.id);  // ✅ Log received chat ID

    const user1 = req.userId;
    const user2 = req.query.id;

    if (!user1 || !user2) {
        console.error("Missing user IDs:", { user1, user2 });
        throw new ApiError(400, "Both User IDs are Required");
    }

    const messages = await Message.find({
        $or: [
            { sender: user1, recipient: user2 },
            { sender: user2, recipient: user1 },
        ]
    }).sort({ createdAt: 1 });

    console.log("Messages fetched: ", messages.length);  // ✅ Log fetched messages count

    return res.status(200).json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});

const uploadFile = async (req, res) => {
    try {
        console.log("📥 Received file upload request");
        console.log("📝 File details:", req.file);

        if (!req.file) {
            console.log("❌ No file uploaded!");
            return res.status(400).json({ message: "No file uploaded!" });
        }

        // Upload to Cloudinary
        console.log("🚀 Uploading file to Cloudinary...");
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        if (!cloudinaryResponse) {
            console.log("❌ Cloudinary upload failed!");
            return res.status(500).json({ message: "Cloudinary upload failed!" });
        }

        console.log("✅ File uploaded successfully:", cloudinaryResponse.secure_url);

        return res.status(200).json({
            message: "File uploaded successfully!",
            url: cloudinaryResponse.secure_url,
        });

    } catch (error) {
        console.error("❌ Error in file upload:", error);

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            stack: error.stack, // Log full stack trace for debugging
        });
    }
};


export {getMessages, uploadFile}