import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profilePicture: undefined
}

export const profilePictureSlice = createSlice({
    name: "profilePic",
    initialState,
    reducers: {
        setProfilePicture: (state, action) => {
            state.profilePicture = action.payload    
        }    
    }
})

export const { setProfilePicture } = profilePictureSlice.actions

export default profilePictureSlice.reducer