import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { renameSync, unlinkSync } from "fs"
import fs from "fs";


const generateAcccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async(req, res) => {
    const {fullName, email, username, password} = req.body

    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All Fields are Required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    })

    // Generate tokens after user creation
    const {accessToken, refreshToken} = await generateAcccessAndRefreshTokens(user._id)

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something Went Wrong While Registring the User")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, 
                {
                    accessToken,
                    refreshToken
                }, 
                "User registered Successfully"
            )
        )
})

const loginUser = asyncHandler( async(req, res) => {
    const {identifier, password} = req.body

    if(!identifier){
        throw new ApiError(400, "User or Email is required")
    }

    const user = await User.findOne({
        $or: [{username: identifier}, {email: identifier}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid User Credentials")
    }

    const {accessToken, refreshToken} = await generateAcccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        path: "/"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Succesfully"))
})

const allUsers = asyncHandler(async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: {$ne: req.user._id}})
    res.send(users);
})

const updateUser = asyncHandler(async(req, res) => {
    const {fullName, username, color} = req.body;

    if(!(fullName || username)){
        throw new ApiError(400, "All Fields are Required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                username: username,
                color: color
            },
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details updated Successfully"))
})

const updateUserAvatar = async (request,response,next) =>{
    try {
      if(!request.file){
        return response.status(400).send("File is required");
      }
      const date = Date.now();
      let fileName = "public/temp/" + date + request.file.originalname;
      renameSync(request.file.path, fileName);

      const cleanPath = fileName.replace("public/", "");

      const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        {image: cleanPath},
        {new:true, runValidators:true}
      )
      return response.status(200).json({
            image: updatedUser.image,
      })
    } catch (error) {
      console.log({error});
      return response.status(500).send("Internal Server ERROR")
    }
}


const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

const removeProfileImage = async (request, response, next) => {
    try {
      const { userId } = request;
      const user = await User.findById(userId);
  
      if (!user) {
        return response.status(404).send("User not found");
      }
  
      if (user.image) {
        const filePath = `public/${user.image}`; // Adjust based on your storage logic
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      user.image = null;
      await user.save();
  
      return response.status(200).send("Profile Image removed Successfully");
    } catch (error) {
      console.log({ error });
      return response.status(500).send("Internal Server ERROR");
    }
  };


export {registerUser, loginUser, logoutUser, allUsers, updateUser, getUserProfile, updateUserAvatar, removeProfileImage}