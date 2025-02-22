import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Ensure absolute path
        const absolutePath = path.resolve(localFilePath);

        console.log("Uploading file to Cloudinary:", absolutePath);

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(absolutePath, {
            resource_type: "auto",
        });

        console.log("✅ File uploaded to Cloudinary:", response.secure_url);

        // Delete local file after successful upload
        fs.unlinkSync(absolutePath);

        return response;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);

        // Remove the local file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
