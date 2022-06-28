import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import { STATUS_NOTIFY } from '../../../constant'
import { readedNotify } from '../../../redux/notifySlice'
import TitleTab from '../TitleTab'
import NotifyItem from './NotifyItem'

function NotifyTab() {
    const { notifyList } = useSelector(state => state.notify)
	const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
	
    useEffect(() => {
		return () => dispatch(readedNotify())
    }, [])

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
            <div className="flex items-center justify-between mb-4">
                <TitleTab>Thông báo</TitleTab>
            </div>
            <SimpleBar style={{ height: '50px', flex: '1' }}>
                <div className="text-gray-900 dark:text-gray-200 font-medium text-lg">
                    <h2>Mới nhất</h2>
                </div>
                {notifyList.map((notify, index) => {
                    if (notify.status === STATUS_NOTIFY.sent)
                        return <NotifyItem key={index} notify={notify} />
                })}
                <div className="text-gray-900 dark:text-gray-200 font-medium text-lg">
                    <h2>Trước đó</h2>
                </div>
                {notifyList.map((notify, index) => {
                    if (notify.status !== STATUS_NOTIFY.sent)
                        return (
                            <NotifyItem key={index} notify={notify} isReaded />
                        )
                })}
            </SimpleBar>
        </div>
    )
}

export default memo(NotifyTab)
