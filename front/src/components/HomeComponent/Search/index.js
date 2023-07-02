import { memo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDebounce } from '../../../hooks'

function Search({
    name,
    id,
    placeholder,
    className = '',
    setResultSearch,
    onSubmit = () => {},
    onChange = () => {},
}) {
    const { register, handleSubmit, resetField, watch } = useForm()
    const searchKey = watch(name)
    const debounce = useDebounce(searchKey, 300)

    useEffect(() => {
        onChange(debounce)
    }, [debounce])

    return (
        <div className="input-text">
            <form onSubmit={handleSubmit(() => onSubmit(searchKey))}>
                <label
                    htmlFor={id}
                    className={
                        'flex w-full items-stretch overflow-hidden rounded-md text-gray-800 dark:text-gray-200 ' +
                        className
                    }
                >
                    <button
                        type="submit"
                        className={`flex items-center px-3 text-2xl ${
                            searchKey ? 'hover:bg-gray-600' : ''
                        }`}
                    >
                        <ion-icon name="search-outline"></ion-icon>
                    </button>
                    <input
                        {...register(name)}
                        type="text"
                        id={id}
                        name={name}
                        className="w-full py-2 pl-2 pr-8 text-sm outline-none"
                        placeholder={placeholder}
                        onInput={(e) => {
                            if (e.target.value === '') {
                                onSubmit('')
                            }
                        }}
                    />
                    {searchKey && (
                        <button
                            type="reset"
                            className="flex items-center px-2 leading-0 hover:bg-gray-600"
                            onClick={() => {
                                resetField(name)
                                onSubmit('')
                            }}
                        >
                            <ion-icon name="close"></ion-icon>
                        </button>
                    )}
                </label>
            </form>
        </div>
    )
}

export default memo(Search)
