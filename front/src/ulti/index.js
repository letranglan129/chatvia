export const calcSize = size => {
    if (size > Math.pow(1024, 3)) {
        return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
    }
    if (size > Math.pow(1024, 2)) {
        return `${(size / 1024 / 1024).toFixed(2)} MB`
    }
    if (size > 1024) {
        return `${(size / 1024).toFixed(2)} KB`
    }
    return `${size} B`
}

export const getResourceType = (url, type) => {
    if (type) return type

    return url.split('.').pop()
}

export function afterLoadImageMessage(count, callback) {
    if (count === 0) return
    let noOfCalls = 0

    return function (...rest) {
        noOfCalls = noOfCalls + 1
        if (noOfCalls === count) callback(...rest)
    }
}


export const getLastMessage = (type, text) => {
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
