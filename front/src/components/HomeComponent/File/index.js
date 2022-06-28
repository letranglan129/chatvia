import { memo } from 'react'
import { calcSize } from '../../../ulti'
import { FILE_TYPE } from '../../../constant'

const renderType = type => {
    const keys = Object.keys(FILE_TYPE)
    for (let i = 0; i < keys.length; i++) {
        if (FILE_TYPE[keys[i]].includes(type)) {
            return keys[i]
        }
    }

    return null
}

function File({
    type,
    name,
    size,
    link,
    disableShareButton,
    disableDeleteButton,
    disableDownloadButton,
}) {
    return (
        <div className="p-2 border">
            <div className="flex items-center justify-between">
                <div className="flex-shrink-0 w-10 h-10 mr-4 rounded-lg text-2xl flex items-center justify-center text-indigo-500 bg-indigo-800 bg-opacity-10 dark:bg-indigo-900 dark:bg-opacity-50">
                    {{
                        text: <ion-icon name="document-text"></ion-icon>,
                        image: <ion-icon name="image"></ion-icon>,
                        video: <ion-icon name="videocam"></ion-icon>,
                        sheet: <ion-icon name="grid"></ion-icon>,
                        presentation: <ion-icon name="newspaper"></ion-icon>,
                        audio: <ion-icon name="volume-high"></ion-icon>,
                        zip: <ion-icon name="library"></ion-icon>,
                    }[renderType(type)] || (
                        <ion-icon name="help-circle"></ion-icon>
                    )}
                </div>

                <div className="flex-1 line-clamp-1">
                    <p
                        className="text-sm font-medium line-clamp-1 text-gray-700 dark:text-gray-200"
                        title={name || 'Unknown'}
                    >
                        {name || 'Unknown'}
                    </p>
                    {size && <p className="text-sm text-gray-600 dark:text-gray-400">
                        {calcSize(size || 0)}
                    </p>}
                </div>

                <div className="">
                    {!disableDownloadButton && (
                        <a
                            download
                            href={link}
                            className="inline-block leading-8 text-center ml-2 text-lg w-8 h-8 text-gray-700 dark:text-gray-200"
                        >
                            <ion-icon name="cloud-download-outline"></ion-icon>
                        </a>
                    )}

                    {!disableDeleteButton && (
                        <a
                            href="/something"
                            className="inline-block leading-8 text-center ml-2 text-lg w-8 h-8 text-gray-700 dark:text-gray-200"
                        >
                            <ion-icon name="trash-outline"></ion-icon>
                        </a>
                    )}
                    {!disableShareButton && (
                        <a
                            href="/something"
                            className="inline-block leading-8 text-center ml-2 text-lg w-8 h-8 text-gray-700 dark:text-gray-200"
                        >
                            <ion-icon name="arrow-redo-outline"></ion-icon>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default memo(File)
