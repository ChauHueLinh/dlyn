import React from 'react'
import toast from 'react-hot-toast'

import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axios from '~/libs/axios'
import Input from '~/components/molecules/Input'
import Modal from '~/components/molecules/Modal'
import SelectBox from '~/components/molecules/SelectBox'
import UploadFile from '~/components/molecules/UploadFile'

import { url } from '~/components/pages/admin/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Edit(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)
    
    const [errors, setErrors]           = useState({})
    const [dataItem, setDataItem]       = useState(props.data)
    const [loading, setLoading]         = useState(false)

    useEffect(() => {
        setDataItem(props.data)
    }, [props.data])
    
    const openDialog = collection.name == props.modalKey && status

    const handler = (e) => {
        e.preventDefault()

        dispatch(modalActions.loading(true))

        let form = new FormData()
            form.append('id', dataItem.id ?? '')
            form.append('name', dataItem.name ?? '')
            form.append('phone', dataItem.phone ?? '')
            form.append('email', dataItem.email ?? '')
            form.append('roleId', dataItem.roleId ?? '')
            form.append('status', dataItem.status ?? '')
            dataItem.file && form.append('avatar', dataItem.file)
            dataItem.file && form.append('password', dataItem.password ?? '')

        axios.post(url.update, form)
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
        var errors = errors
        var arr_error = []
        var ruleType = ['jpg', 'jpeg', 'png']
        var type = file.type.split('/')
        if(ruleType.includes(type[1]) == false) {
            arr_error.push('Ảnh không đúng định dạng.')
        }
        if(file.size > 2000000) {
            arr_error.push('Dung lượng ảnh không vượt quá 2 MB.')
        }
        if(arr_error.length > 0) {
            setErrors({...errors, avatar: arr_error})
        } else {
            setDataItem({...dataItem, file: file})
            errors?.avatar && errors.remove('avatar')
            setErrors({})
        }
    }

    const close = () => {
        dispatch(modalActions.close())
        dispatch(modalActions.loadingTable(false))
        setErrors({})
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
            wrapperClass='w-50'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Chỉnh sửa quản trị viên </h2>
            <div className="flex w-100 h-100">
				<div className="w-50">
                    <form onSubmit={handler} className="space-y-6">
						<Input
							id='name'
							name='name'
							type='text'
                            value={dataItem.name ?? ''}
							labelName='Tên'
							placeholder="Nhập tên"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setDataItem({...dataItem, name: value})
							}}
						/>
						<Input
							id='phone'
							name='phone'
							type='text'
                            value={dataItem.phone ?? ''}
							labelName='Số điện thoại'
							placeholder="Nhập số điện thoại"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setDataItem({...dataItem, phone: value})
							}}
						/>
						<Input
							id='email'
							name='email'
							type='text'
                            value={dataItem.email ?? ''}
							labelName='Email'
							placeholder="Nhập email"
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setDataItem({...dataItem, email: value})
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
								setDataItem({...dataItem, password: value})
							}}
						/>
                        <SelectBox
                            name='roleId'
                            label='Vai trò'
                            data={props.constant.roles ? props.constant.roles : []}
                            value={dataItem?.role?.id ?? ''}
                            callback={(value) => setDataItem({...dataItem, roleId: value.id})}
                            search={false}
                            containerClass='mb-4'
                            validate={errors}
                        />
                        <SelectBox
                            name='status'
                            label='Trạng thái'
                            data={props.constant.status ? props.constant.status.filter((item) => item.id != '') : []}
                            value={dataItem.status ?? ''}
                            callback={(value) => setDataItem({...dataItem, status: value.id})}
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
                                <button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Cập nhật </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="w-50 h-100">
                    <div className='w-full'>
                        <UploadFile
                            name='avatar'
                            containerClass='mt-6 w-75 mx-auto'
                            validate={errors}
                            value={dataItem.avatar ?? document.location.origin + '/assets/img/default-avatar.png'}
                            callback={(file) => callbackUploadFile(file)}
                            errors={errors}
                            style={{width: '30vh', height: '30vh'}}
                        />
                    </div>
                </div>
			</div>
        </Modal>
    )
}