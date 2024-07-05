import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    connector: undefined
}

export const connectorSlice = createSlice({
    name: 'connector',
    initialState,
    reducers: {
        setConnector: (state, action) => {
            state.connector = action.payload
        },
        sendToConnection: (state, action) => {
            console.log(action.payload);
            if(state.connector != undefined)
                state.connector.sendMessage(action.payload)
        } 
    }
})

export const { setConnector, sendToConnection } = connectorSlice.actions

export default connectorSlice.reducer