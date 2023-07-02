import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { URI_REG } from '../../../constant'
import LinkPreview from '../components/LinkPreview'

const Links = () => {
    const { conversation } = useSelector((state) => state.currentChat)
    const [links, setLinks] = useState({})

    useEffect(() => {
        const links = JSON.parse(JSON.stringify(conversation.linkMessages))
            ?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
            ?.reduce((acc, msg) => {
                const date = new Date(msg.createdAt).toLocaleDateString()

                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(...msg?.text.match(URI_REG))
                return acc
            }, {})

        console.log(links)
        setLinks(links)
    }, [conversation])

    return (
        <>
            <div className="z-0 bg-white dark:bg-gray-600"></div>
            <div className="relative z-10 flex flex-1 flex-col bg-white dark:bg-gray-700">
                <SimpleBar style={{ flex: 1 }}>
                    {Object.entries(links).map(([key, list]) => {
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
                                    <div className="grid w-full grid-cols-1 gap-2">
                                        {list?.map((link) => (
                                            <LinkPreview
                                                key={new Date() * Math.random()}
                                                url={link}
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

export default Links
