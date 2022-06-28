function Switches({ id, condition, changeFunc }) {
	return (
		<div className='switches'>
			<input type='checkbox' id={id} onChange={changeFunc} hidden />
			<label
				htmlFor={id}
				className='w-10 h-10 rounded-full cursor-pointer select-none text-white bg-black dark:bg-white dark:text-black flex items-center justify-center text-2xl'>
				{condition.result ? <ion-icon name={condition.true}></ion-icon> : <ion-icon name={condition.false}></ion-icon>}
			</label>
		</div>
	)
}

export default Switches
