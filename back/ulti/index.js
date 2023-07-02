const getLastMessage = (type, text) => {
    switch (type) {
		case 'link':
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

module.exports = { getLastMessage }
