import Microlink from '@microlink/react'
import parse from 'html-react-parser'
import { memo, useEffect, useRef, useState } from 'react'
import { URL_REG } from '../../../constant'
import { useDebounce } from '../../../hooks'
import File from '../File'
import { ImageGroup } from '../ImageMessage'

const MessageText = memo(
    ({
        message,
        disableLink = false,
        contentEditable,
        textState = () => {},
    }) => {
        const url = message.match(URL_REG)
        const [text, setText] = useState(message)
        const debounceText = useDebounce(text, 300)
        const editor = useRef()

        useEffect(() => {
            textState(debounceText)
        }, [debounceText])

        const renderMessage = () => {
            if (url?.length > 0)
                return (
                    <a
                        href={url[0]}
                        target="_blank"
                        className="max-w-xs block hover:underline cursor-pointer"
                    >
                        {parse(message || '')}
                    </a>
                )
            if (contentEditable)
                return (
                    <p  
                        ref={editor}
                        className="outline-none"
                        onInput={e => setText(e?.currentTarget.innerHTML)}
                        contentEditable={contentEditable}
                        suppressContentEditableWarning={contentEditable}
                    >
                        {parse(message || '')}
                    </p>
                )

            return parse(message || '')
        }

        useEffect(() => {
            if(editor.current) {
                editor.current.scrollIntoView({block: 'end'})
                editor.current.focus()
                window.getSelection().selectAllChildren(editor.current)
                window.getSelection().collapseToEnd()
            }
        }, [contentEditable])

        return (
            <>
                <div className="break-all text-15">
                    {renderMessage()}
                </div>
                {url?.length > 0 && !disableLink && (
                    <div className="my-3">
                        <Microlink
                            url={url[0]}
                            size="large"
                            media={['image', 'logo']}
                        />
                    </div>
                )}
            </>
        )
    }
)

function TypeMessage({
    messInfo,
    type,
    isTiny = false,
    contentEditable,
    textState,
}) {
    return ({
        text: (
            <MessageText
                message={messInfo?.message}
                disableLink={isTiny}
                contentEditable={contentEditable}
                textState={textState}
            />
        ),
        file: (
            <div className="bg-gray-100 dark:bg-gray-900 list-none flex-1">
                <File
                    type={messInfo?.file?.type}
                    name={messInfo?.file?.name}
                    size={messInfo?.file?.size}
                    link={messInfo?.file?.link}
                    disableShareButton={messInfo?.disableShareButton}
                    disableDeleteButton={messInfo?.disableDeleteButton}
                />
            </div>
        ),
        imageGroup: isTiny ? (
            <File
                name={`${messInfo?.listImg?.length} Hình ảnh`}
                disableShareButton={true}
                disableDeleteButton={true}
                disableDownloadButton={true}
                type="jpg"
            />
        ) : (
            <ImageGroup listImg={messInfo?.listImg} />
        ),
    }[type] || null)
}

export default memo(TypeMessage)
