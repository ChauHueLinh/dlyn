import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import axiosAPI from '~/libs/axiosAPI'

import store from '~/components/store'
import Detail from '~/components/pages-user/product/Detail'
import { url } from '~/components/pages-user/product/Url'
import { modalActions } from '~/components/store/modal-slice'

function ProductIndex() {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var NUMBER = new Intl.NumberFormat();

    const dispatch = useDispatch()
    const [bodyWidth, setBodyWidth] = useState(document.body.clientWidth)
    const [sizeImg, setSizeImg] = useState({
        width: document.body.clientWidth / 16 * 3 + 'px',
        height: document.body.clientWidth / 32 * 9 + 'px',
    })
    const [lists, setLists] = useState([])
    const [filters, setFilters] = useState({})
    const [constant, setConstant] = useState({})
    const [dataItem, setDataItem] = useState({})
    const [loading, setLoading] = useState(false)
    const [paramsConstant, setParamsConstant] = useState({
        productTypeId: ''
    })

    useEffect(() => {
        function handleResize() {
            var widthImg = window.innerWidth / 16 * 3
            var heightImg = widthImg / 2 * 3
            setSizeImg({
                width: widthImg + 'px',
                height: heightImg + 'px'
            })
            setBodyWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        getListFavourite()
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

        console.log(listFavourite);

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

        setLists(products.result)
    }

    const setFavourite = async (productId) => {
        if (loading == true) {
            return false
        } else {
            setLoading(true)

        }
    }

    const openModalDetail = (item) => {
        setDataItem(item)
        dispatch(modalActions.open({
            name: 'detail'
        }))
    }

    return (
        <div className={`bg-body-dark-5`}>
            <div className="w-full bg-body-dark flex flex-wrap top-0 fixed z-1000">
                <div className="w-100 flex" style={{ height: '70px' }}>
                    <div className="w-25 flex items-center h4 ps-4">

                    </div>
                    <div className="w-50">
                        <img src={window.location.origin + '/assets/img/name.png'} alt="" className="mx-auto" style={{ height: '70px' }} />
                    </div>
                    <div className="w-25 flex justify-content-end relative">
                        <div className="w-50 relative">
                            <div className="w-100 flex items-center justify-content-center">
                                <div className="w-100 cursor-pointer flex items-center justify-center">
                                    <a href="abababa"><i className='m-0 py-2 bx bx-bell text-white h3'></i></a>
                                </div>
                                <div className="w-100 cursor-pointer flex items-center justify-center">
                                    <a href="abababa"><i className='m-0 py-2 bx bx-heart text-white h3'></i></a>
                                </div>
                                <div className="w-100 cursor-pointer flex items-center justify-center">
                                    <a href="abababa"><i className='m-0 py-2 bx bx-shopping-bag text-white h3'></i></a>
                                </div>
                                <div className="w-100 cursor-pointer flex items-center justify-center" id="btn-account">
                                    <i className='m-0 py-2 bx bx-user text-white h3'></i>
                                </div>
                            </div>
                            <div className="absolute w-100 radius-15 bg-light d-none text-black shadow-lg py-2 overflow-hidden" id="items-btn-account">
                                <div className="p-2 cursor-pointer option">Thông tin tài khoản</div>
                                <div className="p-2 cursor-pointer option">Đổi mật khẩu</div>
                                {/* <div className="p-2 cursor-pointer option">{{ auth()-> guard('user') -> user() ? 'Đăng xuất' : 'Đăng nhập'}}</div> */}
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
            <div className="w-100 flex mx-auto" style={{height: '107px'}}>
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
                                    <div className="py-2 px-3 rounded-lg mb-1 fw-bold bg-gray text-black" style={{fontSize: '20px'}}>{item.name}</div>
                                    <div className="py-2 px-3 rounded-lg fw-bold bg-gray text-black" style={{fontSize: '20px'}}>{VND.format(item.price)}</div>
                                </div>
                            </div>
                            <div className="des-img absolute right-0 text-end pe-3">
                                <i className='bx bx-heart-circle' style={{fontSize: '50px'}}></i>
                            </div>
                            <img src={item.mainImage} alt="" className={`h-100 rounded-lg min-width-100 mx-auto`}  onClick={() => openModalDetail(item)}/>
                        </div>
                    ))
                }
            </div>
            <Detail
                modalKey='detail'
                callback={() => callbackUpdate()}
                data={dataItem}
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