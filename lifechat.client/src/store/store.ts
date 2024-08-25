import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./slices/ConnectorSlice";
import userReducer from "./slices/UserSlice";
import profilePictureReducer from "./slices/ProfilePictureSlice";

const store = configureStore({
    reducer: {
        connectorContainer: connectionReducer,
        userData: userReducer,
        profilePictureContainer: profilePictureReducer
    }
})

export default store
