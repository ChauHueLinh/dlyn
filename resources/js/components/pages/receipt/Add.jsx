import React from 'react'
import toast from 'react-hot-toast'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components//molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components//molecules/SelectBox'

import { url } from '~/components/pages/receipt/Url'
import { modalActions } from '~/components/store/modal-slice'

export default function Add(props) {
    const dispatch = useDispatch()
    const status = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [listUser, setListUser] = useState([])
    const [products, setProducts] = useState([])
    const [data, setData] = useState({
        unit: '%',
    })

    const openDialog = collection.name == props.modalKey && status

    const handler = (e) => {
        e.preventDefault()

        if (errors.avatar) {
            return false
        }

        setLoading(true)

        let form = new FormData()
        form.append('code', data.code ?? '')
        form.append('value', data.value ?? '')
        form.append('unit', data.unit ?? '')

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

    const getUser = async (phone) => {
        if (phone.length < 5) {
            return false
        }
        let res = await axiosAPI.get(url.users, { params: { phone: phone } })

        setListUser(res.data)
    }

    const addProduct = () => {
        let arr = products
        if (products?.length < 1) {
            arr.push({ id: 1, productId: '', price: '', quantity: 0, total: 0 })
        } else {
            let id = products.at(-1).id + 1
            arr.push({ id: id, productId: '', price: '', quantity: 0, total: 0 })
        }
        setProducts([...arr])
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
            wrapperClass='w-75'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới hóa đơn</h2>
            <div className="flex space-x-6">
                <div className="w-50">
                    <Input
                        id='name'
                        name='name'
                        type='text'
                        value={data?.name}
                        labelName='Tên khách hàng'
                        placeholder="Nhập tên"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full mb-4'
                        onChange={(value) => {
                            setData({ ...data, name: value })
                        }}
                    />
                    <div className='relative'>
                        <Input
                            id='phone'
                            name='phone'
                            type='text'
                            value={data?.phone}
                            callbackOnBlur={() => {
                                setListUser([])
                            }}
                            labelName='Số điện thoại'
                            placeholder="Nhập số điện thoại"
                            isRequired={true}
                            validate={errors}
                            containerClass='w-full'
                            onChange={(value) => {
                                setData({ ...data, phone: value })
                                getUser(value)
                            }}
                        />
                        {listUser?.length > 0 &&
                            <div
                                className='absolute w-full py-1 rounded-lg overflow-auto border border-gray-300  bg-white z-15'
                                style={{ maxHeight: '100px', height: 'fit-content' }}
                            >
                                {listUser?.length > 0 &&
                                    listUser?.map((item) => (
                                        <div
                                            className='option p-2'
                                            key={item.id}
                                            onClick={() => {
                                                setData({
                                                    ...data,
                                                    id: item.id,
                                                    name: item.name,
                                                    phone: item.phone,
                                                    email: item.email,
                                                    address: item.address,
                                                })
                                                setListUser([])
                                            }}
                                        >
                                            {item.name + ' (' + item.phone + ')'}
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                    <Input
                        id='email'
                        name='email'
                        type='text'
                        value={data?.email}
                        labelName='Email'
                        placeholder="Nhập email"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full my-4'
                        onChange={(value) => {
                            setData({ ...data, email: value })
                        }}
                    />
                    <Input
                        id='address'
                        name='address'
                        type='text'
                        value={data?.address}
                        labelName='Địa chỉ'
                        placeholder="Nhập địa chỉ"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full mb-4'
                        onChange={(value) => {
                            setData({ ...data, address: value })
                        }}
                    />
                    {/* <SelectBox
                        name='unit'
                        label='Đơn vị'
                        data={props.constant.unit ? props.constant.unit.filter((item) => item.id != '') : []}
                        value={data.unit}
                        callback={(value) => setData({...data, unit: value.id})}
                        search={false}
                        isRequired={true}
                        containerClass='mb-4'
                        validate={errors}
                    /> */}
                </div>
                <div className="w-50">
                    <div className="mb-2 text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <div className="">Sản phẩm</div>
                        <div className="text-red-500">*</div>
                    </div>
                    {products?.length > 0 &&
                        products?.map((item) => (
                            <div className="flex space-x-1 w-full" key={item.id}>
                                <SelectBox
                                    name='product'
                                    data={props?.constant?.products ?? []}
                                    value={item.productId}
                                    callback={(value) => { }}
                                    search={true}
                                    containerClass='w-100'
                                    validate={errors}
                                />
                                <Input
                                    id='price'
                                    name='price'
                                    type='number'
                                    value={item?.price}
                                    placeholder="Nhập giá"
                                    disabled={true}
                                    validate={errors}
                                    containerClass='w-25 mb-2 mt-0'
                                />
                                <Input
                                    id='price'
                                    name='price'
                                    type='number'
                                    value={item?.quantity}
                                    placeholder="Nhập số lượng"
                                    validate={errors}
                                    containerClass='w-25 mb-2 mt-0'
                                    onChange={(value) => {
                                        // setData({...data, address: value})
                                    }}
                                />
                                <Input
                                    id='price'
                                    name='price'
                                    type='number'
                                    value={item?.price}
                                    placeholder="Nhập giá"
                                    disabled={true}
                                    validate={errors}
                                    containerClass='w-25 mb-2 mt-0'
                                />
                            </div>
                        ))
                    }
                    <div className="flex items-center justify-content-start mb-4 mt-1 h4">
                        <i
                            className='bx bx-plus-circle text-green'
                            onClick={() => addProduct()}
                        >
                        </i>
                    </div>
                </div>
            </div>
            <form onSubmit={handler} className="space-y-6">
                <div className="flex justify-content-around mt-6 w-50 m-auto">
                    <button
                        type="button"
                        onClick={() => close()}
                        style={{ width: '100px' }}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        Thoát
                    </button>
                    {loading == true ? (
                        <div className="flex items-center justify-content-around" style={{ width: '100px' }}>
                            <div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
                                <span className="sr-only">Loading...</span>
                            </div>
                            <div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
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