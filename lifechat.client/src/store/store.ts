import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "./slices/ConnectorSlice";

const store = configureStore({
    reducer: {
        // test: testReducer,
        connector: connectionReducer
    }
})

export default store
