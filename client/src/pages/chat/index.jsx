import { useSelector } from "react-redux";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import EmptyContainer from "./components/empty-chat-container";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

function Chat() {
  const userInfo = useSelector((state) => {
    const userData = state.auth.userData;
    return userData?.data?.user || userData;
  });
  const selectChatType = useSelector((state) => state.chat.selectedChatType);
  const navigate = useNavigate();

  console.log("User Info in Chat:", userInfo);

  useEffect(() => {
    // Check if userInfo exists and if it has the required profile fields
    if (userInfo && (!userInfo.fullName || !userInfo.username)) {
      alert("Please Setup User profile");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex text-white overflow-hidden">
      <ContactsContainer />
      {selectChatType === undefined ? <EmptyContainer /> : <ChatContainer />}
    </div>
  );
}

export default Chat;
