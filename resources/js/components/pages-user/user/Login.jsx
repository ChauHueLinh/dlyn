import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import Modal from '~/components/molecules/Modal'
import {modalActions} from '~/components/store/modal-slice'

export default function Login(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]         = useState({})

    const openDialog = collection.name == props.modalKey && status

    const close = () => {
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
        setCartItem({})
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-25'
            btnClose={true}
            containerStyle={{height: '100vh'}}
        >
            <div className="">
                <div className="text-center">Đăng nhập</div>
            </div>
        </Modal>
    )
}