import jwtDecode from 'jwt-decode'
import axios from 'axios'
import { store } from '../redux/store'
import { loginSuccess, loginError } from '../redux/slice/authSlice'
import { logout } from './userApi'

const { dispatch } = store

const createAxios = () => {
	const newInstance = axios.create({
		baseURL: `${process.env.REACT_APP_API_URL}`,
		withCredentials: true,
	})
	newInstance.interceptors.request.use(
		async (config) => {
			const { user } = store.getState().auth.currentUser
			const date = new Date()
			const decodeToken = jwtDecode(user?.accessToken)

			if (decodeToken?.exp < date.getTime() / 1000) {
				try {
					var res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh`, '', {
						headers: { token: user?.accessToken },
						withCredentials: true
					})
					
					if (res.data.accessToken)
						dispatch(loginSuccess({ ...user, accessToken: res.data.accessToken }))
				} catch (err) {
					dispatch(loginError())
					logout(dispatch)
				}
			}

			config.headers.token = res ? res.data.accessToken : user.accessToken
			return config
		},
		(err) => dispatch(loginError())
	)
	return newInstance
}

export default createAxios