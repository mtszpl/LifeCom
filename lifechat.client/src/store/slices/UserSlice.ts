import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: undefined,
    loggedIn: undefined,
    token: undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { setUser, setLoggedIn, setToken } = userSlice.actions

export default userSlice.reducer