import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import createAxios from '../../api/createInstance'
import { register as registerReq } from '../../api/userApi'
import { EMAIL_REG, MIN_LENGTH_PASSWORD } from '../../constant'
import ButtonSubmit from './ButtonSubmit'
import Input from './Input'

export default function RegisterForm() {
	const theme = useSelector(state => state.theme)
	const navigate = useNavigate()
	const {
		register,
		formState: { errors },
		getValues,
		handleSubmit,
		setError,
	} = useForm()
	const axios = createAxios()

	const onSubmit = (data) => {
		registerReq(data, setError, navigate)
	}

	return (
		<div className={`login-register-form ${theme.colorTheme === 'light' ? 'bg-light' : 'bg-dark'}`}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='mb-4'>
					<Input
						label='name'
						type='text'
						register={register}
						placeholder='Tên người dùng'
						title='Tên người dùng'
						optionForm={{ required: 'Vui lòng điền vào Tên người dùng!!!' }}>
						<ion-icon name='person'></ion-icon>
					</Input>
					{errors.name && <p className='text-red-500 text-13 pt-1'>{errors.name.message}</p>}
				</div>
				<div className='mb-4'>
					<Input
						label='email'
						type='email'
						register={register}
						title='Email'
						placeholder='Email'
						optionForm={{
							required: 'Vui lòng điền vào Email!!!',
							pattern: {
								value: EMAIL_REG,
								message: 'Định dạng Email không chính xác!!!',
							},
						}}>
						<ion-icon name='person'></ion-icon>
					</Input>
					{errors.email && <p className='text-red-500 text-13 pt-1'>{errors.email.message}</p>}
				</div>
				<div className='mb-4'>
					<Input
						label='password'
						type='password'
						register={register}
						title='Mật khẩu'
						placeholder='Mật khẩu'
						optionForm={{
							required: 'Vui lòng điền vào Mật khẩu!!!',
							minLength: {
								value: MIN_LENGTH_PASSWORD,
								message: `Mật khẩu tối thiểu ${MIN_LENGTH_PASSWORD} kí tự!!!`,
							},
						}}>
						<ion-icon name='lock-closed'></ion-icon>
					</Input>
					{errors.password && <p className='text-red-500 text-13 pt-1'>{errors.password.message}</p>}
				</div>
				<div className='mb-4'>
					<Input
						label='repassword'
						type='password'
						register={register}
						placeholder='Nhập lại mật khẩu'
						title='Nhập lại mật khẩu'
						optionForm={{
							required: 'Vui lòng điền vào Nhập lại mật khẩu!!!',
							validate: {
								comparePassword: (value) => {
									const { password } = getValues()
									return password === value || 'Nhập lại mật khẩu không khớp!!!'
								},
							},
						}}>
						<ion-icon name='lock-closed'></ion-icon>
					</Input>
					{errors.repassword && <p className='text-red-500 text-13 pt-1'>{errors.repassword.message}</p>}
				</div>

				<ButtonSubmit type='submit'>Đăng ký</ButtonSubmit>
			</form>
			<div>
				<p className='text-13 text-center mt-5 text-gray-700 dark:text-gray-300'>
					By registering you agree to the Chatvia <span className='text-indigo-500'>Terms of Use</span>
				</p>
			</div>
		</div>
	)
}
