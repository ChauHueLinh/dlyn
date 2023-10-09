import React from 'react'
import toast from 'react-hot-toast'

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'
import UploadFile from '~/components/molecules/UploadFile'
import UploadFiles from '~/components/molecules/UploadFiles'

import { url } from '~/components/pages/product/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Add(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]         = useState({})
    const [loading, setLoading]       = useState(false)
    const [data, setData]             = useState({
        status: 0
    })
    const [attributes, setAttributes] = useState([])
    const [errorAttributes, setErrorAttributes] = useState([])
    const [previewMainImage, setPreviewMainImage] = useState()
    const [previewDescriptionImage, setPreviewDescriptionImage] = useState([])
    const [errorsDescriptionImage, setErrorsDescriptionImage] = useState([])
    const [errorsMainImage, setErrorsMainImage] = useState([])

    const openDialog = collection.name == props.modalKey && status
        
    const handler = (e) => {
        e.preventDefault()

        if(errorAttributes?.length > 0 || errorsMainImage?.length > 0 || errorsDescriptionImage?.length > 0) {
            return false
        }

        if(!data.mainImage) {
            setErrorsMainImage(['Ảnh đại diện là bắt buộc.'])
            return false
        }

        setLoading(true)

        let form = new FormData()
            form.append('name', data.name ?? '')
            form.append('price', data.price ?? '')
            attributes.length > 0 && attributes.map((item) => {
                form.append('attributes[]', JSON.stringify({
                    name: item.name,
                    value: item.value,
                }))
            })
            form.append('mainImage', data.mainImage ?? '')
            data.descriptionImages.length > 0 && Object?.entries(data.descriptionImages)?.map((item) => {
                form.append('descriptionImages[]', item[1])
            })

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

    const addAttribute = () => {
        setAttributes([...attributes, {id: attributes?.length > 0 ? (attributes.at(-1).id + 1) : 0, name: '', value: ''}]) 
    } 

    const removeAttribute = (id) => {
        var new_array_attributes = attributes.filter((item) => item.id != id)
        setAttributes(new_array_attributes)
    } 

    const setNameAttribute = (id, name, value) => {
        const error_atrributes = errorAttributes.filter((item) => item.id != id)
        const maxString = 255
        const nameLength = 'Tên thuộc tính chứa tối đa ' + maxString + ' ký tự.'
        const nameUnique = 'Thuộc tính đã tồn tại.'
        const valueLength = 'Giá trị chứa tối đa ' + maxString + ' ký tự.'
        const e = [];

        if(name.length > maxString) {
            e.push(nameLength)
        } else {
            e.filter((item) => item != nameLength)
        }
        if(attributes.filter((item) => item.name == name).length < 1) {
            e.filter((item) => item != nameUnique)
        } else {
            e.push(nameUnique)
        }

        error_atrributes.push({id: id, value: e})
        setErrorAttributes(error_atrributes)

        var new_array_attributes = attributes.filter((item) => item.id != id)
        new_array_attributes.push({id: id, name: name, value:value})
        new_array_attributes.sort((a, b) => a.id-b.id)
        setAttributes(new_array_attributes)
    }

    const setValueAttribute = (id, name, value) => {
        const error_atrributes = errorAttributes.filter((item) => item.id != id)
        const maxString = 255
        const valueLength = 'Giá trị chứa tối đa ' + maxString + ' ký tự.'
        const e = [];

        if(value.length > maxString) {
            e.push(valueLength)
        } else {
            e.filter((item) => item != valueLength)
        }

        error_atrributes.push({id: id, value: e})
        setErrorAttributes(error_atrributes)

        var new_array_attributes = attributes.filter((item) => item.id != id)
        new_array_attributes.push({id: id, name: name, value:value})
        new_array_attributes.sort((a, b) => a.id-b.id)
        setAttributes(new_array_attributes)
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
        setData({...data, mainImage: file})
    }

    const callbackUploadFiles = (files) => {
        const newPreviewDescriptionImage = previewDescriptionImage ?? []
        const errors = errorsDescriptionImage ?? []
        Object?.entries(files)?.map((item) => {
            const objectUrl = URL.createObjectURL(item[1])
            const id = newPreviewDescriptionImage.length > 0 ? newPreviewDescriptionImage.at(-1)?.id + 1 : 0
            newPreviewDescriptionImage.push({id: id, value: objectUrl})
            var arr_error = []
            var ruleType = ['jpg', 'jpeg', 'png']
            var type = item[1].type.split('/')
            errors['desImg-' + id] = []
            if(ruleType.includes(type[1]) == false) {
                errors['desImg-' + id].push('Ảnh không đúng định dạng.')
            }
            if(item[1].size > 2000000) {
                errors['desImg-' + id].push('Dung lượng ảnh không vượt quá 2 MB.')
            }
        })
        setErrorsDescriptionImage(errors)
        setPreviewDescriptionImage([...newPreviewDescriptionImage])
        setData({...data, descriptionImages: files})
    }

    const removeDescriptionImage = (id) => {
        const newPreviewDescriptionImage = previewDescriptionImage?.filter((item) => item.id != id)
        delete errorsDescriptionImage['desImg-' + id]
        setPreviewDescriptionImage([...newPreviewDescriptionImage])
    }

    const close = () => {
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
    }
    console.log(errorsMainImage);
    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-75'
            btnClose={true}
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới sản phẩm</h2>
            <div className="flex">
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
                            id='price'
                            name='price'
                            type='number'
                            labelName='Giá'
                            placeholder="Nhập giá"
                            isRequired={true}
                            validate={errors}
                            containerClass='w-full mb-4'
                            onChange={(value) => {
                                setData({...data, price: value})
                            }}
                        />
                        <Input
                            id='quantity'
                            name='quantity'
                            type='number'
                            labelName='Số lượng'
                            placeholder="Nhập số lượng"
                            isRequired={true}
                            validate={errors}
                            containerClass='w-full mb-4'
                            onChange={(value) => {
                                setData({...data, quantity: value})
                            }}
                        />
                         <SelectBox
                            label='Trạng thái'
                            data={props.constant ? props.constant.status : []}
                            value={data.status ?? 0}
                            callback={(value) => setData({...data, status: value.id})}
                            search={false}
                        />
                        <div className="">Thuộc tính</div>
                        {attributes?.map((item) => (
                            <div className="mt-0" key={item.id}>
                                <div className="flex mt-0 w-full space-x-2">
                                    <div className="flex items-center justify-center mb-0 mt-2 h4">
                                        <i 
                                            className='bx bx-x-circle text-red'
                                            onClick={() => removeAttribute(item.id)}
                                        >
                                        </i>
                                    </div>
                                    <Input
                                        id={item.id}
                                        type='text'
                                        value={item.name}
                                        placeholder="Nhập tên thuộc tính"
                                        containerClass='w-25 mb-0'
                                        validate={errors}
                                        onChange={(value) => {
                                            setNameAttribute(item.id, value, item.value)
                                        }}
                                    />
                                    <Input
                                        id={item.id}
                                        type='text'
                                        value={item.value}
                                        placeholder="Nhập giá trị"
                                        containerClass='w-75 mb-0'
                                        validate={errors}
                                        onChange={(value) => {
                                            setValueAttribute(item.id, item.name, value)
                                        }}
                                    />
                                </div>
                                <div className="text-red">{errorAttributes?.filter((i) => i.id == item.id)[0]?.value[0]}</div>
                            </div>
                        ))}
                        <div className="flex items-center justify-content-start mb-4 mt-1 h4">
                            <i 
                                className='bx bx-plus-circle text-green' 
                                onClick={() => addAttribute()}
                            >
                            </i>
                        </div>
                        <div className="flex justify-content-start w-full">
                            <div className="flex justify-content-around mt-6 w-50">
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
                        </div>
                    </form>
                </div>
                <div className="w-50">
                    <div className="w-75 mx-auto">
                        <label htmlFor="" className='mt-6 h3'>Ảnh đại diện</label>
                    </div>
                    <div className="w-75 mx-auto">
                        {previewMainImage &&
                            <div 
                                className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsMainImage.length > 0 ? 'border-danger' : 'border-dark'}`} 
                                style={{height: '100px', width: '100px'}}
                            >
                                <img src={previewMainImage} alt="" />
                            </div>
                        }
                        
                        <div className="text-red">{errorsMainImage[0] ?? ''}</div>
                    </div>
                    <UploadFile
                        name='main'
                        containerClass='mt-0 w-75 mx-auto'
                        validate={errors}
                        callback={(file) => callbackUploadFile(file)}
                        errors={errors}
                        style={{width: '30vh', height: '30vh'}}
                    />
                    <div className="w-75 mx-auto">
                        <label htmlFor="" className='mt-6 h3'>Ảnh mô tả</label>
                    </div>
                    <div className="relative w-75 mx-auto flex space-x-1 flex-wrap">
                        {previewDescriptionImage?.map((item) => (
                            <div className="relative mt-2" key={item.id}>
                                <div className="w-full absolute flex justify-content-end">
                                    <div 
                                        className="bg-red flex items-center justify-center overflow-hidden rounded-circle" 
                                        style={{width: '19px', height: '19px', fontSize: '19px'}}
                                        onClick={(event) => removeDescriptionImage(item.id)}
                                    >
                                        <i className='bx bx-x-circle text-black bg-white' style={{width: '19px'}}></i>
                                    </div>
                                </div>
                                <div    
                                    className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsDescriptionImage['desImg-' + item.id].length > 0 ? 'border-danger' : 'border-dark'}`} 
                                    style={{height: '100px', width: '100px'}}
                                >
                                    <img src={item.value} alt="" title={errorsDescriptionImage['desImg-' + item.id] ?? ''}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <UploadFiles
                        name='sub'
                        preview={[]}
                        containerClass='w-75 mx-auto'
                        validate={errors}
                        callback={(files) => {
                            callbackUploadFiles(files)
                        }}
                        errors={errors}
                        style={{width: '30vh', height: '30vh'}}
                    />
                </div>
            </div>
        </Modal>
    )
}