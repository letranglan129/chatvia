import { memo } from "react"

function ButtonCircle({ children, clickFunc, title, style, className }) {
	return (
		<div className='icon'>
			<div
				style={style}
				className={`button-toggle p-2 text-xl flex items-center justify-center cursor-pointer rounded-full ${className}`}
				onClick={clickFunc}
				title={title}>
				{children}
			</div>
		</div>
	)
}

export default memo(ButtonCircle)
