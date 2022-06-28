import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { logout } from '../../../ulti/userApi'
import { useCollapse } from '../../../hooks'
import { Collapse, CollapseContent, HeaderCollapse } from '../../CollapseComponent'
import AvatarStatusLg from '../AvatarStatusLg'
import TitleTab from '../TitleTab'
import Help from './Help'
import Language from './Language'
import Privacy from './Privacy'
import Security from './Security'
import Button from '../../Button'

function SettingTab() {
    const { user } = useSelector(state => state.auth.currentUser)
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()

    // Click to logout
    const handleLogout = () => {
        logout(dispatch)
    }

    return (
        <div className={`tab-container ${theme.isHidden ? '' : 'maxWidth'}`}>
            <div className="flex items-center justify-between mb-4">
                <TitleTab>Cài đặt</TitleTab>
                <Button
                    circle={true}
                    primary={true}
                    className="!w-8 !h-8 !p-0"
                    onClick={handleLogout}
                >
                    <ion-icon name="log-out-outline"></ion-icon>
                </Button>
            </div>

            <AvatarStatusLg src={user.avatar} name={user?.name} />

            <SimpleBar style={{ height: '200px', flex: '1' }}>
                <Collapse>
                    <div className="mb-3">
                        <HeaderCollapse
                            
                            contentFor="1"
                        
                        >
                            Quyền riêng tư
                        </HeaderCollapse>
    
                        <CollapseContent id="1">
                            <Privacy />
                        </CollapseContent>
                    </div>
                    <div className="mb-3">
                        <HeaderCollapse
                            
                            contentFor="2"
                        
                        >
                            Bảo mật
                        </HeaderCollapse>
    
                        <CollapseContent id="2">
                            <Security />
                        </CollapseContent>
                    </div>
    
                    <div className="mb-3">
                        <HeaderCollapse
                            
                            contentFor="3"
                        
                        >
                            Trợ giúp và Hỗ trợ
                        </HeaderCollapse>
    
                        <CollapseContent id="3">
                            <Help />
                        </CollapseContent>
                    </div>
                    <div className="mb-3">
                        <HeaderCollapse
                            
                            contentFor="4"
                        
                        >
                            Ngôn ngữ
                        </HeaderCollapse>
    
                        <CollapseContent id="4" className='px-0'>
                            <div className='px-5'>
                            <Language />
                            </div>
                        </CollapseContent>
                    </div>
                </Collapse>
            </SimpleBar>
        </div>
    )
}

export default SettingTab
