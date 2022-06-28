export default function ButtonSubmit({ children, onClick, type }) {
	return (
		<button type={type} className='w-full py-2 rounded-md text-gray-100 bg-indigo-500 hover:bg-indigo-700' onClick={onClick}>
			{children}
		</button>
	)
}
