import { useState } from 'react'
import Modal from 'react-modal'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import {
    CollapseListItem, CollapseWrap, HeaderCollapse
} from '../../CollapseComponent'
import Avatar from '../Avatar'
import File from '../File'
import TitleTab from '../TitleTab'
import Update from './Update'
Modal.setAppElement('#root')

function ProfileTab() {
    const [open, setOpen] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const { user } = useSelector(state => state.auth.currentUser)
	const theme = useSelector(state => state.theme)

    // Toggle collapse list
    const toggleCollapse = index => {
        setOpen(open => {
            let isOpen = open.includes(index)

            if (isOpen) {
                return open.filter(item => item !== index)
            } else {
                return [...open, index]
            }
        })
    }

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
            <div className="mb-4">
                <TitleTab>Thông tin của bạn</TitleTab>
            </div>

            <div className="text-center pb-5 border-b dark:border-gray-600 relative">
                <div
                    className="relative inline-block"
                    onClick={() => setIsOpenModal(true)}
                >
                    <Avatar.NotDot
                        className="rounded-full w-24 h-24 mx-auto mb-4"
                        src={user.avatar}
                        alt=""
                    />
                </div>
                <p className="font-medium line-clamp-1 text-gray-700 dark:text-gray-200">
                    {user.name}
                </p>
                <div>
                    <span className="inline-block w-3 h-3 border-4 border-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Active
                    </span>
                </div>
            </div>

            <div className="my-5">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    If several languages coalesce, the grammar of the resulting
                    language is more simple and regular than that of the
                    individual.
                </p>
            </div>

            <SimpleBar style={{ height: '200px', flex: '1' }}>
                <div className="mb-3">
                    <HeaderCollapse
                        func={toggleCollapse}
                        contentFor="1"
                        arrCheck={open}
                    >
                        Thông tin
                    </HeaderCollapse>

                    <CollapseWrap id="1" arrCheck={open}>
                        <CollapseListItem title="Tên" content="Lê Trạng Lân" />
                        <CollapseListItem
                            title="Email"
                            content="letranglan129@gmail.com"
                        />
                        <CollapseListItem
                            title="Số điện thoại"
                            content="0393673245"
                        />
                        <CollapseListItem
                            title="Ngày sinh"
                            content="22/09/2002"
                        />
                    </CollapseWrap>
                </div>
                <div className="mb-3">
                    <HeaderCollapse
                        func={toggleCollapse}
                        contentFor="2"
                        arrCheck={open}
                    >
                        File đã gửi
                    </HeaderCollapse>

                    <CollapseWrap id="2" arrCheck={open}>
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className="my-2">
                                    <File
                                        type="image"
                                        name="Tên"
                                        size="12.5MB"
                                    />
                                </div>
                            ))}
                    </CollapseWrap>
                </div>
            </SimpleBar>

            <Update
                isOpen={isOpenModal}
                onRequestClose={() => setIsOpenModal(false)}
            />
        </div>
    )
}

// <File
// type="text"
// name="Email"
// size="12.5MB"
// />
// <File
// type="zip"
// name="Số điện thoại"
// size="12.5MB"
// />
// <File
// type="text"
// name="Ngày sinh"
// size="12.5MB"
// />

export default ProfileTab
