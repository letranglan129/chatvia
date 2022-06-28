import { memo } from "react"
import GroupItem from "./GroupItem"
import SimpleBar from "simplebar-react"
import "simplebar/dist/simplebar.min.css"

function GroupItemList({arrGr}) {
    return (
		<SimpleBar style={{ height: "200px", flex: "1" }}>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
			<GroupItem
				avaGr='https://picsum.photos/seed/picsum/200/300'
				nameGr='IT'
				lastMess='ReactJS của Facebook khó vcl ra mà nó hay'
			/>
		</SimpleBar>
	)
}

export default memo(GroupItemList)
