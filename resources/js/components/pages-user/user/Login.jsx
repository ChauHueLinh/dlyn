import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import { modalActions } from '~/components/store/modal-slice'
import { url } from '~/components/pages-user/user/Url'
import axiosAPI from '~/libs/axiosAPI'
import { useCookies } from "react-cookie";

export default function Login(props) {
    const dispatch = useDispatch()
    const status = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors] = useState({})
    const [cookies, setCookie]  = useCookies([])
    const [loading, setLoading] = useState()
    const [data, setData] = useState({
        email: '',
        password: '',
    })

    const openDialog = collection.name == props.modalKey && status

    const handler = (e) => {
        e.preventDefault()

        // setLoading(true)

        let form = new FormData()
            form.append('email', data.name ?? '')
            form.append('password', data.password ?? '')

        axiosAPI.post(url.login, form)
        .then((response) => {
            console.log(response.data.status);
            toast.dismiss()
            if (response.data.status == undefined) {
                setErrors(response.data.errors)
                setLoading(false)
            } else {
                if(response.data.status == true) {
                    toast.success(response.data.message)
                    props.callbackLogin({
                        id: response.data.result.id,
                        name: response.data.result.name,
                        accessToken: response.data.result.accessToken,
                    })
                    setCookie('userId', response.data.result.id)
                    setCookie('userName', response.data.result.name)
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
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
            wrapperClass='w-25 text-black'
        >
            <div className="text-black">
                <div className="text-center h4">Đăng nhập</div>
            </div>
            <Input
                id='email'
                name='email'
                type='text'
                labelName='Email'
                value={data?.email ?? ''}
                placeholder="Nhập email"
                isRequired={true}
                validate={errors}
                containerClass='w-full mb-4'
                onChange={(value) => {
                    setData({ ...data, name: value })
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
                containerClass='w-full m-1'
                onChange={(value) => {
                    setData({ ...data, password: value })
                }}
            />
            <div className="text-end mb-3 text-blue-600">Quên mật khẩu</div>
            <form onSubmit={handler}>
                {loading == true ?
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    :
                    <div className="flex w-full items-center justify-center">
                        <button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Đăng nhập </button>
                    </div>
                }
            </form>
            <div className="flex items-center justify-center mt-4">
                <div className="w-fit">Chưa có tài khoản?</div>
                <div
                    className="w-fit text-blue-600 ps-2 cursor-pointer"
                    onClick={() => {
                        close()
                        props.callbackOpenRegister()
                    }}
                >
                    Đăng ký ngay
                </div>
            </div>
        </Modal>
    )
}