import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {Provider, useDispatch, useSelector} from 'react-redux'
import axiosAPI from '~/libs/axiosAPI'

import store from '~/components/store'
import {url} from '~/components/pages-user/product/Url'

function ProductIndex() {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    var NUMBER = new Intl.NumberFormat();

    const dispatch    = useDispatch()
    const [lists, setLists]     = useState([])
    const [filters, setFilters] = useState({})
    const [constant, setConstant] = useState({})
    const [paramsConstant, setParamsConstant] = useState({
        productTypeId: ''
    })

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
        }).then((response) => response.json())
        
        setLists(products.result)
    }

    return (
        <div className="bg-light">
            <div className="w-100 flex mx-auto">
                {constant?.productTypes?.map((item) => (
                    <div 
                    className={`w-full p-3 text-black text-center bg-gray ${paramsConstant?.productTypeId != item.id && 'opacity-50'}`} key={item.id}
                    onClick={() => setParamsConstant({...paramsConstant, productTypeId: item.id})}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
            <div className="w-75 mx-auto flex flex-wrap">
                {
                    lists?.map((item) => (
                        <div className="w-25 overflow-hidden mx-auto product-img-user" key={item.id}>
                            <div className="p-2 overflow-hidden relative mx-auto">
                                <div className="absolute pt-1 ps-2 des-img">
                                    <i class='bx text-white bx-heart-circle'></i>
                                </div>
                                <div className="bottom-0 flex left-0 right-0 pt-2 absolute mb-2 text-white des-img overflow-hidden">
                                    <div className="mx-0 w-full bg-body-dark ms-2 p-3">{item.name}</div>
                                    <div className="mx-0 w-full text-end bg-body-dark me-2 p-3">{VND.format(item.price)}</div>
                                </div>
                                <img src={item.mainImage} alt="" className='mx-auto'/>
                            </div>
                        </div>
                    ))
                }
            </div>
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