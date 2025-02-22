import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; 

const getUserData = () => {
    try {
        const data = Cookies.get("userData"); 
        return data ? JSON.parse(data) : null; 
    } catch (error) {
        console.error("Error parsing userData from cookies:", error);
        return null;
    }
};

const initialState = {
    status: !!Cookies.get("userData"),
    userData: getUserData(),
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            console.log("Redux Login Payload:", action.payload);

            state.status = true;
            state.userData = action.payload.userData;
            Cookies.set("userData", JSON.stringify(action.payload.userData), { expires: 1 });
        },
        logout: (state) => {
            console.log("Logging out, clearing userData from cookies");
            state.status = false;
            state.userData = null;
            Cookies.remove("userData");
        },
    },
});

export const { login, logout } = AuthSlice.actions;
export default AuthSlice.reducer;