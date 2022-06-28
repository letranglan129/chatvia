import { memo } from 'react'
import SimpleBar from 'simplebar-react'
import ForwardCheckedItem from './ForwardCheckedItem'
import 'simplebar/dist/simplebar.min.css'

function ForwardChecked({ list, onChoose }) {
    return (
        <SimpleBar style={{ height: '100px', flex: 1 }}>
            {list.map(item => (
                <ForwardCheckedItem
                    key={item._id}
                    avatar={item?.avatar}
                    name={item.name}
                    onClick={() => onChoose(item._id)}
                />
            ))}
        </SimpleBar>
    )
}

export default memo(ForwardChecked)
