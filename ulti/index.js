function createContentNotify(...arg) {
	console.log(arg)
}

const getLastMessage = (type, text) => {
    switch (type) {
        case 'text':
            return text
        case 'imageGroup':
            return '[Hình ảnh]'
        case 'file':
            return '[Tệp]'
        default:
            return ''
    }
}

module.exports = { createContentNotify, getLastMessage }
