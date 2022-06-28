const EMAIL_REG =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
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
    EMAIL_REG,
    STATUS_NOTIFY,
    STATUS_RESPONSE,
    CONVERSATION_TYPE,
    STATUS_MESSAGE,
}
