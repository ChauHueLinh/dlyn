import React, { useEffect } from 'react'
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
	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(true)
	const [total, setTotal] = useState(0)


	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		if (cookies.accessToken) {
			axiosAPI.get(url.cart, {
				headers: {
					'Authorization': cookies.accessToken,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				let data = []
				if (response.data.status == true) {
					response.data.result?.map((item, index) => {
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
					})
					data.sort((a, b) => a.id - b.id)
					setData(data)
					setCookie('cart', data)
				}
			})
		} else {
		}
	}, [status])

	const setSelected = (id, checked) => {
		var total = 0
		if (id == 'all') {
			var cart = []

			if (checked == true) {
				data.map((item) => {
					cart.push({
						id: item.id,
						productId: item.productId,
						groupAttribute: item.groupAttribute,
						price: item.price,
						name: item.name,
						image: item.image,
						quantity: item.quantity,
						selected: true,
					})
					total = total + Number(item.quantity * item.price)
				})
			} else {
				data.map((item) => {
					cart.push({
						id: item.id,
						productId: item.productId,
						groupAttribute: item.groupAttribute,
						price: item.price,
						name: item.name,
						image: item.image,
						quantity: item.quantity,
						selected: false,
					})
				})
			}
		} else {
			var cart = data.filter((item) => item.id != id)
			var item = data.filter((item) => item.id == id)[0]

			cart.push({
				id: id,
				productId: item.productId,
				groupAttribute: item.groupAttribute,
				price: item.price,
				name: item.name,
				image: item.image,
				quantity: item.quantity,
				selected: checked == true ? true : false,
			})
		}
		cart.map((item) => {
			if(item.selected == true) {
				total = total + Number(item.quantity * item.price)
			}
		})
		cart.sort((a, b) => a.id - b.id)

		setData(cart)
		setTotal(total)
	}

	const close = () => {
		dispatch(modalActions.close())
		setLoading(false)
		setErrors({})
	}
	// console.log(data.length);
	return (
		<Modal
			display={openDialog}
			callbackClose={() => close()}
			wrapperClass='w-50 h-75'
			btnClose={true}
			containerStyle={{ height: '100vh' }}
		>
			<div className="text-black text-center fw-bold h5">GIỎ HÀNG</div>
			{(loading == false && data.length == 0) ? (
				<div className="text-black">Không có sản phẩm nào</div>
			) : (
				<div className="text-black w-full">
					{data.map((item, index) => (
						<div className="text-black flex space-x-2 border-bottom border-dark" key={index}>
							<div className="flex items-center justify-center px-2">
								<input style={{height: '20px', width: '20px'}} type="checkbox" checked={item.selected == true ? 1 : 0} onChange={(e) => setSelected(item.id, e.target.checked)} />
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
									// onClick={() => minusCartItem()}
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
									// onClick={() => plusCartItem()}
									>
										<i className='bx bx-plus'></i>
									</div>
								</div>
								<div className="text-black">{VND.format(item.price)}</div>
							</div>
							<div className="w-fit text-black my-2 px-3 flex items-center rounded-lg justify-center cursor-pointer bg-warning">Xóa</div>
						</div>
					))}
					<div className="w-full flex justify-content-between mt-2">
						<div className="flex items-center justify-center px-2 space-x-2">
							<input style={{height: '20px', width: '20px'}} type="checkbox"
								checked={data?.filter((item) => item.selected == false)?.length == 0 ? 1 : 0}
								onChange={(e) => setSelected('all', e.target.checked)}
							/>
							<div className="text-black">Chọn tất cả</div>
						</div>
						<div className="text-black flex items-center justify-center">{`Tổng ${VND.format(total)}`}</div>
						<div className="bg-info p-2 rounded-lg">Đặt hàng</div>
					</div>
				</div>
			)}
		</Modal>
	)
}