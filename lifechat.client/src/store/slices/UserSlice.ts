import { createSlice } from "@reduxjs/toolkit"
import User from "../../model/User"
import { BehaviorSubject } from "rxjs"

const initialState: {
    user: User | undefined,
    user$: BehaviorSubject<User | undefined>,
    loggedIn: boolean,
    token: string | undefined
} = {
    user: undefined,
    user$: new BehaviorSubject<User | undefined>(undefined),
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
            state.user$.next(state.user)
        },
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUsername: (state, action) => {
            if(state.user){
                state.user.username = action.payload
                state.user$.next(state.user)
            }
        },
        setEmail: (state, action) => {
            if(state.user) {
                state.user.email = action.payload
                state.user$.next(state.user)
            }
        }
    }
})

export const { setUser, setLoggedIn, setToken, setUsername, setEmail } = userSlice.actions

export default userSlice.reducer