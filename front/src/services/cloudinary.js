import axios from 'axios'
import cloudinary from 'cloudinary/lib/cloudinary'

cloudinary.config({
    cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
    api_key: process.env.REACT_APP_CLOUDINARY_KEY,
    api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
})

const deleteImage = async public_id => {
    cloudinary.v2.uploader
        .destroy(public_id, function (error, result) {
            console.error(error)
        })
        .then(resp => console.log(resp))
        .catch(_err =>
            console.error('Something went wrong, please try again later.')
        )
}

const uploadFile = async file => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append(
        'upload_preset',
        process.env.REACT_APP_CLOUDINARY_PRESET_NAME
    )

    return await axios.post(
        'https://api.cloudinary.com/v1_1/dtgkkyqm6/auto/upload',
        formData
    )
}

export { deleteImage,uploadFile }
