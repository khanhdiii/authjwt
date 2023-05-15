import axios from "axios"
import { loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice"
import { getUserFaliled, getUserStart, getUserSuccess } from "./userSlice"

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart())
    try {
        const res = await axios.post("v1/auth/login", user)
        dispatch(loginSuccess(res.data))
        navigate("/")
    } catch (err) {
        dispatch(loginFailed)
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart())
    try {
        await axios.post("v1/auth/register", user)
        dispatch(registerSuccess())
        navigate("/")
    } catch (err) {
        dispatch(registerFailed())
    }
}

export const getAllUsers = async (accessToken, dispatch) => {
    dispatch(getUserStart())
    try {
        const res = await axios.get("v1/user", { headers: { token: `Bearer ${accessToken}` } })
        dispatch(getUserSuccess(res.data))
    } catch (err) {
        dispatch(getUserFaliled())
    }
}