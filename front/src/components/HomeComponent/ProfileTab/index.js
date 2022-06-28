import { useState } from 'react'
import Modal from 'react-modal'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import {
    CollapseListItem, CollapseContent, HeaderCollapse, Collapse
} from '../../CollapseComponent'
import Avatar from '../Avatar'
import File from '../File'
import TitleTab from '../TitleTab'
import Update from './Update'
Modal.setAppElement('#root')

function ProfileTab() {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const { user } = useSelector(state => state.auth.currentUser)
	const theme = useSelector(state => state.theme)

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`} >
            <div className="mb-4">
                <TitleTab>Thông tin của bạn</TitleTab>
            </div>

            <div className="relative pb-5 text-center border-b dark:border-gray-600">
                <div
                    className="relative inline-block"
                    onClick={() => setIsOpenModal(true)}
                >
                    <Avatar isNoDot={true}
                        className="object-cover w-24 h-24 mx-auto mb-4 rounded-full"
                        src={user.avatar}
                        alt=""
                    />
                </div>
                <p className="font-medium text-gray-700 line-clamp-1 dark:text-gray-200">
                    {user.name}
                </p>
                <div>
                    <span className="inline-block w-3 h-3 mr-2 border-4 border-green-500 rounded-full"></span>
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
                <Collapse>
                    <div className="mb-3">
                        <HeaderCollapse
                            contentFor="1"
                        >
                            Thông tin
                        </HeaderCollapse>

                        <CollapseContent id="1">
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
                        </CollapseContent>
                    </div>
                    <div className="mb-3">
                        <HeaderCollapse
                            contentFor="2"
                        >
                            File đã gửi
                        </HeaderCollapse>

                        <CollapseContent id="2">
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
                        </CollapseContent>
                    </div>
                </Collapse>
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
