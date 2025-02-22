import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { closeChat } from "@/store/chatSlice";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

function ChatHeader() {
  const selectedChataData = useSelector((state) => state.chat.selectedChatData);
  const selectedChataType = useSelector((state) => state.chat.selectedChatType);
  const [selectedColor, setSelectedColor] = useState(0);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-5 gap-5 w-full h-[11.5vh] bg-[#EFF6FC] text-black">
      {
        selectedChataType === "contact" ? 
      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
        {selectedChataData.image ? (
          <AvatarImage
            src={selectedChataData.image}
            alt="profile"
            className="object-cover w-full h-full bg-black"
          />
        ) : (
          <div
            className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
              selectedColor
            )}`}
          >
            {selectedChataData.fullName
              ? selectedChataData.fullName.split("").shift()
              : email.split("").shift()}
          </div>
        )}
      </Avatar> : <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full '>#</div>
      }
      <div className="flex flex-col uppercase font-semibold">
        {
          selectedChataType === "channel" && <span>{selectedChataData.name}</span>
        }
        {
          selectedChataType === "contact" &&  <div>
            {selectedChataData.fullName} 
            <span className="text-sm lowercase"> ({selectedChataData.username})</span>
          </div>
        }
      </div>
      <div onClick={() => dispatch(closeChat())} className="cursor-pointer text-2xl">
        <IoClose/>
      </div>
    </div>
  );
}

export default ChatHeader;
