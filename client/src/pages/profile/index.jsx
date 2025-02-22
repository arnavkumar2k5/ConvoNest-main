import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { login, logout } from "@/store/authSlice";

function Profile() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);

  const fileInputRef = useRef(null);


  const dispatch = useDispatch();

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

          dispatch(login({userData: response.data.data}))
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    getUser();
  }, []);
  

  const saveChanges = async () => {
    try {
        const response = await axios.post(
            "https://convonest-mn3l.onrender.com/api/v1/users/update-account",
            { fullName, username },
            { withCredentials: true }
        );

        if (response.status === 200) {
            // Get fresh user data after update
            const updatedUserResponse = await axios.get("https://convonest-mn3l.onrender.com/api/v1/users/me", { 
                withCredentials: true 
            });

            if (updatedUserResponse.status === 200) {
                const userData = updatedUserResponse.data.data;
                
                // Dispatch with consistent structure
                dispatch(login({ 
                    userData: {
                        data: {
                            user: {
                                ...userData,
                                fullName,
                                username
                            }
                        }
                    }
                }));
            }
        }

        navigate("/chat");
    } catch (error) {
        console.log("Error in Updating Profile: ", error);
    }
};


  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
  
      try {
        const response = await axios.post("https://convonest-mn3l.onrender.com/api/v1/users/avatar", formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" }, });
  
        if (response.status === 200 && response.data) {
          dispatch(login({ userData: response.data }));
          console.log("Image Updated Successfully");
          window.location.reload();
        }
  
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result); // This updates local state
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.log("Error updating profile image:", error);
      }
    }
  };
  

  const handleDeleteImage = async () => {
    try {
      const response  = await axios.delete("https://convonest-mn3l.onrender.com/api/v1/users/delete-image", {withCredentials: true});
      
      if (response.status === 200 && response.data) {
        dispatch(login({ userData: response.data }));
        console.log("Image Removed Successfully");
        window.location.reload();

      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#E9EAEB] flex h-[100vh] items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <Link to="/chat">
          <div>
            <IoArrowBack className="text-4xl lg:text-6xl text-[#88888e] cursor-pointer" />
          </div>
        </Link>
        <div
          className="h-full w-32 md:w-48 md:h-48 relative flex items-center self-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Avatar className="h-36 w-36 md:w-48 md:h-48 rounded-full overflow-hidden">
            {image ? (
              <AvatarImage
                src={`https://convonest-mn3l.onrender.com/${image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-36 w-36 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  selectedColor
                )}`}
              >
                {fullName
                  ? fullName.split("").shift()
                  : email.split("").shift()}
              </div>
            )}
          </Avatar>
          {hovered && (
            <div
              className="absolute inset-0 -ml-2 h-36 w-36 md:h-auto md:w-auto md:-ml-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
              onClick={image ? handleDeleteImage : handleFileInputClick}
            >
              {image ? (
                <FaTrash className="text-white text-3xl cursor-pointer" />
              ) : (
                <FaPlus className="text-white text-3xl cursor-pointer" />
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            name="profile-image"
            accept=".png, .jpg, .jpeg, .svg, .webp"
          />
        </div>
          <div className="w-full">
          <label className="text-[#98989e] pl-1">Email</label>
            <Input
              placeholder="Email"
              type="email"
              disabled
              value={email}
              className="rounded-lg p-6 bg-transparent border-2 border-[#D0D1DB]"
            />
          </div>
        <div className="flex flex-col md:flex-row min-w-32 gap-5 text-black items-center justify-center">
          <div className="w-full">
            <label className="text-[#98989e] pl-1">Fullname</label>
            <Input
              placeholder="FullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg p-6 bg-transparent border-2 border-[#D0D1DB]"
            />
          </div>
          <div className="w-full">
            <label className="text-[#98989e] pl-1">Username</label>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg p-6 bg-transparent border-2 border-[#D0D1DB]"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <Link to="/chat">
          <Button onClick={saveChanges} className="bg-[#40C4FF] hover:bg-[#03A9F4]">Save Changes</Button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
