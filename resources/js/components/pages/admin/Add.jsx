import React from 'react'
import toast from 'react-hot-toast'

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'
import UploadFile from '~/components/molecules/UploadFile'

import {url} from '~/components/pages/admin/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Add(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]                       = useState({})
    const [loading, setLoading]                     = useState(false)
    const [previewMainImage, setPreviewMainImage]   = useState(false)
    const [errorsMainImage , setErrorsMainImage]    = useState([])
    const [data, setData]                           = useState({
        status: 1,
    })

    const openDialog = collection.name == props.modalKey && status
        
    const handler = (e) => {
        e.preventDefault()

        if(errors.avatar) {
            return false
        }

        setLoading(true)

        let form = new FormData()
            form.append('name', data.name ?? '')
            form.append('phone', data.phone ?? '')
            form.append('email', data.email ?? '')
            form.append('password', data.password ?? '')
            form.append('roleId', data.roleId ?? '')
            form.append('status', data.status ?? '')
            data.avatar && form.append('avatar', data.avatar)

        axiosAPI.post(url.store, form)
        .then((e) => {
            toast.dismiss()
            if (e.data.status == true) {
                toast.success(e.data.message)
                dispatch(modalActions.loadingTable(true))
                props.callback()

                close()
            } else if (e.data.status == false) {
                toast.error(e.data.message)
                setErrors(e.data.errors)
                dispatch(modalActions.loading(false))
                dispatch(modalActions.loadingTable(false))
                setLoading(false)
            } else {
                setErrors(e.data.errors)
                dispatch(modalActions.loading(false))
                dispatch(modalActions.loadingTable(false))
                setLoading(false)
            }
        })
    }

    const callbackUploadFile=(file) => {
        const objectUrl = URL.createObjectURL(file)
        setPreviewMainImage(objectUrl)
        var arr_error = []
        var ruleType = ['jpg', 'jpeg', 'png']
        var type = file.type.split('/')
        if(ruleType.includes(type[1]) == false) {
            arr_error.push('Ảnh không đúng định dạng.')
        }
        if(file.size > 2000000) {
            arr_error.push('Dung lượng ảnh không vượt quá 2 MB.')
        }
        setErrorsMainImage([...arr_error])
        setData({...data, main: file})
    }

    const close = () => {
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
        setFileImage(undefined)
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-50'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới quản trị viên</h2>
            <div className="flex w-100 h-100">
				<div className="w-50">
                    <form onSubmit={handler} className="space-y-6">
						<Input
							id='name'
							name='name'
							type='text'
							labelName='Tên'
							placeholder="Nhập tên"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({...data, name: value})
							}}
						/>
						<Input
							id='phone'
							name='phone'
							type='text'
							labelName='Số điện thoại'
							placeholder="Nhập số điện thoại"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({...data, phone: value})
							}}
						/>
						<Input
							id='email'
							name='email'
							type='text'
							labelName='Email'
							placeholder="Nhập email"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({...data, email: value})
							}}
						/>
						<Input
							id='password'
							name='password'
							type='text'
							labelName='Mật khẩu'
							placeholder="Nhập mật khẩu"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({...data, password: value})
							}}
						/>
                        <SelectBox
                            name='roleId'
                            label='Vai trò'
                            data={props.constant.roles ? props.constant.roles : []}
                            callback={(value) => setData({...data, roleId: value.id})}
                            search={false}
                            containerClass='mb-4'
                            validate={errors}
                        />
                        <SelectBox
                            name='status'
                            label='Trạng thái'
                            data={props.constant.status ? props.constant.status.filter((item) => item.id != '') : []}
                            callback={(value) => setData({...data, status: value.id})}
                            search={false}
                            isRequired={true}
                            validate={errors}
                        />
                        <div className="flex justify-content-around mt-6 w-full">
                            <button 
                                type="button" 
                                onClick={() => close()} 
                                style={{width: '100px'}}
                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            > 
                                Thoát 
                            </button>
                            {loading == true ? (
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
                                <button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Tạo mới </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="w-50 h-100">
                <div className="w-75 mx-auto">
                    <label htmlFor="" className='mt-6 h3'>Ảnh đại diện</label>
                    </div>
                    <div className="w-75 mx-auto">
                        {previewMainImage &&
                            <div 
                                className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsMainImage.length > 0 ? 'border-danger' : 'border-dark'}`} 
                                style={{height: '250px', width: '250px'}}
                            >
                                <img src={previewMainImage} alt="" className='mx-auto' style={{height: '250px'}}/>
                            </div>
                        }
                        
                        <div className="text-red">{errorsMainImage[0] ?? ''}</div>
                    </div>
                    <UploadFile
                        name='avatar'
                        containerClass='mt-0 w-75 mx-auto'
                        validate={errors}
                        callback={(file) => callbackUploadFile(file)}
                        errors={errors}
                    />
                </div>
			</div>
        </Modal>
    )
}