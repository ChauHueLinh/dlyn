import React from 'react'
import axiosAPI from '~/libs/axiosAPI'
import ReactDOM from 'react-dom/client'
import toast from 'react-hot-toast'

import {useState, useEffect} from 'react'
import {Provider, useDispatch, useSelector} from 'react-redux'

import store from '~/components/store'
import Add from '~/components/pages/admin/Add'
import Edit from '~/components/pages/admin/Edit'
import Delete from '~/components/pages/admin/Delete'
import Table from '~/components/molecules/Table'
import Switch from '~/components/molecules/Switch'
import Filters from '~/components/molecules/Filters'
import SelectBox from '~/components/molecules/SelectBox'
import PageFrame from '~/components/molecules/PageFrame'
import Paginate from '~/components/molecules/Paginate'

import {url} from '~/components/pages/admin/Url'
import {modalActions} from '~/components/store/modal-slice'
import {filtersActions} from '~/components/store/filters-slice'

function AdminIndex() {

    const tableThead = [
        {
            name: 'Id',
            key: 'id',
        },
        {
            name: 'Ảnh',
            key: false,
            className: 'text-center'
        },
        {
            name: 'Tên',
            key: 'name'
        },
        {
            name: 'Email',
            key: 'email'
        },
        {
            name: 'Điện thoại',
            key: 'phone'
        },
        {
            name: 'Trạng thái',
            key: 'status',
            className: 'flex items-center space-x-1 justify-center'
        },
        {
            name: 'Vai trò',
            key: 'status',
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

    const getConstant=async() => {
        await axiosAPI.get(url.constant, paramConstants)
            .then((res) => {

                var roles = res.data.roles
                var status = []

                Object.entries(res.data.status)?.map((item => {
                    status.unshift({id: item[0], name: item[1]})
                }))

                roles.unshift({id: '', name: 'Chọn vai trò'})
                status.unshift({id: '', name: 'Chọn trạng thái'})
                
                setConstant({
                    ...constant, 
                    permissions: res.data.permissions,
                    roles: roles,
                    status: status,
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

    const callbackSwitch=async(enabled, id) => {
        let form = new FormData()

            form.append('id', id)
            form.append('status', !enabled ? 1: 0)
            form.append('_method', 'PUT')

        axiosAPI.post(url.update_status, form)
        .then((res) => {
            toast.dismiss()
            if(res.data.status == true) {
                toast.success(res.data.message)
            } else if(res.data.status == false) {
                toast.error(res.data.message)
            }
        })
        getList()
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
            name='Danh sách quản trị viên'
            isCreate={constant?.permissions?.createAdmin}
        >
            <Filters
                isSearch={true}
            >
                <SelectBox
                    data={constant ? constant.roles : []}
                    callback={(value) => dispatch(filtersActions.handle({roleId: value.id, perPage: 1}))}
                    search={true}
                />
                <SelectBox
                    data={constant ? constant.status : []}
                    callback={(value) => dispatch(filtersActions.handle({status: value.id}))}
                    search={true}
                />
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
                {lists?.data?.map((item, index) => (
                    <tr key={index} className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            {item.id}
                        </td>
                        <th scope="row" className='p-3 border-left border-dark'>
                            <img className='m-auto' style={{width:'40px', height: '40px', minWidth: '40px'}} src={item.avatar} alt="avatar"/>
                        </th>
                        <th scope="row" className="p-3 font-medium text-gray-900 break-words">
                            {item.name}
                        </th>
                        <td className="p-3 break-words">
                            {item.email}
                        </td>
                        <td className="p-3">
                            {item.phone}
                        </td>
                        <td className="p-3">
                            <Switch
                                class='mx-auto'
                                enabled={item.status}
                                id={item.id}
                                callback={(enabled) => callbackSwitch(enabled, item.id)}
                            />
                        </td>
                        <td className="p-3 text-center">
                            {item.role ? item.role.name : ''}
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

export default AdminIndex

if (document.getElementById("admin-index")) {
    ReactDOM.createRoot(document.getElementById("admin-index")).render (
        <Provider store={ store }>
            <AdminIndex/>
        </Provider>
    )
}