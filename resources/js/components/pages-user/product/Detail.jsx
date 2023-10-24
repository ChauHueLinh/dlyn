import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import Modal from '~/components/molecules/Modal'
import {modalActions} from '~/components/store/modal-slice'

export default function Detail(props) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const dispatch   = useDispatch()
    const status     = useSelector((state) => state.modal.isOpen)
    const collection = useSelector((state) => state.modal.collection)

    const [errors, setErrors]         = useState({})
    const [images, setImages]         = useState([])
    const [focusImg, setFocusImg]     = useState(props.data.mainImage)
    const [loading, setLoading]       = useState(false)
    const [data, setData]             = useState(props.data)
    const [cartItem, setCartItem]     = useState({})

    const openDialog = collection.name == props.modalKey && status

    useEffect(() => {
        var imgs = []

        imgs.push(props?.data?.mainImage)
        props?.data?.descriptionImages?.map((item) => {
            imgs.push(item?.src)
        })
        props.data.attributes && 
            setCartItem({...cartItem,
                groupName: Object.entries(props.data.attributes)[0][0],
                maxQuantity: Object.entries(props.data.attributes)[0][1]?.quantity,
                productId: props.data.id,
                quantity: 1,
            });

        setImages(imgs)
        setData(props.data)
        setFocusImg(props.data.mainImage)

    }, [props.data, status])

    const minusCartItem = () => {
        if(cartItem.quantity == 1) {
            return false
        } else {
            delete errors['maxQuantity']
            setCartItem({...cartItem, quantity: cartItem.quantity - 1})
        }
    }

    const plusCartItem = () => {
        if(cartItem.quantity == cartItem.maxQuantity) {
            toast.dismiss()
            toast.error('Sản phẩm đã đạt giới hạn.')
            return false
        } else {
            setCartItem({...cartItem, quantity: cartItem.quantity + 1})
        }
    }

    const close = () => {
        dispatch(modalActions.close())
        setLoading(false)
        setErrors({})
        setCartItem({})
    }

    return (
        <Modal
            display={openDialog}
            callbackClose={() => close()}
			wrapperClass='w-50'
            btnClose={true}
            containerStyle={{height: '100vh'}}
        >
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="w-100 m-auto flex mt-6 text-black">
                <div className="w-100 flex space-x-6">
                    <div className="w-50">
                        <img src={focusImg ?? ''} alt="" className='w-75 m-auto' />
                        <div className="w-100 flex space-x-2 mt-2">
                            {images?.map((item, index) => (
                                <div 
                                    className={`cursor-pointer equal overflow-hidden object-fit-cover ${item != focusImg && 'opacity-50'}`} 
                                    style={{width: '300px'}}
                                    key={index}
                                    onClick={() => setFocusImg(item)}
                                >
                                    <img src={item ?? ''} alt="" className='w-100' /> 
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-50">
                        <div className="" style={{fontSize: '40px'}}>{data?.name}</div>
                        <div className="pt-4 font-weight-light" style={{fontSize: '40px'}}>{VND.format(data.price)}</div>
                        <div className="pt-4 font-weight-light">Danh mục: {data?.productTypeName}</div>
                        <div className="flex space-x-2 mt-4">
                            {data?.attributes && Object?.entries(data?.attributes)?.map((item) => (
                                <div 
                                    className={`cursor-pointer p-2 border border-dark rounded-lg text-center fw-bold ${item[0] == cartItem.groupName && 'bg-secondary'} ${item[1].quantity == 0 && 'opacity-75'}`} style={{minWidth: '70px'}} 
                                    key={item[0]}
                                    onClick={() => setCartItem({...cartItem, groupName: item[1].name, maxQuantity: item[1].quantity})}
                                >
                                    {item[1].name}
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <div 
                                className="cursor-pointer btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center" 
                                style={{height: '32px'}}
                                onClick={() => minusCartItem()}
                            >
                                <i className='bx bx-minus'></i>
                            </div>
                            <div 
                                className="cursor-pointer border border-dark rounded-lg fw-bold flex items-center justify-center px-2" 
                                style={{height: '32px', minWidth: '32px'}}
                            >
                                {cartItem.quantity}
                            </div>
                            <div 
                                className="cursor-pointer btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center" 
                                style={{height: '32px'}}
                                onClick={() => plusCartItem()}
                            >
                                <i className='bx bx-plus'></i>
                            </div>
                            <div 
                                className="cursor-pointer btn-minus border border-dark rounded-lg fw-bold flex items-center justify-center px-2" 
                                style={{height: '32px', minWidth: '32px'}}
                            >
                                Thêm vào giỏ hàng
                            </div>
                        </div>
                        <div className="mt-3">Hỗ trợ chọn size</div>
                        <div className="w-100 border border-dark overflow-hidden">
                            <img src={window.location.origin + '/assets/img/size-vay.png'} alt="" className='w-100'/>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}