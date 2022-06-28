const mongoose = require('mongoose')

async function connect() {
	try {
		await mongoose.connect(process.env.MONGOOSE_DB_CONNECT, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		console.log('Connect successfully!!!')
	} catch (err) {
		console.log('Connect failure!!!\n', err)
	}
}

module.exports = { connect }
