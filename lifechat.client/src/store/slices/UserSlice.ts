import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: undefined,
    loggedIn: false,
    token: undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload
            state.loggedIn = true
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUsername: (state, action) => {
            if(state.user)
                state.user.username = action.payload
        },
        setEmail: (state, action) => {
            state.user.email = action.payload
        }
    }
})

export const { setUser, setLoggedIn, setToken, setUsername, setEmail } = userSlice.actions

export default userSlice.reducer