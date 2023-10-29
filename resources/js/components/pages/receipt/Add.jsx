import React, { use, useEffect } from 'react'
import toast from 'react-hot-toast'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axios from '~/libs/axios'
import Modal from '~/components//molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components//molecules/SelectBox'
import Textarea from '~/components//molecules/Textarea'

import { url } from '~/components/pages/receipt/Url'
import { modalActions } from '~/components/store/modal-slice'

export default function Add(props) {
	const dispatch = useDispatch()
	const status = useSelector((state) => state.modal.isOpen)
	const collection = useSelector((state) => state.modal.collection)

	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [listUserOnPhone, setListUserOnPhone] = useState([])
	const [listUserOnEmail, setListUserOnEmail] = useState([])
	const [products, setProducts] = useState([])
	const [data, setData] = useState({
		status: 0
	})
	const [totalReceipt, setTotalReceipt] = useState({})
	const [couponReceipt, setCouponReceipt] = useState({})

	const openDialog = collection.name == props.modalKey && status

	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});

	useEffect(() => {
		setValueTotalReceipt()
	}, [products, data.coupon])

	const handler = (e) => {
		e.preventDefault()

		if (errors.avatar) {
			return false
		}

		setLoading(true)

		let form = new FormData()
		form.append('userId', data.userId ?? '')
		form.append('name', data.name ?? '')
		form.append('phone', data.phone ?? '')
		form.append('email', data.email ?? '')
		form.append('address', data.address ?? '')
		form.append('couponId', data?.coupon?.id ?? '')
		form.append('status', data?.status ?? '')
		form.append('note', data?.note ?? '')
		products?.length > 0 && products.map((item) => {
			if (item.productId != '' && item.quantity > 0) {
				form.append('products[]', JSON.stringify({
					productId: item.productId,
					quantity: item.quantity,
				}))
			}
		})

		axios.post(url.store, form)
			.then((e) => {
				toast.dismiss()
				if (e.data.status == true) {
					toast.success(e.data.message)
					dispatch(modalActions.loadingTable(true))
					props.callback()

					close()
				} else if (e.data.status == false) {
					toast.error(e.data.message)
					setErrors(e.data.errors)
					dispatch(modalActions.loading(false))
					dispatch(modalActions.loadingTable(false))
					setLoading(false)
				} else {
					setErrors(e.data.errors)
					dispatch(modalActions.loading(false))
					dispatch(modalActions.loadingTable(false))
					setLoading(false)
				}
			})
	}

	const getUser = async (phone, email, provider) => {
		if (phone.length < 5 && provider == 'phone') {
			setListUserOnPhone([])
			return false
		}
		if (email.length < 5 && provider == 'email') {
			setListUserOnEmail([])
			return false
		}

		let res = await axios.get(url.users, { params: { phone: phone, email: email } })
		if (provider == 'phone') {
			setListUserOnPhone(res.data)
		} else if (provider == 'email') {
			setListUserOnEmail(res.data)
		}
	}

	const addProduct = () => {
		let arr = products
		if (products?.length < 1) {
			arr.push({ id: 1, productId: '', price: '', quantity: 0, total: 0 })
		} else {
			let id = products.at(-1).id + 1
			arr.push({ id: id, productId: '', price: '', quantity: 0, total: 0 })
		}
		setProducts([...arr])
	}

	const setAttributesProducts = (id, value) => {
		const new_products = products?.filter((item) => item.id != id)

		if(value.id != '') {
			new_products.push({ id: id, productId: value.id, price: value.price, quantity: 0, total: 0 })
		} else {
			new_products.push({ id: id, productId: '', price: 0, quantity: 0, total: 0 })
		}
		new_products.sort((a, b) => a.id - b.id)

		setProducts([...new_products])
	}

	const setQuantityProduct = (id, productId, price, quantity) => {
		const new_products = products?.filter((item) => item.id != id)
		if (quantity > 0) {
			let total = price * quantity

			new_products.push({ id: id, productId: productId, price: price, quantity: quantity, total: total })
			new_products.sort((a, b) => a.id - b.id)

			setProducts([...new_products])
		}

	}

	const removeProduct = (id) => {
		const new_products = products?.filter((item) => item.id != id)

		setProducts([...new_products])
	}

	const setValueTotalReceipt = () => {
		let total_receipt = 0
		products?.map((item) => {
			total_receipt = total_receipt + item.total
		})

		setTotalReceipt(total_receipt)
		setValueCouponReceipt(total_receipt)
	}

	const setValueCouponReceipt = (total_receipt) => {
		let coupon_receipt = 0
		if (data.coupon) {
			if (data.coupon.unit == 'VND') {
				if (data.coupon.value > total_receipt) {
					coupon_receipt = total_receipt
				} else {
					coupon_receipt = data.coupon.value
				}
			} else if (data.coupon.unit == '%') {
				coupon_receipt = total_receipt * data.coupon.value / 100
			}
		}

		setCouponReceipt(coupon_receipt)
	}

	const close = () => {
		dispatch(modalActions.close())
		setLoading(false)
		setErrors({})
	}

	return (
		<Modal
			display={openDialog}
			callbackClose={() => close()}
			btnClose={true}
			wrapperClass='w-75'
		>
			<h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới hóa đơn</h2>
			<div className="flex space-x-6 mb-4">
				<div className="w-50">
					<Input
						id='name'
						name='name'
						type='text'
						value={data?.name}
						labelName='Tên khách hàng'
						placeholder="Nhập tên"
						isRequired={true}
						validate={errors}
						containerClass='w-full mb-4'
						onChange={(value) => {
							setData({ ...data, name: value })
						}}
					/>
					<div className="mb-2 text-sm font-medium text-gray-900 flex items-center space-x-2 mt-4">
						<div className="">Số điện thoại</div>
						<div className="text-red-500">*</div>
					</div>
					<div className='relative'>
						<Input
							id='phone'
							name='phone'
							type='text'
							value={data?.phone}
							placeholder="Nhập số điện thoại"
							isRequired={true}
							validate={errors}
							containerClass='w-full'
							onChange={(value) => {
								setData({ ...data, phone: value })
								getUser(value, '', 'phone')
							}}
						/>
						{listUserOnPhone?.length > 0 &&
							<div
								className='absolute w-full py-1 rounded-lg overflow-auto border border-gray-300  bg-white z-15'
								style={{ maxHeight: '100px', height: 'fit-content' }}
							>
								{listUserOnPhone?.map((item) => (
									<div
										className='option p-2'
										key={item.id}
										onClick={() => {
											setData({
												...data,
												userId: item.id,
												name: item.name,
												phone: item.phone,
												email: item.email,
												address: item.address,
											})
											setListUserOnPhone([])
										}}
									>
										{item.name + ' (' + item.phone + ')'}
									</div>
								))}
							</div>
						}
					</div>
					<div className="mb-2 text-sm font-medium text-gray-900 flex items-center space-x-2 mt-4">
						<div className="">Email</div>
						<div className="text-red-500">*</div>
					</div>
					<div className='relative'>
						<Input
							id='email'
							name='email'
							type='text'
							value={data?.email}
							placeholder="Nhập email"
							isRequired={true}
							validate={errors}
							containerClass='w-full'
							onChange={(value) => {
								setData({ ...data, email: value })
								getUser('', value, 'email')
							}}
						/>
						{listUserOnEmail?.length > 0 &&
							<div
								className='absolute w-full py-1 rounded-lg overflow-auto border border-gray-300  bg-white z-15'
								style={{ maxHeight: '100px', height: 'fit-content' }}
							>
								{listUserOnEmail?.map((item) => (
									<div
										className='option p-2'
										key={item.id}
										onClick={() => {
											setData({
												...data,
												id: item.id,
												name: item.name,
												phone: item.phone,
												email: item.email,
												address: item.address,
											})
											setListUserOnEmail([])
										}}
									>
										{item.name + ' (' + item.email + ')'}
									</div>
								))}
							</div>
						}
					</div>
					<Input
						id='address'
						name='address'
						type='text'
						value={data?.address}
						labelName='Địa chỉ'
						placeholder="Nhập địa chỉ"
						isRequired={true}
						validate={errors}
						containerClass='w-full my-4'
						onChange={(value) => {
							setData({ ...data, address: value })
						}}
					/>
					<SelectBox
						name='couponId'
						label='Mã giảm giá'
						data={props.constant.coupons ?? []}
						callback={(value) => { setData({ ...data, coupon: value }) }}
						search={true}
						validate={errors}
					/>
					<SelectBox
						name='couponId'
						label='Trạng thái'
						value={data?.status}
						data={props.constant.status ?? []}
						callback={(value) => { setData({ ...data, status: value.id }) }}
						containerClass='mt-4'
						validate={errors}
					/>
					<Textarea
						name='note'
						labelName='Ghi chú'
						placeholder='Nhập ghi chú'
						validate={errors}
						containerClass='mt-4'
						onChange={(value) => setData({ ...data, note: value })}
					/>
				</div>
				<div className="w-50">
					<div className="flex space-x-1 mb-2">
						<div className="w-25">Tên sản phẩm</div>
						<div className="w-25 ps-1">Giá</div>
						<div className="w-25 ps-1">Số lượng</div>
						<div className="w-25 ps-1">Thành tiền</div>
						<div className="" style={{ width: '24.11px' }}></div>
					</div>
					{products?.length > 0 &&
						products?.map((item) => (
							<div className="flex space-x-1 w-full" key={item.id}>
								<SelectBox
									name='product'
									data={props?.constant?.products ?? []}
									value={item.productId}
									callback={(value) => { setAttributesProducts(item.id, value) }}
									search={true}
									containerClass='w-100'
									validate={errors}
								/>
								<Input
									id='price'
									name='price'
									type='text'
									value={VND.format(item.price)}
									placeholder="Nhập giá"
									disabled={true}
									validate={errors}
									containerClass='w-25 mb-2 mt-0'
								/>
								<Input
									id='quantity'
									name='quantity'
									type='number'
									min='0'
									value={item?.quantity}
									validate={errors}
									containerClass='w-25 mb-2 mt-0'
									onChange={(value) => {
										setQuantityProduct(item.id, item.productId, item.price, value)
									}}
								/>
								<Input
									id='total'
									name='total'
									type='text'
									value={VND.format(item.total)}
									placeholder="Nhập tổng tiền"
									disabled={true}
									validate={errors}
									containerClass='w-25 mb-2 mt-0'
								/>
								<div className="flex items-center justify-center mb-2 h4">
									<i
										className='bx bx-x-circle text-red'
										onClick={() => removeProduct(item.id)}
									>
									</i>
								</div>
							</div>
						))
					}
					<div className="flex items-center justify-content-start mb-4 mt-1 h4">
						<i
							className='bx bx-plus-circle text-green'
							onClick={() => addProduct()}
						>
						</i>
					</div>
				</div>
			</div>
			<div className="flex w-full justify-content-end space-x-6 mb-4 border-top border-dark">
				<div className="w-50"></div>
				<div className="w-50">
					<div className="flex space-x-1 pt-3">
						<div className="w-50 h5 text-end">Tổng tiền hàng:</div>
						<div className="w-50 h5 text-end">{VND.format(totalReceipt)}</div>
					</div>
					<div className="flex space-x-1">
						<div className="w-50 h5 text-end">Giảm giá:</div>
						<div className="w-50 h5 text-end">{VND.format(couponReceipt)}</div>
					</div>
					<div className="flex space-x-1">
						<div className="w-50 h5 text-end">Thành tiền:</div>
						<div className="w-50 h5 text-end">{VND.format(totalReceipt - couponReceipt)}</div>
					</div>
					<div className="flex space-x-1">
						<div className="w-50 h5 text-end">Trạng thái:</div>
						<div className="w-50 h5 text-end">{data?.status == 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</div>
					</div>
				</div>
			</div>
			<form onSubmit={handler} className="space-y-6">
				<div className="flex justify-content-around mt-6 w-50 m-auto">
					<button
						type="button"
						onClick={() => close()}
						style={{ width: '100px' }}
						className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
					>
						Thoát
					</button>
					{loading == true ? (
						<div className="flex items-center justify-content-around" style={{ width: '100px' }}>
							<div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
								<span className="sr-only">Loading...</span>
							</div>
							<div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
								<span className="sr-only">Loading...</span>
							</div>
							<div className="spinner-grow text-success" style={{ height: '10px', width: '10px' }}>
								<span className="sr-only">Loading...</span>
							</div>
						</div>
					) : (
						<button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Tạo mới </button>
					)}
				</div>
			</form>
		</Modal>
	)
}