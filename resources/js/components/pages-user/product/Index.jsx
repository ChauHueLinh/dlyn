import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {Provider, useDispatch, useSelector} from 'react-redux'
import axiosAPI from '~/libs/axiosAPI'

import store from '~/components/store'
import Detail from '~/components/pages-user/product/Detail'
import {url} from '~/components/pages-user/product/Url'
import {modalActions} from '~/components/store/modal-slice'

function ProductIndex() {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var NUMBER = new Intl.NumberFormat();

    const dispatch    = useDispatch()
    const [bodyWidth, setBodyWidth] = useState(document.body.clientWidth)
    const [sizeImg, setSizeImg] = useState({
        width: document.body.clientWidth / 16 * 3 + 'px',
        height: document.body.clientWidth / 32 * 9 + 'px',
    })
    const [lists, setLists]     = useState([])
    const [filters, setFilters] = useState({})
    const [constant, setConstant] = useState({})
    const [dataItem, setDataItem] = useState({})
    const [loading, setLoading] = useState(true)
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
    }, [])

    useEffect(() => {
        getConstant()
        getList()
    }, [paramsConstant])
    
    const getConstant = async() => {
        var product_types = await fetch(url.productTypes + JSON.stringify(paramsConstant), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json())
        
        product_types?.data?.unshift({id: '', name: 'TẤT CẢ'})
        
        setConstant({...constant,
            productTypes: product_types.data
        })
    }
    
    const getList = async() => {
        var products = await fetch(url.products + JSON.stringify(paramsConstant), {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then((response) => response.json()).then(setLoading(false))
        
        setLists(products.result)
    }

    const openModalDetail = (item) => {
        setDataItem(item)
        dispatch(modalActions.open({
            name: 'detail'
        }))
    }

    return (
        <div className={`bg-light`}>
            <div className="w-100 flex mx-auto">
                {constant?.productTypes?.map((item) => (
                    <div 
                    className={`w-full cursor-pointer p-3 text-black text-center bg-gray ${paramsConstant?.productTypeId != item.id && 'opacity-50'}`} key={item.id}
                    onClick={() => setParamsConstant({...paramsConstant, productTypeId: item.id})}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
            <div className={`w-75 mx-auto flex flex-wrap py-3`}>
                {
                    lists?.map((item) => (
                        <div className={`cursor-pointer overflow-hidden relative mx-auto product-img-user w-25`} key={item.id} onClick={() => openModalDetail(item)}>
                            <div className="p-2 relative">
                                <div className="overflow-hidden relative mx-auto">
                                    <div className="bottom-0 flex left-0 right-0 pt-2 absolute mb-2 text-white des-img overflow-hidden">
                                        <div className="mx-0 w-full bg-gray text-black ms-2 p-3">{item.name}</div>
                                        <div className="mx-0 w-full text-end bg-gray text-black me-2 p-3">{VND.format(item.price)}</div>
                                    </div>
                                    <div className="absolute pt-1 ps-2 des-img">
                                        <i className='bx text-white bx-heart-circle'></i>
                                    </div>
                                    <img src={item.mainImage} alt="" className='mx-auto' style={{height: sizeImg.height, width: 'auto'}}/>
                                </div>
                            </div>
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
    ReactDOM.createRoot(document.getElementById("user-product-index")).render (
        <Provider store={store}>
            <ProductIndex/>
        </Provider>
    )
}