import React from 'react'
import axiosAPI from '~/libs/axiosAPI'
import ReactDOM from 'react-dom/client'
import toast from 'react-hot-toast'

import {useState, useEffect} from 'react'
import {Provider, useDispatch, useSelector} from 'react-redux'

import store from '~/components/store'
import Add from '~/components/pages/receipt/Add'
import Edit from '~/components/pages/receipt/Edit'
import Delete from '~/components/pages/receipt/Delete'
import Table from '~/components/molecules/Table'
import Filters from '~/components/molecules/Filters'
import PageFrame from '~/components/molecules/PageFrame'
import SelectBox from '~/components/molecules/SelectBox'

import {url} from '~/components/pages/receipt/Url'
import {modalActions} from '~/components/store/modal-slice'
import {filtersActions} from '~/components/store/filters-slice'

function ReceiptIndex() {
    const NUMBER = new Intl.NumberFormat();

    const tableThead = [
        {
            name: 'Id',
            key: 'id',
        },
        {
            name: 'Mã',
            key: 'code'
        },
        {
            name: 'Giá trị',
            key: 'value'
        },
        {
            name: 'Đơn vị',
            key: 'unit',
            className: 'flex items-center space-x-1 justify-center'
        },
        {
            name: 'Người tạo',
            key: 'createdBy',
            className: 'flex items-center space-x-1 justify-center'
        },
        {
            name: 'Người chỉnh sửa',
            key: 'updatedBy',
            className: 'flex items-center space-x-1 justify-center'
        },
        {
            name: 'Hành động',
            key: false,
            className: 'flex items-center space-x-1 justify-center'
        }
    ]

    const dispatch    = useDispatch()
    const filters     = useSelector((state) => state.filters)
    const reload      = useSelector((state) => state.modal.isLoadingTable)

    const [lists, setLists] = useState()
    const [paramConstants, setParamConstant] = useState({})
    const [constant, setConstant] = useState({})
    const [dataItem, setDataItem] = useState({})
    
    useEffect(() => {
        getList()
    }, [filters])

    useEffect(() =>{
        getConstant()
    }, [paramConstants])

    const getConstant = async () => {
        await axiosAPI.get(url.constant, paramConstants)
            .then((res) => {
                let products = res.data.products
                let coupons = []

                res.data.coupons.map((item) => {
                    coupons.push({
                        id: item.id,
                        name: item.code + ' (' + NUMBER.format(item.value) + ' ' + item.unit + ')',
                        value:item.value,
                        unit:item.unit,
                    })
                })

                products.unshift({id: '', name: 'Chọn...'})
                coupons.unshift({id: '', name: 'Chọn...'})

                setConstant({
                    ...constant, 
                    permissions: res.data.permissions,
                    products: products,
                    coupons: coupons,
                })
            })
    }

    const getList=async() => {
        await axiosAPI.get(url.index, {params: filters.param})
            .then((res) => {
                setLists(res.data)
            })
        dispatch(modalActions.loadingTable(false))
    }

    const callbackAdd=() => {
        dispatch(filtersActions.handle({page: 1}))
        getList()
    }

    const callbackUpdate=() => {
        let page = filters.param.page

        if(lists.data.length == 1) {
            page = page - 1
        }

        if (page <= 0) {
            page = 1
        }

        dispatch(filtersActions.handle({ page: page }))
        getList()
    }

    const callbackDelete=() => {
        let page = filters.param.page

        if(lists.data.length == 1) {
            page = page - 1
        }

        if (page <= 0) {
            page = 1
        }

        dispatch(filtersActions.handle({ page: page }))
        getList()
    }

    const openModalEdit=(item) => {
        setDataItem(item)
        dispatch(modalActions.open({
            id: item.id,
            name: 'update'
        }))
    }

    const openModalDelete=(item) => {
        setDataItem(item)
        dispatch(modalActions.open({
            id: item.id,
            name: 'delete'
        }))
    }

    return (
        <PageFrame
            data={lists}
            name='Danh sách hóa đơn'
            isCreate={constant?.permissions?.createReceipt}
            isPaginate={true}
            callbackPaginate={(page) => dispatch(filtersActions.handle({page: page}))}
            forcePage={filters.forcePage}
        >
            <Filters
                isSearch={true}
            >
                {/* <SelectBox
                    data={constant ? constant.unit : []}
                    callback={(value) => dispatch(filtersActions.handle({unit: value.id}))}
                    search={false}
                /> */}
            </Filters>
            <Table
                thead={tableThead}
                length={lists?.data}
            >
                {lists?.data?.map((item, index) => (
                    <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            {item.id}
                        </td>
                        <td className="p-3">
                            {item.code}
                        </td>
                        <td className="p-3">
                            {item.value}
                        </td>
                        <td className="p-3 text-center">
                            {item.unit}
                        </td>
                        <td className="p-3 text-center">
                            {item.unit}
                        </td>
                        <td className="p-3 text-center">
                            {item.unit}
                        </td>
                        <td>
                            <div className="flex items-center justify-center p-3">
                                {constant?.permissions?.updateAdmin &&
                                    <button
                                        type="button"
                                        className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm me-2"
                                        style={{width: '40px', height: '40px', fontSize: '20px'}}
                                        onClick={() => {
                                            openModalEdit(item)
                                            dispatch(modalActions.loading(false))
                                        }}
                                    >
                                        <i className='bx bx-edit-alt m-auto'></i>
                                    </button>
                                }
                                {constant?.permissions?.deleteAdmin &&
                                    <button
                                        type="button"
                                        className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm ms-2"
                                        style={{width: '40px', height: '40px', fontSize: '30px'}}
                                        onClick={() => {
                                            openModalDelete(item)
                                            dispatch(modalActions.loading(false))
                                        }}
                                    >
                                        <i className='bx bx-x m-auto' ></i>
                                    </button>
                                }
                            </div>
                        </td>
                    </tr>
                ))}
            </Table>

            <Add
                modalKey='create'
                callback={() => callbackAdd()}
                constant={constant}
            />
            <Edit
                modalKey='update'
                callback={() => callbackUpdate()}
                data={dataItem}
                constant={constant}
            />
            <Delete
                modalKey='delete'
                callback={() => callbackDelete()}
                data={dataItem}
            />
        </PageFrame>
    )
}

export default ReceiptIndex

if (document.getElementById("receipt-index")) {
    ReactDOM.createRoot(document.getElementById("receipt-index")).render (
        <Provider store={store}>
            <ReceiptIndex/>
        </Provider>
    )
}