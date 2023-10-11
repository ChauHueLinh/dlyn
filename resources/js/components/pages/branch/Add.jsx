import React from 'react'
import toast from 'react-hot-toast'

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import UploadFile from '~/components/molecules/UploadFile'

import {url} from '~/components/pages/branch/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Add(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]               = useState({})
    const [loading, setLoading]             = useState(false)
    const [data, setData]                   = useState({})
    const [previewAvatar, setPreviewAvatar] = useState()
    const [errorsAvatar, setErrorsAvatar]   = useState([])

    const openDialog = collection.name == props.modalKey && status
        
    const handler = (e) => {
        e.preventDefault()

        if(errorsAvatar?.length > 0 || !data?.avatar) {
            return false
        }

        setLoading(true)

        let form = new FormData()
            form.append('name', data.name ?? '')
            form.append('avatar', data.avatar ?? '')

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

    const callbackUploadFile = (file) => {
        const objectUrl = URL.createObjectURL(file)
        setPreviewAvatar(objectUrl)
        var arr_error = []
        var ruleType = ['jpg', 'jpeg', 'png']
        var type = file.type.split('/')
        if(ruleType.includes(type[1]) == false) {
            arr_error.push('Ảnh không đúng định dạng.')
        }
        if(file.size > 2000000) {
            arr_error.push('Dung lượng ảnh không vượt quá 2 MB.')
        }
        setErrorsAvatar([...arr_error])
        setData({...data, avatar: file})
    }

    const close = () => {
        setData({})
        setErrors({})
        setLoading(false)
        setPreviewAvatar()
        setErrorsAvatar([])
        dispatch(modalActions.close())
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-25'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới thương hiệu</h2>
            <div className="w-100">
                <label htmlFor="" className='mt-0'>Ảnh đại diện<span className="text-red-500 ms-2">*</span></label>
                {previewAvatar &&
                    <div 
                        className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsAvatar?.length > 0 ? 'border-danger' : 'border-dark'}`} 
                        style={{height: '100px', width: '100px'}}
                    >
                        <img src={previewAvatar} alt="" />
                    </div>
                }
                
                <div className="text-red">{errorsAvatar[0] ?? ''}</div>
                <UploadFile
                    name='main'
                    containerClass='mt-0 mx-auto'
                    validate={errors}
                    callback={(file) => callbackUploadFile(file)}
                    errors={errors}
                    style={{width: '30vh', height: '30vh'}}
                />
                <form onSubmit={handler} className="space-y-6 mt-3">
                    <Input
                        id='name'
                        name='name'
                        type='text'
                        labelName='Tên'
                        placeholder="Nhập tên thương hiệu"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full mb-4'
                        onChange={(value) => {
                            setData({...data, name: value})
                        }}
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
        </Modal>
    )
}