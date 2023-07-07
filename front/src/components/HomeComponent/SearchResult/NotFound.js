function NotFound() {
	return (
        <div className="text-center">
            <p className="text-sm dark:text-gray-300 mb-2">
                Có thể bạn đang tìm kiếm ở mục khác<br></br>
                <button
                    onClick={() => {
                        document.querySelector('#sidebar_contact').click()
                    }}
                    type="button"
                    class="!hover:bg-blue-600 !focus:bg-blue-600 !active:bg-blue-700 inline-block rounded !bg-blue-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                    Tìm bạn
				</button>
				
                <button
                    onClick={() => {
                        document.querySelector('#sidebar_group').click()
                    }}
                    type="button"
                    class="mx-2 !hover:bg-blue-600 !focus:bg-blue-600 !active:bg-blue-700 inline-block rounded !bg-blue-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                    Tìm nhóm
                </button>
            </p>
            <img
                src="https://static.xx.fbcdn.net/rsrc.php/yT/r/SdDlDolvLZ5.svg"
                className="mx-auto mb-4 max-h-40"
                alt=""
            />
            <h2 className="text-xl font-semibold dark:text-gray-300">
                Chúng tôi không tìm thấy kết quả nào
            </h2>
            <p className="text-sm dark:text-gray-300">
                Đảm bảo tất cả các từ đều đúng chính tả hoặc thử từ khóa khác.
            </p>
        </div>
    )
}

export default NotFound
