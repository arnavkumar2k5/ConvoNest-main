import { useSocket } from '@/context/SocketContext';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from "react-icons/gr";
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';

function MessageBar() {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const userInfo = useSelector((state) => {
        const userData = state.auth.userData;
        // First try the nested structure
        if (userData?.data?.user) {
            return userData.data.user;
        }
        // If not nested, check if userData itself is the user data
        if (userData && typeof userData === 'object') {
            return userData;
        }
        // If neither structure matches, log an error
        console.error("Unexpected userData structure:", userData);
        return null;
    });
    console.log("oo bhai yeh aaya hai:- ", useSelector((state) => state.auth.userData?.data?.user));
    const selectedChatData = useSelector((state) => state.chat.selectedChatData);
    const selectedChatType = useSelector((state) => state.chat.selectedChatType);
    const dispatch = useDispatch()

    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiRef]);

    const handleEmojiAdd = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    const handleSendMessage = async() => {
        if (!socket || !socket.emit) {
            console.error("Socket is not initialized yet!");
            return;
        }

        if (!socket.connected) {
            console.warn("Socket is disconnected. Trying to reconnect...");
            socket.connect();
            return;
        }

        if (!message.trim()) {
            console.warn("Cannot send an empty message.");
            return;
        }

        if (!selectedChatData || !selectedChatData._id) {
            console.error("No chat selected.");
            return;
        }

        console.log("Sending message:", message);

        if(selectedChatType === "contact"){
            socket.emit("sendMessage", {
                sender: userInfo?._id,
                content: message,
                recipient: selectedChatData?._id,
                messageType: "text",
                fileUrl: undefined,
            });
        } else if(selectedChatType === "channel"){
            socket.emit("send-channel-message", {
                sender: {
                    _id: userInfo._id,
                    fullName: userInfo.fullName,
                    username: userInfo.username,
                    image: userInfo.image,
                    color: userInfo.color
                },
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id,
            });
        }

        setMessage(""); // Clear input after sending
    };

    const handleAttachmentClick = () => {
        if(fileInputRef.current){
            fileInputRef.current.click();
        }
    }

    const handleAttachmentChange = async (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("recipient", selectedChatData?._id);
    
                const response = await axios.post(
                    "https://convonest-mn3l.onrender.com/api/v1/messages/upload-file",
                    formData,
                    {
                        withCredentials: true,
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );
    
                if (response.status === 200 && response.data) {
                    console.log("File uploaded successfully:", response.data);
                    
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo?._id,
                            content: undefined,
                            recipient: selectedChatData?._id,
                            messageType: "file",
                            fileUrl: response.data.url,
                        });
                    } else if(selectedChatType === "channel") {
                        socket.emit("send-channel-message", {
                            sender: {
                                _id: userInfo._id,
                                fullName: userInfo.fullName,
                                username: userInfo.username,
                                image: userInfo.image,
                                color: userInfo.color
                            },
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.url,
                            channelId: selectedChatData._id,
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error in attaching file:", error);
        }
    };
    

    return (
        <div className='h-[10vh] flex justify-center items-center px-16 my-2 gap-2'>
            <div className='flex md:flex-1 border-2 border-[#E9EAEB] rounded-md items-center gap-2 pr-2'>
                <input 
                    type="text" 
                    className='flex-1 p-5 bg-transparent text-black rounded-md border-none outline-none w-3/4 md:w-auto overflow-x-hidden' 
                    placeholder='Enter Message' 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                onClick={handleAttachmentClick}
                >
                    <GrAttachment className="text-2xl"/>
                </button>
                <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange}/>
                <div className="relative">
                    <button 
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' 
                        onClick={() => setEmojiPickerOpen(true)}
                    >
                        <RiEmojiStickerLine className="text-2xl"/>
                    </button>
                    {emojiPickerOpen && (
                        <div className='absolute bottom-16 -right-16 md:right-0' ref={emojiRef}>
                            <EmojiPicker theme='dark' onEmojiClick={handleEmojiAdd} autoFocusSearch={false}/>
                        </div>
                    )}
                </div>
            </div>
            <button 
                className='bg-[#40C4FF] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#03A9F4] focus:bg-[#03A9F4] focus:outline-none focus:text-white duration-300 transition-all' 
                onClick={handleSendMessage}
            >
                <IoSend className='text-2xl'/>
            </button>
        </div>
    );
}

export default MessageBar;
