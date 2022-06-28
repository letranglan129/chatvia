const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isAuth = async (req, res, next) => {
	const accessTokenHeader = req.headers.token
	
	if (!accessTokenHeader) {
		return res.status(401).json('Không tìm thấy access token!!!')
	}

	jwt.verify(accessTokenHeader, process.env.ACCESS_SECRET_KEY, async (err, data) => {
		if (err) {
			return res.status(500).json('Access token đã hết hạn!!!')
		}
		const user = await User.findOne({ email: data.email })
		req.user = user
		return next()
	})
}

module.exports = { isAuth }
