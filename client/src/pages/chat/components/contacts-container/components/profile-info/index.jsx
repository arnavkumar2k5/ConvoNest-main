import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {IoMdLogOut} from "react-icons/io"
import { logout } from "@/store/authSlice";
import axios from "axios";

function ProfileInfo() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("https://convonest-mn3l.onrender.com/api/v1/users/me", {
          withCredentials: true,
        });
        console.log("bhaiya aa gaya:- ", response.data.data);

        if (response.status === 200 && response.data.data) {
          const { fullName, email, username, image } = response.data.data;
  
          setFullName(fullName || "");
          setEmail(email || "");
          setUsername(username || "");
          setImage(image || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    getUser();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Navigate after logout
  };

  return (
    <div className="fixed bottom-0 h-20 left-0 md:h-16 flex items-center justify-center w-full md:w-[20%] bg-[#40C4FF]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
          {image ? (
            <AvatarImage
              src={`https://convonest-mn3l.onrender.com/${image}`}
              alt="profile"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div
              className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                selectedColor
              )}`}
            >
              {fullName ? fullName.split("").shift() : email.split("").shift()}
            </div>
          )}
        </Avatar>
        </div>
        <div className="uppercase text-white font-bold">{fullName}</div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <FaEdit
                  className="text-white text-xl font-medium"
                  onClick={() => navigate("/profile")}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IoMdLogOut
                  className="text-white text-xl font-medium"
                  onClick={handleLogout}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
