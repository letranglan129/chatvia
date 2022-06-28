import { memo } from "react"
import Button from '../../Button'

function AttachFile() {
	return (
		<div className='icon'> 
			<div className="dark:text-gray-200">
				<Button>
					<label htmlFor='attach-file' className='flex'>
						<input type='file' multiple id='attach-file' name='attach-file' hidden />
						<ion-icon name='attach'></ion-icon>
					</label>
				</Button>
			</div>
		</div>
	)
}

export default memo(AttachFile)