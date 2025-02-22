import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
    directMessageContacts: [],
    channels: [],
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChannels: (state, action) => {
            state.channels = action.payload;
        },
        setSelectedChatType: (state, action) => {
            state.selectedChatType = action.payload;
        },
        setSelectedChatData: (state, action) => {
            state.selectedChatData = action.payload;
        },
        setSelectedChatMessages: (state, action) => {
            state.selectedChatMessages = action.payload;
        },
        setDirectMessagesContact: (state, action) => {
            state.directMessageContacts = action.payload;
        },
        addDirectMessageContact: (state, action) => {
            // Check if contact already exists
            const exists = state.directMessageContacts.some(
                contact => contact._id === action.payload._id
            );
            if (!exists) {
                state.directMessageContacts.unshift(action.payload);
            }
        },
        
        addChannel: (state, action) => {
            // Safely check if the channel exists and has required properties
            const newChannel = action.payload;
            if (!newChannel) return;

            const channelId = newChannel._id || newChannel.id;
            if (!channelId) return;

            // Check if channel already exists
            const exists = state.channels.some(channel => 
                (channel._id === channelId) || (channel.id === channelId)
            );

            if (!exists) {
                state.channels.unshift(newChannel);
            }
        },
        closeChat: (state) => {
            state.selectedChatData = undefined;
            state.selectedChatType = undefined;
            state.selectedChatMessages = [];
        },
        addMessage: (state, action) => {
            const message = action.payload;
            if (state.selectedChatType === "channel") {
                // For channel messages, ensure sender object structure is preserved
                state.selectedChatMessages.push({
                    ...message,
                    sender: {
                        _id: message.sender._id,
                        fullName: message.sender.fullName,
                        username: message.sender.username,
                        image: message.sender.image,
                        color: message.sender.color
                    },
                    messageType: message.messageType || "text",
                    fileUrl: message.fileUrl,
                });
            } else {
                // For DMs, transform IDs as before
                state.selectedChatMessages.push({
                    ...message,
                    recipient: message.recipient?._id ?? message.recipient,
                    sender: message.sender?._id ?? message.sender,
                    messageType: message.messageType || "text",
                    fileUrl: message.fileUrl,
                });
            }
        },
    },
});

export const {
    setChannels,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    setDirectMessagesContact,
    addDirectMessageContact,
    addChannel,
    closeChat,
    addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
