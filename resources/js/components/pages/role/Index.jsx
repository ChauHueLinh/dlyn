import React from 'react'
import toast from 'react-hot-toast'
import ReactDOM from 'react-dom/client'

import { useState, useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import store from '~/components/store'
import Add from '~/components/pages/role/Add'
import Edit from '~/components/pages/role/Edit'
import Delete from '~/components/pages/role/Delete'
import Table from '~/components/molecules/Table'
import Filters from '~/components/molecules/Filters'
import PageFrame from '~/components/molecules/PageFrame'
import Paginate from '~/components/molecules/Paginate'

import { url } from '~/components/pages/role/Url'
import { modalActions } from '~/components/store/modal-slice'
import { filtersActions } from '~/components/store/filters-slice'

function RoleIndex(){

    const tableThead = [
        {
            name: 'Id',
            key: 'id',
        },
        {
            name: 'Tên',
            key: 'name'
        },
        {
            name: 'Mô tả',
            key: 'description'
        },
        {
            name: 'Hành động',
            key: false,
            className: 'flex items-center space-x-1 justify-center'
        }
    ]

    const dispatch    = useDispatch ()
    const filters     = useSelector((state) => state.filters)
    const reload      = useSelector((state) => state.modal.isLoadingTable)

    const [lists, setLists] = useState()
    const [paramConstants, setParamConstant] = useState({})
    const [constant, setConstant] = useState({})
    const [dataItem, setDataItem] = useState({})
    
    useEffect(() => {
        getList()
    }, [filters])

    useEffect(() => {
        getConstant()
    }, [paramConstants])

    const getConstant=async() => {
        await axiosAPI.get(url.constant, paramConstants)
            .then((res) => {
                setConstant({
                    ...constant, 
                    permissions: res.data.permissions,
                    list_permissions: res.data.listPermissions
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
            name='Danh sách vai trò'
            isCreate={constant?.permissions?.createAdmin}
        >
            <Filters
                isSearch={true}
            >
            </Filters>
            <Paginate
                data={lists}
                forcePage={filters.forcePage}
                perPage={filters?.param?.per_page}
                callbackPaginate={(page) => dispatch(filtersActions.handle({page: page}))}
                callbackPerPage={(value) => dispatch(filtersActions.handle({per_page: value}))}
            >
            </Paginate>
            <Table
                thead={tableThead}
                length={lists?.data}
            >
                { lists?.data?.map((item, index) => (
                    <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            {item.id}
                        </td>
                        <td scope="row" className="p-3 font-medium text-gray-900 break-words">
                            {item.name}
                        </td>
                        <td className="p-3 break-words">
                            {item.description}
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

export default RoleIndex

if(document.getElementById("role-index")) {
    ReactDOM.createRoot(document.getElementById("role-index")).render(
        <Provider store={store}>
            <RoleIndex/>
        </Provider>
    )
}