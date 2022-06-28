import { useState } from 'react';
import { memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCall } from '../../../redux/slice/dialog/callSlice';
import Button from '../../Button';
import Dialog from '../../Dialog';

function DialogCall() {
    const dispatch = useDispatch();
    const { call } = useSelector(state => state.callDialog);
    const closeModal = () => dispatch(toggleCall({ isShow: false }));

    return (
        <Dialog isOpen={call.isShow} onRequestClose={closeModal} className="dialog-center w-[400px]">
            <div className="py-20">
                <div>
                    <img
                        src="https://random.imagecdn.app/200/200"
                        alt=""
                        className="w-20 h-20 mx-auto rounded-full mb-4"
                    />
                    <h2 className="text-xl text-center text-gray-800 dark:text-gray-100 mb-2">Lê Trạng Lân</h2>
                    <p className="text-center text-gray-800 dark:text-gray-400 mb-4">
                        {
                            {
                                audio: 'Bắt đầu cuộc gọi thoại',
                                video: 'Bắt đầu cuộc gọi video',
                            }[call.type]
                        }
                    </p>
                </div>
                <div className="text-center">
                    <Button
                        circle={true}
                        className="call-btn btn-error p-4 leading-0 mx-4 text-lg text-white"
                        style={{ background: '#ef476f' }}
                        onClick={closeModal}
                    >
                        <ion-icon name="close-outline"></ion-icon>
                    </Button>
                    <Button
                        circle={true}
                        className="call-btn btn-success p-4 leading-0 mx-4 text-lg text-white"
                        style={{ background: '#06d6a0' }}
                    >
                        {
                            {
                                audio: <ion-icon name="call"></ion-icon>,
                                video: <ion-icon name="videocam"></ion-icon>,
                            }[call.type]
                        }
                    </Button>
                </div>
            </div>
        </Dialog>
    );
}

export default memo(DialogCall);
