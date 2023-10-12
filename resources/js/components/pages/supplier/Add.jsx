import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'

import {url} from '~/components/pages/supplier/Url'
import {modalActions} from '~/components/store/modal-slice'

export default function Add(props) {
    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]                   = useState({})
    const [loading, setLoading]                 = useState(false)
    const [data, setData]                       = useState({})
    const [constant, setConstant]               = useState({})
    const [paramsConstant, setParamsConstant]   = useState({})

    const openDialog = collection.name == props.modalKey && status

    useEffect(() => {
        getConstant()
    }, [paramsConstant])
        
    const handler = (e) => {
        e.preventDefault()

        setLoading(true)

        let form = new FormData()
            form.append('name', data.name ?? '')

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

    const getConstant = async () => {
        console.log(paramsConstant);
        await axiosAPI.get(url.constant, {params: paramsConstant})
            .then((res) => {
                let provinces = res.data.provinces
                let districts = res.data.districts
                let wards = res.data.wards
                provinces.unshift({id: '', name: 'Chọn...'})
                districts.unshift({id: '', name: 'Chọn...'})
                wards.unshift({id: '', name: 'Chọn...'})
                setConstant({
                    ...constant, 
                    provinces: provinces,
                    districts: districts,
                    wards: wards,
                })
            })
    }

    const handlerChangeProvince = (provinceId) => {
        setParamsConstant({...paramsConstant, provinceId: provinceId})
        setData({...data, provinceId: provinceId})
    }

    const handlerChangeDistrict = (districtId) => {
        setParamsConstant({...paramsConstant, districtId: districtId})
        setData({...data, districtId: districtId})
    }

    const handlerChangeWard = (wardId) => {
        setParamsConstant({...paramsConstant, wardId: wardId})
        setData({...data, wardId: wardId})
    }

    const close = () => {
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
        setName()
    }
    // console.log(constant);
    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-25'
        >
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới nhà cung cấp</h2>
            <div className="w-100">
                <form onSubmit={handler} className="space-y-6">
                    <Input
                        id='name'
                        name='name'
                        type='text'
                        labelName='Tên'
                        placeholder="Nhập tên loại sản phẩm"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full mb-4'
                        onChange={(value) => {
                            setData({...data, name: value})
                        }}
                    />
                    <SelectBox
                        label='Tỉnh\thành phố trung ương'
                        data={constant ? constant.provinces : []}
                        value={data.provinceId ?? ''}
                        callback={(value) => handlerChangeProvince(value.id)}
                        search={true}
                    />
                    <SelectBox
                        label='Thành phố\quận\huyện\thị xã'
                        data={constant ? constant.districts : []}
                        value={data.districtId ?? ''}
                        callback={(value) => handlerChangeDistrict(value.id)}
                        search={true}
                    />
                    <SelectBox
                        label='Phường\xã\thị trấn'
                        data={constant ? constant.wards : []}
                        value={data.wardId ?? ''}
                        callback={(value) => handlerChangeWard(value.id)}
                        search={true}
                    />
                    <Input
                        id='address'
                        name='address'
                        type='text'
                        labelName='Địa chỉ'
                        placeholder="Nhập địa chỉ"
                        isRequired={true}
                        validate={errors}
                        containerClass='w-full mb-4'
                        onChange={(value) => {
                            setData({...data, address: value})
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