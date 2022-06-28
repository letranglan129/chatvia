import React from 'react'
import { useSelector } from 'react-redux'
import Button from '../../Button'
import {
    Collapse,
    CollapseContent,
    HeaderCollapse,
} from '../../CollapseComponent'
import File from '../../HomeComponent/File'
import { Control, ControlItem } from '../components/Control'
import ImageVideo from '../components/ImageVideo'
import Info from '../components/Info'
import LinkPreview from '../components/LinkPreview'
import { useConversationInfo } from '../context/context'

const CollapseItem = ({ icon, children, className, ...props }) => {
    return (
        <div
            className={`flex items-center py-2 dark:text-gray-200 ${className}`}
            {...props}
        >
            {icon && <span className="inline-flex mr-2 text-2xl">{icon}</span>}
            <span className="text-15">{children}</span>
        </div>
    )
}

const Home = () => {
    const { conversation } = useSelector(state => state.currentChat)
    const { routes, history, pushPath } = useConversationInfo()

    return (
        <>
            <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-600">
                <div className="bg-white dark:bg-gray-700">
                    <Info
                        avatar="https://res.zaloapp.com/pc/avt_group/3_family.jpg"
                        name="Le Trang Lan"
                    ></Info>
                    <Control>
                        <ControlItem
                            icon={
                                <ion-icon name="notifications-outline"></ion-icon>
                            }
                        >
                            Tắt thông báo
                        </ControlItem>
                    </Control>
                </div>
                <Collapse showAll={true}>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="1"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            Thành viên nhóm
                        </HeaderCollapse>
                        <CollapseContent id="1" className="!rounded-none !p-0">
                            <CollapseItem
                                onClick={() => pushPath('members')}
                                className="dark:!bg-gray-700 dark:hover:!bg-gray-600 !bg-white px-5"
                                icon={
                                    <ion-icon name="people-outline"></ion-icon>
                                }
                            >
                                {conversation.members.length} Thành viên
                            </CollapseItem>
                        </CollapseContent>
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="2"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            Ảnh/Video
                        </HeaderCollapse>
                        <CollapseContent
                            id="2"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            <div
                                className="flex items-center py-2"
                                // onClick={() => pushPath('media')}
                            >
                                <div className="grid grid-cols-4 gap-2">
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />
                                    <ImageVideo src="https://res.zaloapp.com/pc/avt_group/3_family.jpg" />

                                    <div className="my-2 col-span-4">
                                        <Button
                                            small={true}
                                            className="w-full py-1 text-sm font-medium bg-gray-200 dark:bg-slate-600 dark:text-gray-100 rounded-md dark:hover:bg-gray-500 hover:bg-gray-300"
                                        >
                                            Xem tất cả
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CollapseContent>
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="3"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            File
                        </HeaderCollapse>
                        <CollapseContent
                            id="3"
                            className="!rounded-none dark:!bg-gray-700 !bg-white px-0"
                        >
                            <div
                                className="flex items-center py-2"
                                // onClick={() => pushPath('media')}
                            >
                                <div className="w-full">
                                    <File
                                        type="video"
                                        className="px-5 border-none hover:bg-gray-200 dark:hover:bg-gray-600"
                                        name="Video hai`"
                                        size="123123"
                                    />
                                    <File
                                        type="video"
                                        className="px-5 border-none hover:bg-gray-200 dark:hover:bg-gray-600"
                                        name="Video hai`"
                                        size="123123"
                                    />
                                    <File
                                        type="video"
                                        className="px-5 border-none hover:bg-gray-200 dark:hover:bg-gray-600"
                                        name="Video hai`"
                                        size="123123"
                                    />

                                    <div className="px-5 my-2">
                                        <Button
                                            small={true}
                                            className="w-full py-1 text-sm font-medium bg-gray-200 dark:bg-slate-600 dark:text-gray-100 rounded-md dark:hover:bg-gray-500 hover:bg-gray-300"
                                        >
                                            Xem tất cả
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CollapseContent>
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="4"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            Link
                        </HeaderCollapse>
                        <CollapseContent
                            id="4"
                            className="!rounded-none dark:!bg-gray-700 !bg-white !px-0"
                        >
                            <div
                                className="flex items-center py-2"
                                // onClick={() => pushPath('media')}
                            >
                                <div className="w-full">
                                    <LinkPreview />
                                    <div className="px-5 my-2">
                                        <Button
                                            small={true}
                                            className="w-full py-1 text-sm font-medium bg-gray-200 dark:bg-slate-600 dark:text-gray-100 rounded-md dark:hover:bg-gray-500 hover:bg-gray-300"
                                        >
                                            Xem tất cả
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CollapseContent>
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="5"
                            className="!rounded-none dark:!bg-gray-700 !bg-white"
                        >
                            Thiết lập bảo mật
                        </HeaderCollapse>
                        <CollapseContent
                            id="5"
                            className="!rounded-none dark:!bg-gray-700 !p-0"
                        >
                            <CollapseItem
                                onClick={() => pushPath('members')}
                                className="dark:!bg-gray-700 dark:hover:!bg-gray-600 !bg-white px-5"
                                icon={
                                    <ion-icon name="trash-outline"></ion-icon>
                                }
                            >
                                Xóa cuộc trò chuyện
                            </CollapseItem>
                            <CollapseItem
                                onClick={() => pushPath('members')}
                                className="dark:!bg-gray-700 dark:hover:!bg-gray-600 !bg-white px-5"
                                icon={
                                    <ion-icon name="log-out-outline"></ion-icon>
                                }
                            >
                                Rời khỏi nhóm
                            </CollapseItem>
                        </CollapseContent>
                    </div>
                </Collapse>
            </div>
        </>
    )
}

export default Home
