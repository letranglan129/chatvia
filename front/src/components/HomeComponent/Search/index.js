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
	const debounce = useDebounce(searchKey, 200)

    useEffect(() => {
        onChange(debounce)
    }, [debounce])

    return (
        <div className='input-text'>
            <form onSubmit={handleSubmit(() => onSubmit(searchKey))}>
                <label
                    htmlFor={id}
                    className={
                        'overflow-hidden text-gray-800 dark:text-gray-200 flex items-stretch rounded-md w-full ' + className
                    }
                >
                    <button
                        type="submit"
                        className={`text-2xl flex items-center px-3 ${
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
                        className="text-sm pl-2 pr-8 py-2 w-full outline-none"
                        placeholder={placeholder}
                    />
                    {searchKey && (
                        <button
                            type="reset"
                            className="leading-0 px-2 flex items-center hover:bg-gray-600"
                            onClick={() => {
                                resetField(name)
                                setResultSearch(null)	
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
