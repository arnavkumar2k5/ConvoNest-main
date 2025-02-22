import { addMessage, setSelectedChatMessages } from "@/store/chatSlice";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/context/SocketContext";
import axios from "axios";
import { ArrowDown, FolderRoot, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { io } from "socket.io-client";

function MessageContainer() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const scrollRef = useRef();
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
  const selectedChatData = useSelector((state) => state.chat.selectedChatData);
  const selectedChatType = useSelector((state) => state.chat.selectedChatType);
  const selectedChatMessages = useSelector(
    (state) => state.chat.selectedChatMessages
  );

  const [showImage, setshowImage] = useState(false);
  const [ImageUrl, setImageUrl] = useState(null);

  const download = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl, { credentials: fileUrl.includes('cloudinary.com') ? 'omit' : 'include'  });
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/messages/get-messages`, {
          params: { id: selectedChatData._id },
          withCredentials: true,
        });

        if (response.data.data) {
          dispatch(setSelectedChatMessages(response.data.data));
        }
      } catch (error) {
        console.error(
          "Error loading messages: ",
          error.response?.data || error.message
        );
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/channels/get-channel-messages/${selectedChatData._id}`,
          { withCredentials: true }
        );

        if (response.data.data) {
          if (
            JSON.stringify(response.data.data) !==
            JSON.stringify(selectedChatMessages)
          ) {
            dispatch(setSelectedChatMessages(response.data.data));
          }
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (selectedChatData?._id && selectedChatType === "contact") {
      getMessages();
    } else if (selectedChatData?._id && selectedChatType === "channel") {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    if (userInfo) {
      socket.current = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      const handleReceiveMessage = (message) => {
        if (
          selectedChatData &&
          selectedChatType === "contact" &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          dispatch(addMessage(message));
        }
      };

      const handleChannelMessage = (message) => {
        if (
          selectedChatData &&
          selectedChatType === "channel" &&
          selectedChatData._id === message.channelId
        ) {
          const formattedMessage = {
            ...message,
            sender: {
              _id: message.sender._id,
              fullName: message.sender.fullName,
              username: message.sender.username,
              image: message.sender.image,
              color: message.sender.color
            }
          };
          dispatch(addMessage(formattedMessage));
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message", handleChannelMessage);

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleReceiveMessage);
          socket.current.off("receive-channel-message", handleChannelMessage);
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo, selectedChatData, selectedChatType]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.updatedAt).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.updatedAt).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === userInfo?._id ? "text-right" : "text-left"
      }`}
    >
      {message.messageType === "text" && (
        <div>
          <div
            className={`${
              message.sender === userInfo?._id
                ? "bg-[#40C4FF] text-white rounded-t-2xl rounded-l-2xl text-left"
              : "bg-[#FFFFFF] text-black rounded-t-2xl rounded-r-2xl"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
          <div className="text-xs text-gray-600">
            {moment(message.updatedAt).format("LT")}
          </div>
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender === userInfo?._id
              ? "bg-[#40C4FF] text-white rounded-t-2xl rounded-l-2xl text-left"
              : "bg-[#FFFFFF] text-black rounded-t-2xl rounded-r-2xl"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setshowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img 
                src={message.fileUrl} 
                alt="" 
                height={300} 
                width={300}
                className="object-contain" 
              />
            </div>
          ) : (
            <div className="flex items-center p-3 justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <FolderRoot size={20} />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="p-3 text-2xl cursor-pointer transition-all duration-300"
                onClick={() => download(message.fileUrl)}
              >
                <ArrowDown size={20} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderChannelMessages = (message) => (
    <div
      className={`mt-5 ${
        message.sender._id !== userInfo._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender._id === userInfo._id
              ? "bg-[#40C4FF] text-white rounded-t-2xl rounded-l-2xl text-center"
              : "bg-[#FFFFFF] text-black rounded-t-2xl rounded-r-2xl"
          } border inline-block px-3 py-3 my-1 break-words`}
        >
          <div className="md:max-w-[500px] md:min-w-8 max-w-64 min-w-20">
            {message.content}
          </div>
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender._id === userInfo._id
              ? "bg-[#40C4FF] text-white rounded-t-2xl rounded-l-2xl text-left"
              : "bg-[#FFFFFF] text-black rounded-t-2xl rounded-r-2xl"
          } border inline-block p-4 overflow-hidden rounded-2xl my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setshowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img 
                src={message.fileUrl} 
                height={300} 
                width={300} 
                alt=""
                className="object-contain" 
              />
            </div>
          ) : (
            <div className="flex items-center p-3 justify-center gap-4">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <FolderRoot size={20} />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="p-3 text-2xl cursor-pointer transition-all duration-300"
                onClick={() => download(message.fileUrl)}
              >
                <ArrowDown size={20} />
              </span>
            </div>
          )}
        </div>
      )}

      {message.sender._id !== userInfo._id ? (
        <div className="flex gap-2 items-center mt-1">
          <Avatar className="h-8 w-8 rounded-full overflow-hidden">
            {message.sender.image && (
              <AvatarImage
                src={message.sender.image}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            )}
            <AvatarFallback
              className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                message.sender.color
              )}`}
            >
              {message.sender.fullName
                  ? message.sender.fullName.charAt(0)
                  : message.sender.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">
            <span className="uppercase">{message.sender.fullName}</span> <span className="text-xs">({message.sender.username})</span>
          </span>
          <span className="text-sm text-gray-600">
            {moment(message.updatedAt).format("LT")}
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-600 mt-1">
          {moment(message.updatedAt).format("LT")}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70w] xl:w-[80vw] w-full bg-[#E9EAEB]">
      {renderMessages()}
      <div ref={scrollRef} />
      
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div className="max-h-[80vh] max-w-[90vw]">
            <img
              src={ImageUrl}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 rounded-full hover:bg-black/50 p-3 text-2xl cursor-pointer transition-all duration-300"
              onClick={() => download(ImageUrl)}
            >
              <ArrowDown size={20} />
            </button>

            <button
              className="bg-black/20 rounded-full hover:bg-black/50 p-3 text-2xl cursor-pointer transition-all duration-300"
              onClick={() => {
                setshowImage(false);
                setImageUrl(null);
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageContainer;