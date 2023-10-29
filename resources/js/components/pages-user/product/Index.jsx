import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import axiosAPI from '~/libs/axiosAPI'
import Pagination from '@mui/material/Pagination';
import { useCookies } from "react-cookie";
  

import store from '~/components/store'
import Detail from '~/components/pages-user/product/Detail'
import Login from '~/components/pages-user/user/Login'
import Register from '~/components/pages-user/user/Register'
import { url } from '~/components/pages-user/product/Url'
import { modalActions } from '~/components/store/modal-slice'
import toast, {Toaster} from 'react-hot-toast';

function ProductIndex() {
    const btnUserItems = useRef(null);
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    const NUMBER = new Intl.NumberFormat();
    const PER_PAGE = 9

    const dispatch = useDispatch()

    const [lists, setLists]                     = useState([])
    const [cookies, setCookie, removeCookie]    = useCookies([])
    const [constant, setConstant]               = useState({})
    const [dataItem, setDataItem]               = useState({})
    const [loading, setLoading]                 = useState(false)
    const [user, setUser]                       = useState({})
    const [pagination, setPagination]           = useState({
        count: 1,
        page: 1,
    })
    const [paramsConstant, setParamsConstant] = useState({
        productTypeId: '',
        per_page: PER_PAGE,
        page: 1,
    })

    useEffect(() => {
        function handleResize() {
            var widthImg = window.innerWidth / 16 * 3
            var heightImg = widthImg / 2 * 3
            // setSizeImg({
            //     width: widthImg + 'px',
            //     height: heightImg + 'px'
            // })
            // setBodyWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        getListFavourite()
        setUser({
            id: cookies.userId,
            name: cookies.userName,
            accessToken: cookies.accessToken,
        })
    }, [])

    useEffect(() => {
        getConstant()
        getList()
    }, [paramsConstant])

    const getConstant = async () => {
        var product_types = await fetch(url.productTypes + JSON.stringify(paramsConstant), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json())

        var listFavourite = await fetch(url.favourite, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json())

        product_types?.data?.unshift({ id: '', name: 'TẤT CẢ' })

        setConstant({
            ...constant,
            productTypes: product_types.data
        })
    }

    const getListFavourite = async () => {

        var listFavourite = await fetch(url.favourite, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json())  

        // setConstant({...constant,
        //     favourite: product_types.data
        // })
    }

    const getList = async () => {
        var products = await fetch(url.products + JSON.stringify(paramsConstant), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json()).then(setLoading(false))

        setPagination({
            count: products.result.lastPage,
            page: products.result.currentPage
        })
        setLists(products.result.products)
    }

    const setFavourite = async (productId) => {
        if (loading == true) {
            return false
        } else {
            setLoading(true)

        }
    }

    const handlePagination = (event, value) => {
        setPagination({...pagination,
            page: value
        })
    }

    const handleClickBtnUser = () => {
        if(btnUserItems.current.classList.contains('d-none') == false) {
            btnUserItems.current.classList.add('d-none')
        } else {
            btnUserItems.current.classList.remove('d-none')
        }
    }

    const logout = () => {
        let form = new FormData()
            form.append('accessToken', cookies.accessToken ?? '')
            form.append('_method', 'DELETE')

        axiosAPI.post(url.logout, form, {headers: {
            'Authorization': cookies.accessToken,
            'Content-Type': 'application/json'
        }})
        .then((response) => {
            toast.dismiss()
            toast.success('Đăng xuất thành công.')
            removeCookie(['accessToken'])
            removeCookie(['userId'])
            removeCookie(['userName'])
            setUser({})
        })
        btnUserItems.current.classList.add('d-none')
    }

    const openModalDetail = (item) => {
        setDataItem(item)
        dispatch(modalActions.open({
            name: 'detail'
        }))
    }

    const openModalLogin = () => {
        btnUserItems.current.classList.add('d-none')
        dispatch(modalActions.open({
            name: 'login'
        }))
    }

    const openModalRegister = () => {
        btnUserItems.current.classList.add('d-none')
        dispatch(modalActions.open({
            name: 'register'
        }))
    }

    // const callbackRegister = () => {
    //     console.log(cookies);
    //     setUser({
    //         id: cookies.userId,
    //         name: cookies.userName,
    //         accessToken: cookies.accessToken,
    //     })
    // }
    console.log(user);
    return (
        <div className={`bg-body-dark-5`}>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="w-full bg-body-dark flex flex-wrap top-0 fixed z-16">
                <div className="w-100 flex" style={{ height: '70px' }}>
                    <div className="w-25 flex items-center h4 ps-4">

                    </div>
                    <div className="w-50">
                        <img src={window.location.origin + '/assets/img/name.png'} alt="" className="mx-auto" style={{ height: '70px' }} />
                    </div>
                    <div className="w-25 relative">
                        <div className="w-100 relative">
                            <div className="w-100 flex items-center justify-content-end">
                                <div className="w-50"></div>
                                <div className="w-50 flex items-center justify-content-center">
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-bell text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-heart text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-shopping-bag text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center" onClick={() => handleClickBtnUser()}>
                                        <i className='m-0 py-2 bx bx-user text-white h3'></i>
                                    </div>
                                </div>
                            </div>
                            <div 
                                className="absolute w-fit rounded-lg d-none bg-light text-black shadow-lg py-2 overflow-hidden right-0" 
                                ref={btnUserItems}
                                onBlur={() => btnUserItems?.current?.classList?.remove('d-none')}
                                
                            >
                                {(user?.accessToken) ? (
                                    <div className="">
                                        <div className="py-2 px-3 cursor-pointer option text-break">Thông tin tài khoản</div>
                                        <div className="py-2 px-3 cursor-pointer option text-break">Đổi mật khẩu</div>
                                        <div className="py-2 px-3 cursor-pointer option text-break" onClick={() => logout()}>Đăng xuất</div>
                                    </div>
                                ) : (
                                    <div className="">
                                        <div className="py-2 px-3 cursor-pointer option text-break" onClick={() => openModalLogin()}>Đăng nhập</div>
                                        <div className="py-2 px-3 cursor-pointer option text-break" onClick={() => openModalRegister()}>Đăng ký</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-75 mx-auto m-0 flex justify-content-around" id="header-menu">
                    <div className="flex items-center justify-center cursor-pointer w-100 py-2">
                        <a href={url.dashboard} className="text-white">
                            GIỚI THIỆU
                        </a>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer w-100 py-2 bg-light text-black rounded-top">
                        SẢN PHẨM
                    </div>
                    <div className="flex items-center justify-center cursor-pointer py-2 w-100 text-white">BỘ SƯU TẬP</div>
                    <div className="flex items-center justify-center cursor-pointer py-2 w-100 text-white">SHOWROOM</div>
                </div>
            </div>
            <div className="w-100 flex mx-auto" style={{marginTop: '107px'}}>
                {constant?.productTypes?.map((item) => (
                    <div
                        className={`w-full cursor-pointer p-3 text-black text-center bg-gray ${paramsConstant?.productTypeId != item.id && 'opacity-50'}`} key={item.id}
                        onClick={() => setParamsConstant({ ...paramsConstant, productTypeId: item.id })}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
            <div className={`vw-75 mx-auto py-3 grid-container`}>
                {
                    lists?.map((item, index) => (
                        <div className={`relative cursor-pointer overflow-hidden rounded-lg product-img-user ${'item-' + index}`} key={item.id}>
                            <div className="w-100 absolute p-2 bottom-0">
                                <div className="w-100 overflow-hidden des-img">
                                    <div className="py-2 w-fit px-3 rounded-lg mb-1 fw-bold bg-gray text-black" style={{fontSize: '20px'}}>{item.name}</div>
                                    <div className="py-2 w-fit px-3 rounded-lg fw-bold bg-gray text-black" style={{fontSize: '20px'}}>{VND.format(item.price)}</div>
                                </div>
                            </div>
                            <div className="des-img absolute right-0 text-end pe-3" onClick={() => {
                                setCookie('accessToken', '')
                                setAccessToken('1')
                            }}>
                                <i className='bx bx-heart-circle' style={{fontSize: '50px'}}></i>
                            </div>
                            <img src={item.mainImage} alt="" className={`h-100 rounded-lg min-width-100 mx-auto`}  onClick={() => openModalDetail(item)}/>
                        </div>
                    ))
                }
            </div>
            {pagination?.count > 1 && (
                 <div className="w-100 pb-4">
                    <div className="w-fit mx-auto">
                        <Pagination 
                            count={pagination?.count} 
                            page={pagination?.page} 
                            onChange={handlePagination} 
                            color="secondary"
                            defaultPage={pagination?.page}
                        />
                    </div>
                </div>
            )}
            <Detail
                modalKey='detail'
                data={dataItem}
            />
            <Login
                modalKey='login'
                callbackLogin={(value) => setUser(value)}
                callbackOpenRegister={() => openModalRegister()}
            />
            <Register
                modalKey='register'
                callbackRegister={(value) => setUser(value)}
                callbackOpenLogin={() => openModalLogin()}
            />
        </div>
    )
}

export default ProductIndex

if (document.getElementById("user-product-index")) {
    ReactDOM.createRoot(document.getElementById("user-product-index")).render(
        <Provider store={store}>
            <ProductIndex />
        </Provider>
    )
}