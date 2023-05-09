const bcrybt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

let refreshTokens = []

const authController = {
    //Resgister
    registerUser:
        async (req, res) => {
            try {
                const salt = await bcrybt.genSalt(10)
                const hashed = await bcrybt.hash(req.body.password, salt)

                //Create user
                const newUser = await new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed
                })

                //Saved to DB
                const user = await newUser.save()
                return res.status(200).json(user)
            } catch (err) {
                return res.status(500).json(err)
            }

        },

    //Generate access token
    generateAccessToken: (user) => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    },

    //Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign({ id: user.id, admin: user.admin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "365d" })
    },
    //Login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user) {
                return res.status(404).json("Wrong username")
            }
            const validPassword = await bcrybt.compare(req.body.password, user.password)
            if (!validPassword) {
                return res.status(404).json("Wrong password")
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, path: "/", sameSite: "strict" })
                const { password, ...others } = user._doc
                return res.status(200).json({ ...others, accessToken })
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    },
    requestRefreshToken: async (req, res) => {
        //take refresh token from user
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(401).json("You are not authenticated")
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid")
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            //create new accesstoken,refresh token
            const newAccessToken = authController.generateAccessToken(user)
            const newRefreshToken = authController.generateRefreshToken(user)
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: false, path: "/", sameSite: "strict" })
            return res.status(200).json({ accessToken: newAccessToken })
        })
    },
    //logout
    userLogout: async (req, res) => {
        res.clearCookie("refreshToken")
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
        res.status(200).json("Logged out!!")
    }
}

//STORE

module.exports = authController