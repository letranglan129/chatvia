const EMAIL_REG = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const URI_HTTP_REG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

const STATUS_NOTIFY = {
	sent: 'UNREAD',
	seen: 'READED',
	accpet: 'ACCEPT',
	reject: 'REJECT',
}
const STATUS_RESPONSE = {
	success: 'OK',
	error: 'ERROR',
	pending: 'PENDING',
}
const STATUS_MESSAGE = {
	unread: 'UNREAD',
	readed: 'READED',
	sent: 'SENT',
}
const CONVERSATION_TYPE = {
	personal: 'PERSONAL',
	group: 'GROUP',
}

module.exports = {
	URI_HTTP_REG,
	EMAIL_REG,
	STATUS_NOTIFY,
	STATUS_RESPONSE,
	CONVERSATION_TYPE,
	STATUS_MESSAGE,
}
