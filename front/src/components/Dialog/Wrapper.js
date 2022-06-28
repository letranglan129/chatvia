import Modal from 'react-modal';

Modal.setAppElement('#root');
Modal.defaultStyles = {}
export const Dialog = ({ isOpen, children, ...props }) => {
    return (
        <Modal isOpen={isOpen}
            className='dialog-center'
            overlayClassName="overlay"
            {...props}>
            {children}
        </Modal>
    )
}
