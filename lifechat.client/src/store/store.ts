import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./slices/ConnectorSlice";
import userReducer from "./slices/UserSlice";

const store = configureStore({
    reducer: {
        connectorContainer: connectionReducer,
        userData: userReducer
    }
})

export default store
