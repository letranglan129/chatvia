import { useCallback, useState } from 'react'

const useCollapse = (initOpen = [], isShowAll) => {
    const [open, setOpen] = useState(initOpen)
    
    const toggleCollapse = useCallback((index) => {
		setOpen((open) => {
			let isOpen = open.includes(index)

			if (isOpen) {
				return open.filter((item) => item !== index)
			} else {
				return [...open, index]
			}
		})
	}, [])
    
    return [open, toggleCollapse, isShowAll]
}

export default useCollapse