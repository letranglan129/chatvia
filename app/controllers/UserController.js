const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Notification = require('../models/Notification')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const { createContentNotify } = require('../../ulti')
const {
    EMAIL_REG,
    STATUS_NOTIFY,
    CONVERSATION_TYPE,
} = require('../../contanst')
const AddFriend = require('../models/AddFriend')
// const ObjectId = require('mongoose').Types.ObjectId
const Promise = require('bluebird')

class UserController {
    // @route	[POST] /user/login
    // @desc	Login
    // @access	Private
    async login(req, res) {
        const emailBody = req.body?.email
        const passwordBody = req.body?.password

        const user = await User.findOne({ email: emailBody })

        if (!user) {
            return res.status(401).json('Email không tồn tại!!!')
        }

        const result = await bcrypt.compare(passwordBody, user.password)
        if (!result) {
            return res.json('Mật khẩu không chính xác')
        }

        const accessToken = await jwt.sign(
            { email: emailBody },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: '60s' }
        )
        const refreshToken = await jwt.sign(
            { email: emailBody },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: '60d' }
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        })
        const { password, ...userObj } = user._doc
        return res.json({ ...userObj, accessToken })
    }

    // @route	[POST] /user/register
    // @desc	Register
    // @access	Private
    async createUser(req, res) {
        const userNew = req.body
        const data = await User.findOne({ email: userNew.email })

        if (Object.keys(userNew).length) {
            if (userNew.password.length < 6)
                return res.json({
                    field: 'password',
                    msg: 'Mật khâu tối thiểu 6 kí tự!!!',
                })
            if (userNew.password !== userNew.repassword)
                return res.json({
                    field: 'repassword',
                    msg: 'Nhập lại mật khẩu không trùng khớp!!!',
                })
            if (!EMAIL_REG.test(userNew.email))
                return res.json({
                    field: 'email',
                    msg: 'Định dạng email không chính xác!!!',
                })
        }

        if (data) {
            return res.json({ field: 'email', msg: 'Email đã tồn tại!!!' })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(userNew.password, salt)

            try {
                await User.create({ ...userNew, password: hashPass })
                return res.json(null)
            } catch (err) {
                return res.json({ field: null, msg: 'Đã xảy ra lỗi!!!' })
            }
        }
    }

    // @route	[PUT] /user/update-info
    // @desc	Update info user
    // @access	Private
    async updateInfo(req, res) {
        const user = req.user
        const { name, avatar } = req.body
        const data = await User.findByIdAndUpdate(user._id, {
            avatar,
            name,
        })
        res.status(200).json({ user })
    }

    // @route	[POST] /user/refresh
    // @desc	Refresh token
    // @access	Private
    async refreshToken(req, res) {
        const refreshTokenBody = req.cookies.refreshToken
        if (!refreshTokenBody) {
            return res.status(401).json('Không tìm thấy refresh token!!!')
        }

        const verified = jwt.verify(
            refreshTokenBody,
            process.env.REFRESH_SECRET_KEY
        )

        if (verified) {
            const newAccessToken = await jwt.sign(
                { email: verified.email },
                process.env.ACCESS_SECRET_KEY,
                { expiresIn: '60s' }
            )
            const newRefreshToken = await jwt.sign(
                { email: verified.email },
                process.env.REFRESH_SECRET_KEY,
                { expiresIn: '60d' }
            )

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
            })

            return res.json({ accessToken: newAccessToken })
        }
        res.status(401).json(
            'Refresh token không chính xác, vui lòng đăng nhập lại!!!'
        )
    }

    // @route	[GET] /user/logout
    // @desc	Logout
    // @access	Private
    async logout(req, res) {
        res.clearCookie('refreshToken')
        res.json('Đăng xuất thành công!!!')
    }

    // @route	[GET] /user/get-all
    // @desc	Get all user
    // @access	Private
    async getAllUser(req, res) {
        try {
            const user = await User.find({})
            res.json({ user: user })
        } catch (err) {
            res.json(err)
        }
    }

    // @route	[POST] /user/search
    // @desc	Search user
    // @access	Private
    async searchUser(req, res) {
        const query = new RegExp(req.body.query, 'i')

        try {
            let user = await User.find({ name: query })
            user = await Promise.map(user, async item => {
                const { password, ...userObj } = item._doc
                const addFriendInfo = await AddFriend.findOne({
                    $or: [
                        {
                            senderId: req.user._id,
                            receiverId: userObj._id,
                        },
                        {
                            senderId: userObj._id,
                            receiverId: req.user._id,
                        },
                    ],
                })
                return {
                    ...userObj,
                    senderId: addFriendInfo?.senderId,
                    receiverId: addFriendInfo?.receiverId,
                }
            })
            res.json({ user: user })
        } catch (err) {
            res.json(err)
        }
    }

    // @route	[GET] /user/list-friend
    // @desc	Get list friend
    // @access	Private
    async getListFriend(req, res) {
        try {
            const friends = await User.find({ _id: { $in: req.user.friends } })
            const conversations = await Conversation.find({
                members: { $in: [req.user._id.toString()] },
                type: CONVERSATION_TYPE.personal,
            })

            res.status(200).json(
                friends.map(friend => {
                    const conversation = conversations.filter(conversation =>
                        conversation.members?.includes(friend._id.toString())
                    )[0]
                    const { password, ...userObj } = friend._doc
                    return { conversation, ...userObj }
                })
            )
        } catch (error) {
            res.status(401).json(error)
        }
    }

    // @route	[GET] /user/:id
    // @desc	Get info a user by id
    // @access	Private
    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id)
            const { password, ...other } = user._doc
            res.status(200).json(other)
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = new UserController()
