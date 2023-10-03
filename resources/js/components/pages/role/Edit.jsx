import React from 'react'
import toast from 'react-hot-toast'

import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Input from '~/components/molecules/Input'
import Modal from '~/components/molecules/Modal'
import Table from '~/components/molecules/Table'
import Switch from '~/components/molecules/Switch'

import { url } from '~/components/pages/role/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Edit(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const loading    = useSelector((state) => state.modal.isLoading)
    const collection = useSelector((state) => state.modal.collection)
    
    const [errors, setErrors]           = useState({})
    const [dataItem, setDataItem]       = useState(props.data)
    const [permissions, setPermissions] = useState([])

    const tableThead = [
        {
            name: 'Quản lý',
            key: false
        },
        {
            name: 'Xem',
            key: false,
            className: 'text-center'
        },
        {
            name: 'Thêm',
            key: false,
            className: 'text-center'
        },
        {
            name: 'Sửa',
            key: false,
            className: 'text-center'
        },
        {
            name: 'Xóa',
            key: false,
            className: 'text-center'
        },
    ]

    useEffect(() => {
        setDataItem(props.data)
        setPermissions(props.data.permissions)
    }, [props.data])
    
    const openDialog = collection.name == props.modalKey && status

    const handler = (e) => {
        e.preventDefault()

        dispatch(modalActions.loading(true))

        let form = new FormData()
            form.append('id', dataItem.id)
            form.append('name', dataItem.name)
            form.append('description', dataItem.description)
            form.append('permissions', permissions)
            form.append('_method', 'PUT')

        axiosAPI.post(url.update, form)
            .then((res) => {
                toast.dismiss()
                console.log(res);
                if(res.data.status == true) {
                    toast.success(res.data.message)
                    props.callback()
                    close()
                } else if (res.data.status == false) {
                    toast.error(res.data.message)
                    setErrors(res.data.errors)
                }
            })
    }

    const callbackSwitch = (enabled, view_id, id) => {
        if (enabled == 0) {
            if(id != view_id && permissions?.includes(view_id)) {
                setPermissions([...permissions, id])
            } else {
                setPermissions([...permissions, id, view_id])
            }
        } else {
            if(id == view_id) {
                var arr = permissions?.filter((item) => item != id)
                var arr_1 = arr?.filter((item) => item != id + 1)
                var arr_2 = arr_1?.filter((item) => item != id + 2)
                var arr_3 = arr_2?.filter((item) => item != id + 3)
                setPermissions(arr_3)
            } else {
                var arr = permissions?.filter((item) => item != id)
                setPermissions(arr)
            }
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
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Chỉnh sửa vai trò </h2>
            <form onSubmit={handler} className="space-y-6">
                <Input
                    id='name'
                    name='name'
                    type='text'
                    labelName='Tên'
                    placeholder="Nhập tên"
                    value={dataItem.name ?? ''}
                    isRequired={true}
                    validate={errors}
                    containerClass='w-full mb-4'
                    onChange={(value) => {
                        setDataItem({...dataItem, name: value})
                    }}
                />
                <Input
                    id='description'
                    name='description'
                    type='text'
                    labelName='Mô tả'
                    placeholder="Nhập mô tả"
                    value={dataItem.description}
                    isRequired={true}
                    validate={errors}
                    containerClass='w-full mb-4'
                    onChange={(value) => {
                        setDataItem({...dataItem, description: value})
                    }}
                />
                <Table
                        thead = { tableThead }
                        length = { props?.constant?.list_permissions }
                    >
                        { props?.constant?.list_permissions?.map((item) => (
                            <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-3">
                                    { item.displayName }
                                </td>
                                { item?.permissions?.map((i) => (
                                    <td key={i.id} className="p-3">
                                        <Switch
                                            class='mx-auto'
                                            id={i.id}
                                            enabled={permissions?.includes(i.id) == true ? 1 : 0}
                                            callback={(enabled) => callbackSwitch(enabled, item.id + 1, i.id)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        )) }
                    </Table>
                <div className="flex items-center space-x-6 mt-6">
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
        </Modal>
    )
}