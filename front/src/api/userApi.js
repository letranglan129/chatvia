import { loginError, loginStart, loginSuccess, logoutStart, logoutError, logoutSuccess } from '../redux/authSlice'
import axios from 'axios'
import { toast } from 'react-toastify'

const userRequest = {
	login: async (postUser, dispatch, navigate) => {
		dispatch(loginStart())
		try {
			const currentUser = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, postUser, {
				withCredentials: true,
			})
			dispatch(loginSuccess(currentUser.data))
			navigate('/')
		} catch (error) {

			dispatch(loginError())
		}
	},

	register: async (data, setError, navigate) => {
		toast("Đang xử lý yêu cầu đăng ký!!!")
		try {
			const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/register`, data, {
				withCredentials: true
			})

			if (res.data === null) {
				toast.dismiss()
				toast.success('Đăng kí thành công!!!')
				navigate('/login')
				return
			}

			res.data?.forEach((error) => {
				toast.dismiss()
				setError(error.field, { type: 'manual', message: error.msg })
			})

		} catch (error) {
			toast.dismiss()
			toast.error('Đã xảy ra lỗi. Đăng kí không thành công!!!')
		}
	},

	logout: async (dispatch) => {
		dispatch(logoutStart())
		try {
			await axios.get(`${process.env.REACT_APP_API_URL}/user/logout`, {
				withCredentials: true
			})
			dispatch(logoutSuccess())
		} catch (error) {
			dispatch(logoutError())
		}
	}
}

export const { login, register, logout } = userRequest
