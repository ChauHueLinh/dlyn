import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { modalActions } from '~/components/store/modal-slice'
import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import { url } from '~/components/pages/product/Url'

export default function Delete(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const loading    = useSelector((state) => state.modal.isLoading)
    const collection = useSelector((state) => state.modal.collection)
    
    const openDialog = collection.name == props.modalKey && status
    
    const handler = (e) => {
        e.preventDefault()

        dispatch(modalActions.loading(true))
        
        let form = new FormData()
            form.append('id', props.data.id)
            form.append('_method', 'DELETE')

        axiosAPI.post(url.destroy, form)
        .then((res) => {
            toast.dismiss()
            if (res.data.status == true) {
                toast.success(res.data.message)
                dispatch(modalActions.loadingTable(true))
                close()
            } else if (res.data.status == false) {
                toast.error(res.data.message)
                dispatch(modalActions.loading(false))
            }
        })
    }

    const close = () => {
        dispatch(modalActions.close())
        props.callback()
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
            wrapperClass='flex items-start justify-center p-4 text-center'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 text-center"> { props.data.name } </h2>
            <p className="mt-2 text-gray-700 text-center"> Bạn có chắc chắn muốn xóa sản phẩm này không? </p>

            <div className="flex items-center justify-center mt-4 space-x-4">
                <button type="button" onClick={() => close()} className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                    Huỷ
                </button>
                {loading ? (
                    <div className="flex items-center justify-content-around" style={{width: '100px'}}>
                        <div className="spinner-grow text-success" style={{height: '10px', width: '10px'}}>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success" style={{height: '10px', width: '10px'}}>
                            <span className="sr-only">Loading...</span>
                        </div>
                        <div className="spinner-grow text-success" style={{height: '10px', width: '10px'}}>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <button onClick={handler} type="button" className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                        Đồng ý
                    </button>
                )}
            </div>
        </Modal>
    )
}
