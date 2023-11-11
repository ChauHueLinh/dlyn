import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '~/components/molecules/Modal'
import { modalActions } from '~/components/store/modal-slice'
import axiosAPI from '~/libs/axiosAPI'
import { url } from '~/components/pages-user/product/Url'
import { useCookies } from 'react-cookie';

export default function Detail(props) {
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	
	const dispatch = useDispatch()
	
	const status 			= useSelector((state) => state.modal.isOpen)
	const collection 	= useSelector((state) => state.modal.collection)
	
	const [cookies, setCookie, removeCookie] = useCookies([])
	
	const [data, setData] 											= useState(props.data)
	const [errors, setErrors] 									= useState({})
	const [images, setImages] 									= useState([])
	const [loading, setLoading] 								= useState(false)
	const [focusImg, setFocusImg] 							= useState(props.data.mainImage)
	const [cartItem, setCartItem] 							= useState({})
	const [similarProducts, serSimilarProducts] = useState([])
	
	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		var imgs = []

		imgs.push(props?.data?.mainImage)
		props?.data?.descriptionImages?.map((item) => {
			imgs.push(item?.src)
		})
		props.data.attributes &&
			setCartItem({
				...cartItem,
				groupName: Object.entries(props.data.attributes)[0][0],
				maxQuantity: Object.entries(props.data.attributes)[0][1]?.quantity,
				productId: props.data.id,
				quantity: 1,
			});

		setImages(imgs)
		setData(props.data)
		setFocusImg(props.data.mainImage)
		getSimilarProducts(props.data.id)
	}, [props.data, status])

	const minusCartItem = () => {
		if (cartItem.quantity == 1) {
			return false
		} else {
			delete errors['maxQuantity']
			setCartItem({ ...cartItem, quantity: cartItem.quantity - 1 })
		}
	}

	const plusCartItem = () => {
		if (cartItem.quantity == cartItem.maxQuantity) {
			toast.dismiss()
			toast.error('Sản phẩm đã đạt giới hạn.')
			return false
		} else {
			setCartItem({ ...cartItem, quantity: cartItem.quantity + 1 })
		}
	}

	const getSimilarProducts = async (productId) => {
		if (productId) {
			let params = {
				productId: productId,
			}
			axiosAPI.get(url.similarProducts, { params: params }, {
				headers: {
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				serSimilarProducts(response.data.result)
			})
		}
	}

	const setMainProduct = (item) => {
		let imgs = []

		imgs.push(item?.mainImage)
		item?.descriptionImages?.map((item) => {
			imgs.push(item?.src)
		})
		item.attributes &&
			setCartItem({
				...cartItem,
				groupName: Object.entries(item.attributes)[0][0],
				maxQuantity: Object.entries(item.attributes)[0][1]?.quantity,
				productId: item.id,
				quantity: 1,
			});

		setImages(imgs)
		setData(item)
		setFocusImg(item.mainImage)
		getSimilarProducts(item.id)
	}

	const addToCart = () => {
		let form = new FormData
				form.append('productId', cartItem.productId)
				form.append('quantity', cartItem.quantity)
				form.append('groupAttributeName', cartItem.groupName)
		let cart = cookies.cart ?? []

		cart.push({
			productId: cartItem.productId,
			groupAttributeName: cartItem.groupName,
			quantity: cartItem.quantity,
		})
		if(cookies.accessToken) {
			axiosAPI.post(url.addToCart, form, {headers: {
				'Authorization': props.accessToken,
				'Content-Type': 'application/json',
			}}).then((response) => {
				console.log(response);
				toast.dismiss()
				if(response.data.status == true) {
					toast.success(response.data.message)

					close()
				} else if(response.data.status == false) {
					toast.error(response.data.message)
				}
			})
			setCookie('cart', cart)
		} else {
			close()
			props.callbackOpenLogin()
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
			wrapperClass='w-50 h-75'
			btnClose={true}
			containerStyle={{ height: '100vh' }}
		>
			<div className="w-100 m-auto flex mt-6 text-black overflow-auto">
				<div className="w-100 flex">
					<div className="w-50 me-2">
						{images?.map((item, index) => (
							<img src={item} alt="" className={`m-auto transition-10 ${item == focusImg ? 'w-75 opacity-100' : 'w-0 opacity-0'}`} key={index} />
						))}
						<div className="w-100 flex space-x-2 mt-2">
							{images?.map((item, index) => (
								<div
									className={`cursor-pointer equal overflow-hidden object-fit-cover transition-10 ${item != focusImg && 'opacity-25'}`}
									style={{ width: '300px' }}
									key={index}
									onClick={() => setFocusImg(item)}
								>
									<img src={item ?? ''} alt="" className='w-100' />
								</div>
							))}
						</div>
					</div>
					<div className="w-50 ms-2">
						<div className="" style={{ fontSize: '40px' }}>{data?.name}</div>
						<div className="pt-4 font-weight-light" style={{ fontSize: '40px' }}>{VND.format(data.price)}</div>
						<div className="pt-4 font-weight-light">Danh mục: {data?.productTypeName}</div>
						<div className="flex flex-wrap mt-4">
							{data?.attributes && Object?.entries(data?.attributes)?.map((item) => (
								<div
									className={`cursor-pointer p-2 border border-dark rounded-lg text-center fw-bold me-2 mb-2 ${item[0] == cartItem.groupName && 'bg-secondary'} ${item[1].quantity == 0 && 'opacity-25'}`} style={{ minWidth: '70px' }}
									key={item[0]}
									onClick={() => {
										if (item[1].quantity == 0) {
											return false
										}
										setCartItem({ ...cartItem, groupName: item[1].name, maxQuantity: item[1].quantity })
									}}
								>
									{item[1].name}
								</div>
							))}
						</div>
						<div className="text-black">Kho: {cartItem.maxQuantity}</div>
						<div className="flex flex-wrap mt-2">
							<div
								className="cursor-pointer me-2 mb-2 btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center"
								style={{ height: '32px' }}
								onClick={() => minusCartItem()}
							>
								<i className='bx bx-minus'></i>
							</div>
							<div
								className="cursor-pointer me-2 mb-2 border border-dark rounded-lg fw-bold flex items-center justify-center px-2"
								style={{ height: '32px', minWidth: '32px' }}
							>
								{cartItem.quantity}
							</div>
							<div
								className="cursor-pointer me-2 mb-2 btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center"
								style={{ height: '32px' }}
								onClick={() => plusCartItem()}
							>
								<i className='bx bx-plus'></i>
							</div>
							<div
								className="cursor-pointer me-2 mb-2 btn-minus border border-dark rounded-lg fw-bold flex items-center justify-center px-2"
								style={{ height: '32px', minWidth: '32px' }}
								onClick={() => addToCart()}
							>
								Thêm vào giỏ hàng
							</div>
						</div>
						<div className="mt-3">Hỗ trợ chọn size</div>
						<div className="w-100 border border-dark overflow-hidden bottom-0">
							<a href={window.location.origin + '/assets/img/size-vay.png'} target='blank'>
								<img src={window.location.origin + '/assets/img/size-vay.png'} alt="" className='w-100' />
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-6 mb-4 text-black text-center h5">Sản phẩm cùng danh mục</div>
			<div className="flex justify-content-between h-fit space-x-2">
				{similarProducts?.map((item, index) => (
					<div className="w-25 rectangular-2-3 overflow-hidden" key={index}>
						<img
							src={item.mainImage}
							className='min-width-100 h-full mx-auto rounded-lg'
							onClick={() => setMainProduct(item)}
						/>
					</div>
				))}
			</div>
		</Modal>
	)
}