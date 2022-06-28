import {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

const Header = memo(
    forwardRef(({ active, onClick, label, headerItemClassName }, ref) => {
        return (
            <li
                ref={active === label ? ref : null}
                className={`${
                    active === label ? 'active' : ''
                } ${headerItemClassName}`}
                onClick={() => onClick(label)}
            >
                {label}
            </li>
        )
    })
)

export default function Tabs({
    children,
    headerItemClassName = 'tab-header-item',
    containerClassName = 'tabs',
    contentClassName = 'tab-content',
    headerClassName = 'tab-header',
}) {
    const lineRef = useRef()
    const [activeTab, setActiveTab] = useState(children[0].props.label)
    const [lineStyle, setLineStyle] = useState({
        left: lineRef.current?.offsetLeft,
        width: lineRef.current?.offsetWidth,
    })

    const handleClick = useCallback(label => setActiveTab(label), [])

    useEffect(() => {
        setLineStyle({
            left: lineRef.current?.offsetLeft,
            width: lineRef.current?.offsetWidth,
        })
    }, [activeTab])

    return (
        <div className={containerClassName}>
            <ul className={headerClassName}>
                {children.map((child, index) => {
                    const { label } = child.props
                    if (label)
                        return (
                            <Header
                                headerItemClassName={headerItemClassName}
                                ref={lineRef}
                                active={activeTab}
                                onClick={handleClick}
                                label={label}
                                key={index}
                            />
                        )
                })}
                <div
                    className="line"
                    style={{
                        left: `${lineStyle.left}px`,
                        width: `${lineStyle.width}px`,
                    }}
                ></div>
            </ul>
            <div className={contentClassName}>
                {children.map((child, index) => {
                    if (child.props?.alwayShow) return child.props.children
                    if (child.props?.label !== activeTab) return null
                    return child.props.children
                })}
            </div>
        </div>
    )
}
