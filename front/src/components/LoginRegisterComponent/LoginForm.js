import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { MIN_LENGTH_PASSWORD, EMAIL_REG } from '../../constant'
import { login } from '../../ulti/userApi'
import Button from '../Button'

export default function LoginForm() {
    const theme = useSelector(state => state.theme)
    const { isFetching } = useSelector(state => state.auth.currentUser)
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitForm = data => {
        login(data, dispatch, navigate)
    }

    const getButtonSubmitStatus = () => {
        return isFetching ? (
            <div
                style={{ width: '24px', height: '24px', color: '#fff' }}
                className="circle-loading"
            ></div>
        ) : (
            'Đăng nhập'
        )
    }

    return (
        <div
            className={`login-register-form ${
                theme.colorTheme === 'light' ? 'bg-light' : 'bg-dark'
            }`}
        >
            <form onSubmit={handleSubmit(submitForm)}>
                <div className="mb-4">
                    <Input
                        label="email"
                        type="email"
                        register={register}
                        title="Email"
                        placeholder="Email"
                        optionForm={{
                            required: 'Vui lòng điền vào Email!!!',
                            pattern: {
                                value: EMAIL_REG,
                                message: 'Định dạng Email không chính xác!!!',
                            },
                        }}
                    >
                        <ion-icon name="person"></ion-icon>
                    </Input>
                    {errors.email && (
                        <p className="text-red-500 text-13 pt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <Input
                        label="password"
                        type="password"
                        register={register}
                        title="Mật khẩu"
                        placeholder="Mật khẩu"
                        optionForm={{
                            required: 'Vui lòng điền vào Mật khẩu!!!',
                            minLength: {
                                value: MIN_LENGTH_PASSWORD,
                                message: `Mật khẩu tối thiểu ${MIN_LENGTH_PASSWORD} kí tự!!!`,
                            },
                        }}
                    >
                        <ion-icon name="lock-closed"></ion-icon>
                    </Input>
                    {errors.password && (
                        <p className="text-red-500 text-13 pt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <label
                    htmlFor="remember-me"
                    className="flex items-center select-none cursor-pointer mb-5"
                >
                    <input
                        type="checkbox"
                        id="remember-me"
                        className="w-4 h-4 bg-blue-600 checked:bg-blue-600 checked:border-transparent"
                    />
                    <p className="text-gray-700 dark:text-gray-300 text-sm ml-3">
                        Ghi nhớ đăng nhập
                    </p>
                </label>
                <Button
                    circle={true}
                    type="sumbit"
                    disabled={isFetching}
                    className="!h-10 !w-full py-2 !rounded-md text-gray-100 hover:bg-indigo-500 bg-indigo-700"
                >
                    {getButtonSubmitStatus()}
                </Button>
            </form>
        </div>
    )
}
