const Notification = require("../models/Notification");

class NotifyController {

    // @route   POST api/notify/send
    // @desc    Send a notification
    // @access  Private
    async send(req, res) {
        const {
            title,
            type,
            senderId,
            receiver
        } = req.body;

        const notification = new Notification({
            title,
            type,
            senderId,
            receiver
        });

        try {
            await notification.save();
            res.status(200).json({
                success: true,
                message: "Notification sent successfully"
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    // @route   GET api/notify/get
    // @desc    Get all notifications
    // @access  Private
    async get(req, res) {
        try {
            const notifications = await Notification.find({
                receiver: req.user.id
            }).sort({
                date: -1
            });
            res.status(200).json({
                success: true,
                notifications
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }

    // @route   GET api/notify/get/:id
    // @desc    Get a notification
    // @access  Private
    async getOne(req, res) {
        try {
            const notification = await Notification.findById(req.params.id);
            res.status(200).json({})
        } catch (err) {
            res.status(500).json({})
        }
    }
}

module.exports = new NotifyController()