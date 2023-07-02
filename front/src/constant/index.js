import { EMOJI_IMAGE } from '../assets/image'

export const URL_REG = new RegExp(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g
)

export const MESSAGE_ICON = {
    like: EMOJI_IMAGE.like,
    love: EMOJI_IMAGE.love,
    smile: EMOJI_IMAGE.smile,
    wow: EMOJI_IMAGE.wow,
    sad: EMOJI_IMAGE.sad,
    angry: EMOJI_IMAGE.angry,
}
export const SWIPER_PARAMS = {
    zoomStep: 0.5,
    minZoom: 1,
    maxZoom: 4,
    defaultZoom: 1,
    defaultRotate: 0,
}
export const EMAIL_REG =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
export const URI_REG = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
export const MIN_LENGTH_PASSWORD = 6
export const STORE_NAME_INDEXEDDB = 'conversation'
export const STORE_NEW_MESSAGE_INDEXEDDB = 'list'
export const NAME_NEW_MESSAGE_INDEXEDDB = 'NewMessageList'
export const APP_API_URL = 'https://chatvia-be.vercel.app/'
export const LIMIT_IMAGE_SHOW = 8
export const LIMIT_FILE_SHOW = 4
export const LIMIT_LINK_SHOW = 4
export const SOCKET_CONFIG = {
    transports: ['websocket', 'polling', 'flashsocket'],
}
export const STATUS_RESPONSE = {
    success: 'OK',
    error: 'ERROR',
    pending: 'PENDING',
}

export const STATUS_NOTIFY = {
    sent: 'UNREAD',
    seen: 'READED',
    accpet: 'ACCEPT',
    reject: 'REJECT',
}
export const CONVERSATION_TYPE = {
    personal: 'PERSONAL',
    group: 'GROUP',
}

export const FILE_TYPE = {
    text: ['doc', 'docx', 'odt', 'pdf', 'rtf', 'tex', 'txt', 'wpd'],
    video: [
        '3g2',
        '3gp',
        'avi',
        'flv',
        'h264',
        'm4v',
        'mkv',
        'mov',
        'mp4',
        'mpg',
        'mpeg',
        'rm',
        'swf',
        'vob',
        'wmv',
    ],
    sheet: ['ods', 'xls', 'xlsm', 'xlsx'],
    presentation: ['key', 'odp', 'pps', 'ppt', 'pptx'],
    zip: ['7z', 'arj', 'deb', 'pkg', 'rar', 'rpm', 'tar.gz', 'z', 'zip'],
    audio: [
        'aif',
        'cda',
        'mid',
        'midi',
        'mp3',
        'mpa',
        'ogg',
        'wav',
        'wma',
        'wpl',
    ],
    image: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'tiff',
        'psd',
        'pdf',
        'eps',
        'ai',
        'indd',
        'raw',
    ],
}
