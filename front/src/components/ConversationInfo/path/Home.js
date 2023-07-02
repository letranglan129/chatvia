import React, { useEffect, useState } from 'react'
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
import { socket } from '../../../socket'
import {
    LIMIT_FILE_SHOW,
    LIMIT_IMAGE_SHOW,
    LIMIT_LINK_SHOW,
    URI_REG,
} from '../../../constant'

const CollapseItem = ({ icon, children, className, ...props }) => {
    return (
        <div
            className={`flex items-center py-2 dark:text-gray-200 ${className}`}
            {...props}
        >
            {icon && <span className="mr-2 inline-flex text-2xl">{icon}</span>}
            <span className="text-15">{children}</span>
        </div>
    )
}

const Home = () => {
    const { conversation } = useSelector((state) => state.currentChat)
    const { user } = useSelector((state) => state.auth.currentUser)
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([])
    const [links, setLinks] = useState([])
    const { routes, history, pushPath } = useConversationInfo()

    useEffect(() => {
        const images = JSON.parse(JSON.stringify(conversation.imageMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            ?.reduce((acc, msg) => {
                acc.push(...msg?.imageGroup)
                return acc
            }, [])

        const files = JSON.parse(JSON.stringify(conversation.fileMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            ?.reduce((acc, msg) => {
                acc.push(msg?.file)
                return acc
            }, [])

        const links = JSON.parse(JSON.stringify(conversation.linkMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            .reduce((acc, msg) => {
                acc.push(...msg?.text.match(URI_REG))
                return acc
            }, [])

        setImages(images.slice(0, Math.min(images.length, LIMIT_IMAGE_SHOW)))
        setFiles(files.slice(0, Math.min(files.length, LIMIT_FILE_SHOW)))
        setLinks(links.slice(0, Math.min(links.length, LIMIT_LINK_SHOW)))
    }, [conversation])

    return (
        <>
            <div className="flex flex-1 flex-col bg-gray-100 dark:bg-gray-600">
                <div className="bg-white dark:bg-gray-700">
                    <Info
                        avatar={conversation.avatar}
                        name={conversation.name}
                    ></Info>
                    <Control>
                        {/* <ControlItem
                            icon={
                                <ion-icon name="notifications-outline"></ion-icon>
                            }
                        >
                            Tắt thông báo
                        </ControlItem> */}
                    </Control>
                </div>
                <Collapse showAll={true}>
                    {conversation.type === 'GROUP' && (
                        <div className="mt-[6px]">
                            <HeaderCollapse
                                contentFor="1"
                                className="!rounded-none !bg-white dark:!bg-gray-700"
                            >
                                Thành viên nhóm
                            </HeaderCollapse>
                            <CollapseContent
                                id="1"
                                className="!rounded-none !p-0"
                            >
                                <CollapseItem
                                    onClick={() => pushPath('members')}
                                    className="!bg-white px-5 dark:!bg-gray-700 dark:hover:!bg-gray-600"
                                    icon={
                                        <ion-icon name="people-outline"></ion-icon>
                                    }
                                >
                                    {conversation?.members?.length} Thành viên
                                </CollapseItem>
                            </CollapseContent>
                        </div>
                    )}
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="2"
                            className="!rounded-none !bg-white dark:!bg-gray-700"
                        >
                            Ảnh/Video
                        </HeaderCollapse>
                        {conversation && images.length > 0 && (
                            <CollapseContent
                                id="2"
                                className="!rounded-none !bg-white dark:!bg-gray-700"
                            >
                                <div className="flex items-center py-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        {images?.map((image) => (
                                            <ImageVideo
                                                src={image}
                                                key={image}
                                            />
                                        ))}

                                        <div className="col-span-4 my-2">
                                            <Button
                                                onClick={() =>
                                                    pushPath('images')
                                                }
                                                small={true}
                                                className="w-full rounded-md bg-gray-200 py-1 text-sm font-medium hover:bg-gray-300 dark:bg-slate-600 dark:text-gray-100 dark:hover:bg-gray-500"
                                            >
                                                Xem tất cả
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CollapseContent>
                        )}
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="3"
                            className="!rounded-none !bg-white dark:!bg-gray-700"
                        >
                            File
                        </HeaderCollapse>
                        {conversation && files.length > 0 && (
                            <CollapseContent
                                id="3"
                                className="!rounded-none !bg-white px-0 dark:!bg-gray-700"
                            >
                                <div className="flex items-center py-2">
                                    <div className="w-full">
                                        {files?.map((file) => (
                                            <File
                                                key={file.link}
                                                link={file.link}
                                                type={file.type}
                                                className="border-none px-5 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                name={file.name}
                                                size={file.size}
                                            />
                                        ))}
                                        <div className="my-2 px-5">
                                            <Button
                                                onClick={() =>
                                                    pushPath('files')
                                                }
                                                small={true}
                                                className="w-full rounded-md bg-gray-200 py-1 text-sm font-medium hover:bg-gray-300 dark:bg-slate-600 dark:text-gray-100 dark:hover:bg-gray-500"
                                            >
                                                Xem tất cả
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CollapseContent>
                        )}
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="4"
                            className="!rounded-none !bg-white dark:!bg-gray-700"
                        >
                            Link
                        </HeaderCollapse>
                        {conversation && links.length > 0 && (
                            <CollapseContent
                                id="4"
                                className="!rounded-none !bg-white !px-0 dark:!bg-gray-700"
                            >
                                <div className="flex items-center py-2">
                                    <div className="w-full">
                                        {links?.map((link) => (
                                            <LinkPreview
                                                key={new Date() * Math.random()}
                                                url={link}
                                            />
                                        ))}
                                        <div className="my-2 px-5">
                                            <Button
                                                onClick={() =>
                                                    pushPath('links')
                                                }
                                                small={true}
                                                className="w-full rounded-md bg-gray-200 py-1 text-sm font-medium hover:bg-gray-300 dark:bg-slate-600 dark:text-gray-100 dark:hover:bg-gray-500"
                                            >
                                                Xem tất cả
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CollapseContent>
                        )}
                    </div>
                    <div className="mt-[6px]">
                        <HeaderCollapse
                            contentFor="5"
                            className="!rounded-none !bg-white dark:!bg-gray-700"
                        >
                            Thiết lập bảo mật
                        </HeaderCollapse>
                        <CollapseContent
                            id="5"
                            className="!rounded-none !p-0 dark:!bg-gray-700"
                        >
                            <CollapseItem
                                onClick={() => {
                                    socket.emit('deleteHistoryConversation', {
                                        conversationId: conversation._id,
                                        userId: user._id,
                                    })
                                }}
                                className="!bg-white px-5 dark:!bg-gray-700 dark:hover:!bg-gray-600"
                                icon={
                                    <ion-icon name="trash-outline"></ion-icon>
                                }
                            >
                                Xóa cuộc trò chuyện
                            </CollapseItem>
                            {conversation.type === 'GROUP' ? (
                                <>
                                    <CollapseItem
                                        onClick={() => {
                                            socket.emit('outGroup', {
                                                conversationId:
                                                    conversation._id,
                                            })
                                        }}
                                        className="!bg-white px-5 dark:!bg-gray-700 dark:hover:!bg-gray-600"
                                        icon={
                                            <ion-icon name="log-out-outline"></ion-icon>
                                        }
                                    >
                                        Rời khỏi nhóm
                                    </CollapseItem>
                                </>
                            ) : null}
                        </CollapseContent>
                    </div>
                </Collapse>
            </div>
        </>
    )
}

export default Home
