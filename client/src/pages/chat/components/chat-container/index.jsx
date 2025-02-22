import React from 'react'
import ChatHeader from './chat-header'
import MessageContainer from './message-container'
import MessageBar from './message-bar'

function ChatContianer() {
    return (
        <div className='fixed top-0 h-[100vh] w-[100vw] bg-[#EFF6FC] flex flex-col md:static md:flex-1 md:border-l-2'>
            <ChatHeader/>
            <MessageContainer/>
            <MessageBar/>
        </div>
    )
}

export default ChatContianer
