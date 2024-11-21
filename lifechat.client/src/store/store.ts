import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import profilePictureReducer from "./slices/ProfilePictureSlice";

const store = configureStore({
    reducer: {
        userData: userReducer,
        profilePictureContainer: profilePictureReducer
    }
})

export default store
