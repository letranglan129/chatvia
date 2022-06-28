import { memo } from 'react'
import ButtonCircle from '../../Button/ButtonCircle'

function ImageInput() {
	return (
		<div className='icon'>
			<div className='dark:text-gray-200'>
				<ButtonCircle>
					<label htmlFor='img-file' className='flex'>
						<input type='file' accept='image/*' multiple id='img-file' name='img-file' hidden />
						<ion-icon name='image'></ion-icon>
					</label>
				</ButtonCircle>
			</div>
		</div>
	)
}

export default memo(ImageInput)
