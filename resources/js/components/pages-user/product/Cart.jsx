import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '~/components/molecules/Modal'
import { modalActions } from '~/components/store/modal-slice'
import axiosAPI from '~/libs/axiosAPI'
import { url } from '~/components/pages-user/product/Url'
import { useCookies } from 'react-cookie';

export default function Cart(props) {
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});

	const dispatch = useDispatch()

	const status = useSelector((state) => state.modal.isOpen)
	const collection = useSelector((state) => state.modal.collection)

	const [cookies, setCookie, removeCookie] = useCookies([])

	const [data, setData] = useState([])
	const [errors, setErrors] = useState([])
	const [loading, setLoading] = useState(true)
	const [total, setTotal] = useState(0)
	const [selectedId, setSelectedId] = useState([])


	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		getList()
	}, [status])

	const getList = async () => {
		if (props?.accessToken != undefined) {
			axiosAPI.get(url.cart, {
				headers: {
					'Authorization': props.accessToken,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				setLoading(false)
				let data = []
				let errors = []
				if (response.data.status == true) {
					response.data.result?.map((item, index) => {
						let attributes = item.product.attributes
						data.push({
							id: index,
							productId: item.product.id,
							name: item.product.name,
							price: item.product.price,
							image: item.product.mainImage,
							groupAttribute: item.groupAttributeName,
							quantity: item.quantity,
							selected: false,
						})
						Object.entries(attributes).map((i) => {
							if (i[0] == item.groupAttributeName) {
								if (item.quantity > i[1].quantity) {
									errors[index] = 'Chỉ còn ' + i[1].quantity + ' sản phẩm'
								}
							}
						})
					})
					data.sort((a, b) => a.id - b.id)

					setData(data)
					setErrors(errors)
				}
			})
		}
	}

	const setSelected = (id, checked) => {
		var total = 0
		if (id == 'all') {
			var cart = []
			var selectedIds = []

			if (checked == true) {
				data.map((item) => {
					selectedIds.push(item.productId)
					total = total + Number(item.quantity * item.price)
				})
			}
		} else {
			var item = data.filter((item) => item.id == id)[0]
			var selectedIds = selectedId

			if (checked == true) {
				selectedIds.push(id)
            } else {
				selectedIds.splice(selectedIds.indexOf(id), 1)
			}
		}
		data.map((item) => {
			if (selectedIds.includes(item.productId) == true) {
				total = total + Number(item.quantity * item.price)
			}
		})

		setTotal(total)
		setSelectedId(selectedIds)
	}

	const minusCartItem = (id, groupAttributeName, status) => {
		if (loading == true) {
			return false
		}
		setLoading(true)

		var form = new FormData
		form.append('productId', id)
		form.append('groupAttributeName', groupAttributeName)
		form.append('status', status)

		axiosAPI.post(url.removeToCart, form, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': props.accessToken,
			}
		}).then((response) => {
			toast.dismiss()
			if (response.data.status == true) {
				toast.success(response.data.message)
				getList()
			} else {
				toast.error(response.data.message)
			}
			setLoading(false)
		})
	}

	const plusCartItem = (id, groupAttributeName) => {
		if (loading == true) {
			return false
		}
		setLoading(true)

		var form = new FormData
		form.append('productId', id)
		form.append('groupAttributeName', groupAttributeName)
		form.append('quantity', 1)

		axiosAPI.post(url.addToCart, form, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': props.accessToken,
			}
		}).then((response) => {
			toast.dismiss()
			if (response.data.status == true) {
				toast.success(response.data.message)
				getList()
			} else {
				toast.error(response.data.message)
			}
			setLoading(false)
		})
	}

	const handleBtnOrder = () => {
		var error = false;
		var selected = []

		data.map((item, index) => {
			if(selectedId.includes(item.productId) == true) {
				if(errors[index]) {
					error = true
				}
				selected.push(item)
			}
		})
		if(error == true) {
			toast.dismiss()
			toast.error('Sản phẩm đã đạt giới hạn.')
			return false
		}

		close()
		props.callbackOpenBill(selected)
	}

	const close = () => {
		dispatch(modalActions.close())
		setLoading(false)
		setSelectedId([])
	}

	return (
		<Modal
			display={openDialog}
			callbackClose={() => close()}
			wrapperClass='w-50 h-75'
			btnClose={true}
			containerStyle={{ height: '100vh' }}
		>
			<div className="w-100 overflow-hidden transition-10">
				<div className="text-black text-center fw-bold h5">GIỎ HÀNG</div>
				{(loading == false && data.length == 0) ? (
					<div className="text-black">Không có sản phẩm nào</div>
				) : (
					<div className="text-black w-full">
						{data.map((item, index) => (
							<div className="text-black flex space-x-2 border-bottom border-dark" key={index}>
								<div className="flex items-center justify-center px-2">
									<input style={{ height: '20px', width: '20px' }} type="checkbox" checked={selectedId.includes(item.productId) == true ? 1 : 0} onChange={(e) => setSelected(item.productId, e.target.checked)} />
								</div>
								<div className="w-fit py-2">
									<img src={item.image} alt="" style={{ width: '60px' }} />
								</div>
								<div className="text-black py-2 ps-2 w-100">
									<div className="h5">{item.name}</div>
									<div className="">{`Phân loại: ${item.groupAttribute}`}</div>
									<div className="flex flex-wrap mt-2">
										<div
											className="cursor-pointer me-2 mb-2 btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center"
											style={{ height: '25px' }}
											onClick={() => minusCartItem(item.productId, item.groupAttribute, 'minus')}
										>
											<i className='bx bx-minus'></i>
										</div>
										<div
											className="me-2 mb-2 border border-dark rounded-lg fw-bold flex items-center justify-center px-2"
											style={{ height: '25px', minWidth: '25px' }}
										>
											{item.quantity}
										</div>
										<div
											className="cursor-pointer me-2 mb-2 btn-minus equal border border-dark rounded-lg fw-bold flex items-center justify-center"
											style={{ height: '25px' }}
											onClick={() => plusCartItem(item.productId, item.groupAttribute)}
										>
											<i className='bx bx-plus'></i>
										</div>
									</div>
									<div className="text-black">{VND.format(item.price)}</div>
									{errors[index] && (
										<div className="text-red">{errors[index]}</div>
									)}
								</div>
								<div
									className="w-fit text-black my-2 px-3 flex items-center rounded-lg justify-center cursor-pointer"
								>
									<i className='bx bx-trash text-red' style={{fontSize: '30px'}} onClick={() => minusCartItem(item.productId, item.groupAttribute, 'delete')}></i>
								</div>
							</div>
						))}
						<div className="w-full flex justify-content-between mt-2">
							<div className="w-full flex items-center p-2 space-x-2">
								<input style={{ height: '20px', width: '20px' }} type="checkbox"
									checked={data?.length == selectedId?.length ? 1 : 0}
									onChange={(e) => setSelected('all', e.target.checked)}
								/>
								<div className="text-black">Chọn tất cả</div>
							</div>
							<div className="w-full text-black flex items-center justify-center">{`Tổng ${VND.format(total)}`}</div>
							{selectedId.length > 0 ? (
								<div className="w-full flex justify-content-end">
									<div className="w-fit cursor-pointer bg-warning p-2 rounded-lg" onClick={() => handleBtnOrder()}>Đặt hàng</div>
								</div>
							) : (
								<div className="w-full"></div>
							)}
						</div>
					</div>
				)}
			</div>
		</Modal>
	)
}