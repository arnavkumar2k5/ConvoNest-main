import { setSelectedChatData, setSelectedChatMessages, setSelectedChatType } from '@/store/chatSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from './ui/avatar';
import { getColor } from '@/lib/utils';

function ContactList({ isChannel = false }) {
    // Get all required state from Redux
    const selectedChatData = useSelector((state) => state.chat.selectedChatData);
    const selectedChatType = useSelector((state) => state.chat.selectedChatType);
    const directMessageContacts = useSelector((state) => state.chat.directMessageContacts);
    const channels = useSelector((state) => state.chat.channels);
    const dispatch = useDispatch();
    console.log("dm aa gaya", directMessageContacts)
    console.log("channel aa gaya", channels)

    // Use the appropriate list based on isChannel prop
    const contacts = isChannel ? channels : directMessageContacts;

    const handleClick = (contact) => {
        if (!contact) return;
        
        if (isChannel) {
            dispatch(setSelectedChatType("channel"));
        } else {
            dispatch(setSelectedChatType("contact"));
        }
        
        dispatch(setSelectedChatData(contact));
        
        if (selectedChatData && selectedChatData._id !== contact._id) {
            dispatch(setSelectedChatMessages([]));
        }
    };

    const renderContactContent = (contact) => {
        if (!contact) return null;

        if (isChannel) {
            return (
                <>
                    <div className='bg-[#E9EAEB] h-10 w-10 flex items-center justify-center rounded-full'>
                        #
                    </div>
                    <span className='uppercase'>{contact.name || 'Unnamed Channel'}</span>
                </>
            );
        }

        return (
            <div className='flex items-center justify-start gap-2'>
                <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                    {contact.image ? (
                        <AvatarImage
                            src={contact.image}
                            alt="profile"
                            className="object-cover w-full h-full bg-black"
                        />
                    ) : (
                        <div
                            className={`${
                                selectedChatData && selectedChatData._id === contact._id
                                    ? "bg-[#ffffff22] border border-white/70"
                                    : getColor(contact.color)
                            } uppercase h-full w-full text-lg border-[1px] flex items-center justify-center rounded-full`}
                        >
                            {contact.fullName
                                ? contact.fullName.charAt(0)
                                : contact.email?.charAt(0) || '#'}
                        </div>
                    )}
                </Avatar>
                <span>
                    <span className='uppercase'>{contact.fullName || 'Unknown'}</span> <span className='text-sm'>({contact.username || ''})</span>
                </span>
            </div>
        );
    };

    return (
        <div className='mt-5'>
            {contacts && contacts.length > 0 ? (
                contacts.map((contact) => (
                    contact && contact._id && (
                        <div
                            key={contact._id}
                            className={`pl-2 rounded-lg py-2 transition-all duration-300 cursor-pointer ${
                                selectedChatData && selectedChatData._id === contact._id
                                    ? "bg-[#40C4FF] hover:bg-[#40C4FF]"
                                    : "hover:bg-[#f1f1f111]"
                            }`}
                            onClick={() => handleClick(contact)}
                        >
                            <div className='flex gap-5 items-center text-black'>
                                {renderContactContent(contact)}
                            </div>
                        </div>
                    )
                )).filter(Boolean)
            ) : (
                <div className="text-center text-black mt-4">
                    {isChannel ? 'No channels available' : 'No contacts available'}
                </div>
            )}
        </div>
    );
}

export default ContactList;