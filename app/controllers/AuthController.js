const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { emailReg } = require('../../contanst')
class LoginController {
	//[POST] /auth/login
	async login(req, res) {
		const emailBody = req.body?.email
		const passwordBody = req.body?.password
		
		const user = await User.findOne({ email: emailBody })
		console.log(user);
		if (!user) {
			return res.status(401).json('Email không tồn tại!!!')
		}

		const result = await bcrypt.compare(passwordBody, user.password)
		if (!result) {
			return res.json('Mật khẩu không chính xác')
		}

		const accessToken = await jwt.sign({ emailBody }, process.env.ACCESS_SECRET_KEY, { expiresIn: '60s' })
		const refreshToken = await jwt.sign({ emailBody }, process.env.REFRESH_SECRET_KEY, { expiresIn: '60d' })

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'strict',
		})
		const { password, ...userObj} = user._doc
		return res.json({ ...userObj, accessToken })
	}

	//[POST] /auth/register
	async createUser(req, res) {
		const userNew = req.body
		const data = await User.findOne({ email: userNew.email })

		if (Object.keys(userNew).length) {
			if (userNew.password.length < 6) return res.json({ field: 'password', msg: 'Mật khâu tối thiểu 6 kí tự!!!' })
			if (userNew.password !== userNew.repassword) return res.json({ field: 'repassword', msg: 'Nhập lại mật khẩu không trùng khớp!!!' })
			if (!emailReg.test(userNew.email)) return res.json({ field: 'email', msg: 'Định dạng email không chính xác!!!' })
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

	//[POST] /auth/refresh
	async refreshToken(req, res) {
		const accessTokenHeader = req.headers.token
		
		if (!accessTokenHeader) {
			return res.status(401).json('Không tìm thấy access token!!!')
		}

		const refreshTokenBody = req.cookies.refreshToken
		if (!refreshTokenBody) {
			return res.status(401).json('Không tìm thấy refresh token!!!')
		}

		const verified = await jwt.verify(refreshTokenBody, process.env.REFRESH_SECRET_KEY)

		if (verified) {
			const newAccessToken = await jwt.sign({ email: verified.email }, process.env.ACCESS_SECRET_KEY, { expiresIn: '60s' })
			const newRefreshToken = await jwt.sign({ email: verified.email }, process.env.REFRESH_SECRET_KEY, { expiresIn: '60d' })

			res.cookie('refreshToken', newRefreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: 'strict',
			})
			
			return res.json({ accessToken: newAccessToken })
		}
		res.status(401).json('Refresh token không chính xác, vui lòng đăng nhập lại!!!')
	}

	//[GET] /auth/logout
	async logout(req, res) {
		res.clearCookie('refreshToken')
		res.json("Đăng xuất thành công!!!")
	} 

	async getAllUser(req, res) {
		try {
			const user = await User.find({})
			res.json({ user: user })
		}catch(err) {
			console.log(err)
			res.json(err)
		}
	}

	async searchUser(req, res) {
		const query = new RegExp(req.body.query, 'i')
		
		try {
			const user = await User.find({name: query})
			res.json({ user: user })
		} catch (err) {
			console.log(err)
			res.json(err)
		}
	}
}

module.exports = new LoginController()
