import {Server as SocketIOServer} from "socket.io";
import { Message } from "./models/messages.model.js";
import { Channel } from "./models/channel.model.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: ["http://localhost:5173"], // Allow frontend origin
            methods: ["GET", "POST"],
            credentials: true
        },
    });    

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    
    const sendMessage = async (message) => {
        try {
            const createdMessage = await Message.create(message);
            if (!createdMessage) throw new Error("Message not saved!");
    
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email fullName username")
                .populate("recipient", "id email fullName username");
    
            const sendSocketId = userSocketMap.get(message.sender); // Sender's socket ID
            const recipientSocketId = userSocketMap.get(message.recipient); // Receiver's socket ID
    
            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData);
            }
            if (sendSocketId) {
                io.to(sendSocketId).emit("receiveMessage", messageData); // ✅ Ensure sender also gets it
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    const sendChannelMessage = async (message) => {
        const {channelId, sender, content, messageType, fileUrl} = message;

        const createMessage = await Message.create({
            sender,
            recipient:null,
            content,
            messageType,
            timestamp:new Date(),
            fileUrl,
        });

        const messageData = await Message.findById(createMessage._id).populate("sender", "id email fullName image").exec()

        await Channel.findByIdAndUpdate(channelId, {
            $push: {messages: createMessage._id}
        })

        const channel = await Channel.findById(channelId).populate("members");

        const finalData = { ...messageData._doc, channelId: channel._id};

        if(channel && channel.members){
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if(memberSocketId){
                    io.to(memberSocketId).emit("receive-channel-message", finalData);
                }
                const adminSocketId = userSocketMap.get(channel.admin._id.toString());
                if(adminSocketId){
                    io.to(adminSocketId).emit("receive-channel-message", finalData);
                }
            })
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId){
            userSocketMap.set(userId, socket.id);
            console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection");
        }

        socket.on("sendMessage", async (message) => await sendMessage(message));
        socket.on("send-channel-message", async (message) => await sendChannelMessage(message));
        socket.on("disconnect", () => disconnect(socket));
    })
}

export default setupSocket;