import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import File from '../../HomeComponent/File'

const Files = () => {
    const { conversation } = useSelector((state) => state.currentChat)
    const [files, setFiles] = useState({})

    useEffect(() => {
        const files = JSON.parse(JSON.stringify(conversation.fileMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            ?.reduce((acc, msg) => {
                const date = new Date(msg.createdAt).toLocaleDateString()

                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(msg?.file)
                return acc
            }, {})

        console.log(files)
        setFiles(files)
    }, [conversation])

    return (
        <>
            <div className="z-0 bg-white dark:bg-gray-600"></div>
            <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-700">
                <SimpleBar style={{ flex: 1 }}>
                    {Object.entries(files).map(([key, list]) => {
                        const dateParts = key.split('/')
                        const day = dateParts[1]
                        const month = dateParts[0]
                        const year = dateParts[2]
                        return (
                            <Fragment key={key}>
                                <div>
                                    <h4 className="px-4 pt-4 pb-2 text-sm dark:text-gray-200">
                                        {`Ngày ${day} tháng ${month} năm ${year}`}
                                    </h4>
                                </div>
                                <div className="flex items-center justify-center py-2">
                                    <div className="grid grid-cols-1 gap-2 w-full">
                                        {list?.map((file) => (
                                            <File
                                                key={file.link}
                                                link={file.link}
                                                type={file.type}
                                                className="border-none px-5 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                name={file.name}
                                                size={file.size}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </SimpleBar>
            </div>
        </>
    )
}

export default Files
