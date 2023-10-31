import React, { useEffect } from 'react'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import { modalActions } from '~/components/store/modal-slice'
import { url } from '~/components/pages-user/user/Url'
import axiosAPI from '~/libs/axiosAPI'
import toast from 'react-hot-toast'
import { useCookies } from "react-cookie";

export default function Register(props) {
    const dispatch      = useDispatch()
    const status        = useSelector((state) => state.modal.isOpen)
    const collection    = useSelector((state) => state.modal.collection)
    
    const [cookies, setCookie]  = useCookies([])
    const [errors, setErrors]   = useState({})
    const [loading, setLoading] = useState(false)
    const [data, setData]       = useState({})

    const openDialog = collection.name == props.modalKey && status

    const handler = (e) => {
        e.preventDefault()

        setLoading(true)

        let form = new FormData()
            form.append('name', data.name ?? '')
            form.append('phone', data.phone ?? '')
            form.append('email', data.email ?? '')
            form.append('password', data.password ?? '')
            form.append('password_confirmation', data.password_confirmation ?? '')
            form.append('address', data.address ?? '')

        axiosAPI.post(url.register, form)
        .then((response) => {
            toast.dismiss()
            if (response.data.status == undefined) {
                setErrors(response.data.errors)
                setLoading(false)
            } else {
                if(response.data.status == true) {
                    toast.success(response.data.message)
                    props.callbackRegister({
                        accessToken: 'Bearer ' + response.data.result.accessToken,
                    })
                    setCookie('accessToken', 'Bearer ' + response.data.result.accessToken)
                    close()
                } else {
                    toast.error(response.data.message)
                }
                setLoading(false)
            }
        })
    }

    const close = () => {
        setData({})
        setErrors({})
        setLoading(false)
        dispatch(modalActions.close())
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
            wrapperClass='w-25 text-black z-1001'
        >
            <div className="text-black">
                <div className="text-center h4">Đăng ký</div>
            </div>
            <Input
                id='name'
                name='name'
                type='text'
                labelName='Tên'
                value={data?.name ?? ''}
                placeholder="Nhập tên"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, name: value })
                }}
            />
            <Input
                id='phone'
                name='phone'
                type='text'
                labelName='Số điện thoại'
                value={data?.phone ?? ''}
                placeholder="Nhập số điện thoại"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, phone: value })
                }}
            />
            <Input
                id='email'
                name='email'
                type='text'
                labelName='Email'
                value={data?.email ?? ''}
                placeholder="Nhập email"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, email: value })
                }}
            />
            <Input
                id='password'
                name='password'
                type='password'
                labelName='Mật khẩu'
                value={data?.password ?? ''}
                placeholder="Nhập email"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, password: value })
                }}
            />
            <Input
                id='password_confirmation'
                name='password_confirmation'
                type='password'
                labelName='Xác nhận mật khẩu'
                value={data?.password_confirmation ?? ''}
                placeholder="Nhập lại mật khẩu"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, password_confirmation: value })
                }}
            />
            <Input
                id='address'
                name='address'
                type='text'
                labelName='Địa chỉ'
                value={data?.address ?? ''}
                placeholder="Nhập địa chỉ"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-3'
                onChange={(value) => {
                    setData({ ...data, address: value })
                }}
            />
            <form onSubmit={handler}>
                {loading == true ?
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    :
                    <div className="flex w-full items-center justify-center">
                        <button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Đăng ký </button>
                    </div>
                }
            </form>
            <div className="flex items-center justify-center mt-4">
                <div className="w-fit">Bạn đã có tài khoản?</div>
                <div
                    className="w-fit text-blue-600 ps-2 cursor-pointer"
                    onClick={() => {
                        close()
                        props.callbackOpenLogin()
                    }}
                >
                    Đăng nhập ngay
                </div>
            </div>
        </Modal>
    )
}