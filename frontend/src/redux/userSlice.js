import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
    name: "user",
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        getUserStart: (state) => {
            state.users.isFetching = true
        },
        getUserSuccess: (state, action) => {
            state.users.isFetching = false
            state.users.allUsers = action.payload
        },
        getUserFaliled: (state) => {
            state.users.isFetching = false
            state.users.error = true
        }
    }
})

export const { getUserStart, getUserSuccess, getUserFaliled } = userSlice.actions

export default userSlice.reducer