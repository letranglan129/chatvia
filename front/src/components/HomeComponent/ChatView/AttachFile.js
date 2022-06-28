import { memo } from "react"
import ButtonCircle from "../ButtonCircle"

function AttachFile() {
	return (
		<div className='icon'> 
			<div className="dark:text-gray-200">
				<ButtonCircle>
					<label htmlFor='attach-file' className='flex'>
						<input type='file' multiple id='attach-file' name='attach-file' hidden />
						<ion-icon name='attach'></ion-icon>
					</label>
				</ButtonCircle>
			</div>
		</div>
	)
}

export default memo(AttachFile)