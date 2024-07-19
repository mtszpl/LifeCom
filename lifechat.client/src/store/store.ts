import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./slices/ConnectorSlice";
import userReducer from "./slices/UserSlice";

const store = configureStore({
    reducer: {
        connector: connectionReducer,
        user: userReducer
    }
})

export default store
