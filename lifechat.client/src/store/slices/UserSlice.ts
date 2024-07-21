import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    name: undefined,
    loggedIn: undefined,
    token: undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setUsername: (state, action) => {
            state.name = action.payload
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setUsername, setLoggedIn, setToken } = userSlice.actions

export default userSlice.reducer