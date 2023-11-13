import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'
import Textarea from '~/components/molecules/Textarea'
import { modalActions } from '~/components/store/modal-slice'
import axiosAPI from '~/libs/axiosAPI'
import { url } from '~/components/pages-user/product/Url'
import { useCookies } from 'react-cookie'
import axios from 'axios';

export default function Bill(props) {
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});

	const dispatch = useDispatch()

	const status = useSelector((state) => state.modal.isOpen)
	const collection = useSelector((state) => state.modal.collection)

	const [cookies, setCookie, removeCookie] = useCookies([])

	const [data, setData] = useState({})
	const [errors, setErrors] = useState([])
	const [coupon, setCoupon] = useState([])
	const [discount, setDiscount] = useState(0)
	const [loading, setLoading] = useState(true)
	const [totalBill, setTotalBill] = useState(0)
	const [totalProduct, setTotalProduct] = useState(0)
	const [customerLocation, setCustomerLocation] = useState({})


	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		var coupons = []

		axiosAPI.get(url.coupon, {
			headers: {
				'Authorization': cookies.accessToken,
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			response.data.result?.map((item) => {
				coupons.push({
					id: item.id,
					name: item.code,
					value: item.value,
					unit: item.unit
				})
			})
			coupons.unshift({ id: '', name: 'Chọn mã giảm giá' })
		})

		setCoupon(coupons)
	}, [])

	useEffect(() => {
		getDistance()
	}, [data.address])

	useEffect(() => {
		var total = totalBill

		collection.data?.map((item) => {
			total = total + item.quantity * item.price
		})

		axios
		setTotalProduct(collection.data?.length)
		setTotalBill(total)
		setData({
			...data,
			products: collection.data,
			name: props.user.name,
			phone: props.user.phone,
			email: props.user.email,
			address: props.user.address,
		})
	}, [collection.data, customerLocation])

	const handleChangeCoupon = (value) => {
		setData({ ...data, couponId: value.id })
		if (value.unit == 'VND') {
			setDiscount(value.value)
		} else if (value.unit == '%') {
			setDiscount(totalBill * value.value / 100)
		} else {
			setDiscount(0)
		}
	}

	const getDistance = async () => {
		const baseUrlDistance = "https://maps.googleapis.com/maps/api/directions/json"
		const APIkey = 'AIzaSyDihznxqVhw1jVmiV5_gTcqiDzNFph6Jtk'
		const origin = '286 Nguyễn Xiển, xã Tân Triều, huyện Thanh Trì, thành phố Hà Nội'
		const headers = {
				"Content-Type": "application/json",
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
				'Access-Control-Allow-Origin': '*',
				'Origin': '*',
		}
		if (data.address && data.address != '') {
			var url = `${baseUrlDistance}?key=${APIkey}&origin=${origin}&destination=${data.address}`;
			var res =  axios.get(baseUrlDistance, {params: {
				key: APIkey,
                origin: origin,
                destination: data.address,
			}}, {headers: {'Content-Type': 'application/json'}})
			console.log( res);
		}
	}

	const close = () => {
		dispatch(modalActions.close())
		setLoading(false)
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
				<div className="text-black text-center fw-bold h5">Đơn hàng</div>
				<div className="flex">
					<div className="w-50 pe-3 border-right border-dark">
						<div className="text-black text-center fw-bold">Thông tin sản phẩm</div>
						{data?.products?.map((i, index) => (
							<div className="text-black flex space-x-2 border-bottom border-dark" key={index}>
								<div className="w-fit py-2">
									<img src={i.image} alt="" style={{ width: '60px' }} />
								</div>
								<div className="text-black py-2 ps-2 w-100 flex flex-wrap align-items-between">
									<div className="h5 w-100">{i.name}</div>
									<div className="w-100">{`Phân loại: ${i.groupAttribute}`}</div>
									<div className="w-100">{`Số lượng: ${i.quantity}`}</div>
									<div className="text-black w-100">{VND.format(i.price)}</div>
								</div>
							</div>
						))}
						<div className="text-red flex">
							<div className="w-50 py-2">{`Tổng số tiền (${totalProduct} sản phẩm):`}</div>
							<div className="w-50 text-end py-2">{VND.format(totalBill)}</div>
						</div>
						<div className="text-red flex">
							<div className="w-50 py-2">Giảm giá:</div>
							<div className="w-50 text-end py-2">{VND.format(discount)}</div>
						</div>
						<div className="text-red flex">
							<div className="w-50 py-2">Tổng hóa đơn:</div>
							<div className="w-50 text-end py-2">{VND.format(totalBill - discount)}</div>
						</div>
					</div>
					<div className="w-50 ps-3 border-left border-dark">
						<div className="text-black text-center fw-bold">Thông tin khách hàng</div>
						<Input
							id='name'
							name='name'
							type='text'
							labelName='Tên'
							placeholder="Nhập tên"
							value={data?.name}
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({ ...data, name: value })
							}}
						/>
						<Input
							id='phone'
							name='phone'
							type='text'
							labelName='Số điện thoại'
							placeholder="Nhập số điện thoại"
							value={data?.phone}
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({ ...data, phone: value })
							}}
						/>
						<Input
							id='email'
							name='email'
							type='text'
							labelName='Email'
							placeholder="Nhập email"
							value={data?.email}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({ ...data, email: value })
							}}
						/>
						<Input
							id='address'
							name='address'
							type='text'
							labelName='Địa chỉ'
							placeholder="Nhập đại chỉ"
							value={data?.address}
							isRequired={true}
							validate={errors}
							containerClass='w-full mb-4'
							onChange={(value) => {
								setData({ ...data, address: value })
							}}
						/>
						<SelectBox
							name='roleId'
							label='Mã giảm giá'
							data={coupon}
							callback={(value) => handleChangeCoupon(value)}
							search={false}
							containerClass='mb-4 text-black'
							validate={errors}
						/>
						<Textarea
							name='note'
							labelName='Ghi chú'
							placeholder='Nhập ghi chú'
							validate={errors}
							containerClass='my-3'
							onChange={(value) => setData({ ...data, note: value })}
						/>
					</div>
				</div>
				<div className="w-100 flex justify-content-between mt-2">
					<div
						className="cursor-pointer w-fit p-2 text-black bg-gray rounded-lg"
						onClick={() => {
							close()
							props.callbackOpenCart()
						}}
					>
						Quay lại
					</div>
				</div>
			</div>
		</Modal>
	)
}