import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login } from "@/store/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomCursor from "../Landing/Cursor";
import { IoArrowBack } from "react-icons/io5";

function Auth() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { identifier, password },
        { withCredentials: true }
      );

      dispatch(login({ userData: response.data }));
      alert("Login Successful!");
      navigate("/chat");
    } catch (error) {
      console.error("Login Error: ", error);
      alert("Something went wrong, please try again.");
    }
  };

  const handleSignUp = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("http://localhost:8000/api/v1/users/register", formData, {
        withCredentials: true,
      });
      setMessage(response.data.message || "User registered successfully!");
      dispatch(login({ userData: response.data }));
      navigate("/profile");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An Error Occurred during registration"
      );
    }
  };

  return (
    <div className="h-screen px-2 md:px-0 flex items-center justify-center bg-gradient-to-br from-[#004AAD] to-[#40C4FF]">
      <CustomCursor/>
      <div className="w-full max-w-lg bg-white rounded-2xl p-8 border border-white/20">
      <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-[#40C4FF] to-[#004AAD] text-transparent bg-clip-text tracking-wide">
          CONVONEST
        </h1>

        <Tabs className="w-full mt-6" defaultValue="login">
          <TabsList className="flex justify-around bg-transparent border-b border-gray-300 pb-2">
            <TabsTrigger
              value="login"
              className="text-lg font-bold text-gray-600 uppercase tracking-wide data-[state=active]:bg-[#00BFFF] data-[state=active]:text-white w-1/2 transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="text-lg font-bold text-gray-600 uppercase w-1/2 tracking-wide data-[state=active]:bg-[#00BFFF] data-[state=active]:text-white transition-all"
            >
              Signup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-8 flex flex-col gap-5">
            <Input
              type="text"
              placeholder="Email or Username"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-[#40C4FF] text-white font-semibold py-3 rounded-lg hover:bg-[#004AAD] transition-all"
            >
              Login
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="mt-1 flex flex-col gap-5">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="username"
              placeholder="Username"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={formData.username}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-white/20 border-2 text-gray-700 placeholder-gray-300"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              onClick={handleSignUp}
              className="w-full bg-[#40C4FF] text-white font-semibold py-3 rounded-lg hover:bg-[#004AAD] transition-all"
            >
              Sign Up
            </Button>
          </TabsContent>
          <span onClick={() => navigate("/")} className="mt-2 cursor-pointer flex items-center justify-center text-md font-semibold text-gray-600 gap-1">
            <IoArrowBack/>
            Go Back
            </span>
        </Tabs>
      </div>
    </div>
  );
}

export default Auth;
