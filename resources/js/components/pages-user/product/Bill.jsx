import { useState } from 'react'
import * as turf from '@turf/turf'
import axiosAPI from '~/libs/axiosAPI'
import { useCookies } from 'react-cookie'
import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import Textarea from '~/components/molecules/Textarea'
import { useDispatch, useSelector } from 'react-redux'
import SelectBox from '~/components/molecules/SelectBox'
import { url } from '~/components/pages-user/product/Url'
import { modalActions } from '~/components/store/modal-slice'
import { Form } from 'antd'

export default function Bill(props) {
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	const sellerAddress = {
		provinceId: 201,
		districtId: 1710,
	}
	const shopId = 1054950
	const tokenSeller = '7bebf185-823d-11ee-af43-6ead57e9219a'

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
	const [transportService, setTransportService] = useState([])
	const [buyerAddress, setBuyerAddress] = useState({})


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
			payment: 'BANK',
		})
	}, [collection.data])

	useEffect(() => {
		if (data.address && data.address != '') {
			getTransportService()
		}
	}, [data.address])

	const getTransportService = async () => {
		const APIkey = 'AIzaSyDihznxqVhw1jVmiV5_gTcqiDzNFph6Jtk'
		const UrlApiGetLocation = 'https://maps.googleapis.com/maps/api/geocode/json'
		const UrlApiGetProvince = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/province'
		const UrlApiGetDistrict = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/district'
		const UrlApiGetWard = 'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward'
		const UrlApiGetService = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services'
		//Lấy thông tin địa chỉ khách hành
		var response = await (await fetch(`${UrlApiGetLocation}?key=AIzaSyDihznxqVhw1jVmiV5_gTcqiDzNFph6Jtk&address=${data.address}`)).json()
		var buyerAddress = {
			province: '',
			provinceId: '',
			district: '',
			districtId: '',
		}
		if (response.status == 'OK') {
			response.results[0].address_components.map(item => {
				switch (item.types[0]) {
					case 'administrative_area_level_1':
						buyerAddress.province = item.long_name
						break
					case 'administrative_area_level_2':
						buyerAddress.district = item.long_name
						break
					case 'locality':
						buyerAddress.district = item.long_name
						break
					case 'neighborhood':
						buyerAddress.ward = item.long_name
						break
					default:
				}
			})
			//Map id GHN
			var listProvince = await (await fetch(UrlApiGetProvince, { headers: { 'token': tokenSeller } })).json()
			buyerAddress.provinceId = listProvince.data.filter(item => item.NameExtension.includes(buyerAddress.province))[0].ProvinceID
			var listDistrict = await (await fetch(`${UrlApiGetDistrict}?province_id=${buyerAddress.provinceId}`, { headers: { 'token': tokenSeller } })).json()
			buyerAddress.districtId = listDistrict.data.filter(item => item.NameExtension.includes(buyerAddress.district))[0].DistrictID
			var listService = await (await fetch(`${UrlApiGetService}?shop_id=${shopId}&from_district=${sellerAddress.districtId}&to_district=${buyerAddress.districtId}`, { headers: { 'token': tokenSeller } })).json()

			setTransportService(listService.data)
			setBuyerAddress(buyerAddress)
		}
	}

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

	const handleChangeTransportService = async (id, name) => {
		const urlGetTransportFee = 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'
		var response = await (await fetch(`${urlGetTransportFee}?service_id=${id}&insurance_value=${totalBill}&coupon=&to_district_id=${buyerAddress.districtId}&from_district_id=${sellerAddress.districtId}&weight=1000&length=10&width=10&height=10`, { headers: { 'token': tokenSeller, 'shop_id': shopId } })).json()
		response.data.service_fee
		setData({
			...data,
			serviceId: id,
			serviceName: name,
			serviceFee: response.data.service_fee,
		})
	}

	const submitForm = async () => {

		if (!data.serviceId) {
			toast.dismiss()
			toast.error('Vui lòng chọn phương thức vận chuyển.')
			return false
		}

		var form = new FormData
			form.append('customerName', data.name)
			form.append('customerEmail', data.email)
			form.append('customerPhone', data.phone)
			form.append('customerAddress', data.address)
			form.append('serviceId', data.serviceId)
			form.append('serviceName', data.serviceName)
			form.append('serviceFee', data.serviceFee)
			form.append('toDistrictId', data.serviceFee)
			form.append('payment', buyerAddress.districtId)
			data.couponId && form.append('couponId', data.couponId)
			data.note && form.append('note', data.note)
			data.products.map(item => {
				form.append('products[]', JSON.stringify({
					id: item.productId,
					quantity: item.quantity,
					groupAttributeName: item.groupAttribute
				}))
			})
		axiosAPI.post(url.createReceipt, form, {
			headers: {
				'Authorization': props.user.accessToken,
				'Content-Type': 'multipart/form-data'
			}
		})
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
							<div className="w-50 py-2">Phí vận chuyển:</div>
							<div className="w-50 text-end py-2">{data.serviceFee ? VND.format(data.serviceFee ?? 0) : VND.format(0)}</div>
						</div>
						<div className="text-red flex">
							<div className="w-50 py-2">Tổng hóa đơn:</div>
							<div className="w-50 text-end py-2">{VND.format(totalBill - discount + (data.serviceFee ? data.serviceFee : 0))}</div>
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
						<div className="mt-4 text-black flex">
							<div className="me-2">Phương thức vận chuyển</div>
							<p className="text-red-500">*</p>
						</div>
						{transportService.length > 0 ?
							(
								<div className="text-black">
									{transportService.filter(item => item.service_type_id != 5).map(i => (
										<div className="flex text-black mt-2 ms-3" key={i.service_id}>
											<input style={{ height: '20px', width: '20px' }} type="checkbox" checked={data.serviceId == i.service_id ? 1 : 0} onChange={() => handleChangeTransportService(i.service_id, i.short_name)} />
											<div className="ms-2">{i.short_name}</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-black">Không có pưhương thức vận chuyển khả dụng</div>
							)
						}
						<div className="mt-4 text-black flex">
							<div className="me-2">Phương thức thanh toán</div>
							<p className="text-red-500">*</p>
						</div>
						<div className="flex text-black mt-2 ms-3">
							<input style={{ height: '20px', width: '20px' }} type="checkbox" checked={data.payment == 'CODE' ? 1 : 0} onChange={() => setData({ ...data, payment: 'CODE' })} />
							<div className="ms-2">Thanh toán khi nhận hàng</div>
						</div>
						<div className="flex text-black mt-2 ms-3">
							<input style={{ height: '20px', width: '20px' }} type="checkbox" checked={data.payment == 'BANK' ? 1 : 0} onChange={() => setData({ ...data, payment: 'BANK' })} />
							<div className="ms-2">Thanh toán bằng chuyển khoản</div>
						</div>
					</div>
				</div>
				<div className="w-100 flex justify-content-between border-top border-dark mt-4 pt-3">
					<div
						className="cursor-pointer w-fit p-2 text-black bg-gray rounded-lg"
						onClick={() => {
							close()
							props.callbackOpenCart()
						}}
					>
						Quay lại
					</div>
					<div
						className="cursor-pointer w-fit p-2 text-black bg-warning rounded-lg"
						onClick={() => submitForm()}
					>
						Đặt hàng
					</div>
				</div>
			</div>
		</Modal>
	)
}