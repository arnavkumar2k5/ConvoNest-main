import mongoose, { Schema } from "mongoose";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createChannel = asyncHandler(async(req, res, next) => {
    try {
        const {name, members} = req.body;
        const userId = req.userId;
    
        const admin = await User.findById(userId);
    
        if(!admin){
            throw new ApiError(400, "Admin not Found")
        }
    
        const validMembers = await User.find({_id: {$in: members}});
    
        if(validMembers.length !== members.length){
            return res.status(200).send("Some members are not valid")
        }
    
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });
    
        await newChannel.save();
        return res
        .status(200)
        .json(new ApiResponse({channel: newChannel}, "newChannel Successfull"))
    } catch (error) {
        throw new ApiError(500, "Internal Server Error in newChannel")
    }
})


const getUserChannel = asyncHandler(async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId); // ✅ Correct way to create ObjectId

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json(
      new ApiResponse(200, channels, "get User Channel Successful")
    );
  } catch (error) {
    throw new ApiError(500, "get User Channel Unsuccessful");
  }
});


const getChannelMessages = asyncHandler(async(req, res, next) => {
    try {
        const {channelId} = req.params;
    
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "fullName username email _id image",
            },
        });
    
        if(!channel){
            throw new ApiError(400, "Channel not Found")
        };
    
        const messages = channel.messages;
    
        return res
        .status(200)
        .json(new ApiResponse(200, messages, "Channel Messages updated Successfully"))
    } catch (error) {
        throw new ApiError(500, "Internal Server Message Not able to load Messages")
    }
})

export {createChannel, getUserChannel, getChannelMessages}