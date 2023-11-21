import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import axiosAPI from '~/libs/axiosAPI'
import store from '~/components/store'
import ReactDOM from 'react-dom/client'
import { useCookies } from "react-cookie";
import toast, { Toaster } from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';
import Login from '~/components/pages-user/user/Login'
import { url } from '~/components/pages-user/product/Url'
import React, { useState, useEffect, useRef } from 'react'
import Detail from '~/components/pages-user/product/Detail'
import Cart from '~/components/pages-user/product/Cart'
import Bill from '~/components/pages-user/product/Bill'
import Register from '~/components/pages-user/user/Register'
import { modalActions } from '~/components/store/modal-slice'
import { Provider, useDispatch, useSelector } from 'react-redux'
import axios from 'axios';

function ProductIndex() {
	const btnUserItems = useRef(null);
	const VND = new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	});
	const NUMBER = new Intl.NumberFormat();
	const PER_PAGE = 36

	const dispatch = useDispatch()

	const [lists, setLists] = useState([])
	const [cookies, setCookie, removeCookie] = useCookies([])
	const [constant, setConstant] = useState({})
	const [dataItem, setDataItem] = useState({})
	const [loading, setLoading] = useState(true)
	const [user, setUser] = useState({
		accessToken: cookies.accessToken
	})
	const [pagination, setPagination] = useState({
		count: 1,
		page: 1,
	})
	const [paramsConstant, setParamsConstant] = useState({
		productTypeId: '',
		per_page: PER_PAGE,
		page: 1,
	})

	useEffect(() => {
		function handleResize() {
			var widthImg = window.innerWidth / 16 * 3
			var heightImg = widthImg / 2 * 3
			// setSizeImg({
			//     width: widthImg + 'px',
			//     height: heightImg + 'px'
			// })
			// setBodyWidth(window.innerWidth)
		}
		window.addEventListener('resize', handleResize)
		setUser({
			accessToken: cookies.accessToken,
		})
		if (user?.accessToken != undefined && user?.accessToken != '') {
			getMe(cookies.accessToken)
		}
	}, [])

	useEffect(() => {
		getConstant()
		getList()
	}, [paramsConstant])

	const getConstant = async () => {
		let product_types = await fetch(url.productTypes + JSON.stringify(paramsConstant), {
			method: 'GET',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}).then((response) => response.json())

		product_types.data?.unshift({ id: '', name: 'TẤT CẢ' })

		setConstant({
			...constant,
			productTypes: product_types.data
		})
	}

	const getList = async () => {
		let params = {
			sort_key: 'id',
			order_by: 'DESC',
			per_page: PER_PAGE,
			page: pagination.page ?? 1,
			userId: paramsConstant.userId,
			productTypeId: paramsConstant.productTypeId,
		}
		axiosAPI.get(url.products, { params: params }, {
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((response) => {
			setPagination({
				count: response.data.result.lastPage,
				page: response.data.result.currentPage
			})
			setLists(response.data.result.products)
			setLoading(false)
		})
	}

	const setFavourite = async (productId) => {
		if (!user.accessToken) {
			openModalLogin()
		} else {
			let favourites = user.favourites ?? []
			if (loading == true) {
				return false
			} else {
				setLoading(true)
				let form = new FormData
				form.append('productId', productId)
				if (favourites?.includes(productId)) {
					form.append('status', 'delete')
					favourites = favourites?.filter((item) => item != productId)
				} else {
					form.append('status', 'create')
					favourites?.push(productId)
				}
				axiosAPI.post(url.favourite, form, {
					headers: {
						'Authorization': user.accessToken,
						'Content-Type': 'application/json'
					}
				}).then((response) => {
					setLoading(false)
					toast.dismiss()
					toast.success(response?.data?.message)
					setUser({
						...user,
						favourites: favourites
					})
				})
			}
		}
	}

	const handlePagination = (event, value) => {
		setPagination({
			...pagination,
			page: value
		})
	}

	const handleClickBtnUser = () => {
		if (btnUserItems.current.classList.contains('d-none') == false) {
			btnUserItems.current.classList.add('d-none')
		} else {
			btnUserItems.current.classList.remove('d-none')
		}
	}

	const getMe = (token) => {
		if (token != undefined) {
			let user = axiosAPI.get(url.me, {
				headers: {
					'Authorization': token,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				setUser({
					...user,
					id: response.data.result.id,
					name: response.data.result.name,
					phone: response.data.result.phone,
					email: response.data.result.email,
					address: response.data.result.address,
					favourites: response.data.result.favourites,
					accessToken: token,
				})
			})
		} else {
			return false
		}
	}

	const logout = () => {
		axiosAPI.delete(url.logout, {
			headers: {
				'Authorization': user.accessToken,
				'Content-Type': 'application/json'
			}
		})
			.then((response) => {
				toast.dismiss()
				if (response?.data?.status == true) {
					toast.success('Đăng xuất thành công.')
					removeCookie(['accessToken'])
					removeCookie(['cart'])
					setUser({})
				} else {
					toast.error('Đăng xuất thất bại.')
				}
			})
		btnUserItems.current.classList.add('d-none')
	}

	const openModalDetail = (item) => {
		setDataItem(item)
		dispatch(modalActions.open({
			name: 'detail'
		}))
	}

	const openModalLogin = () => {
		btnUserItems.current.classList.add('d-none')
		dispatch(modalActions.open({
			name: 'login'
		}))
	}

	const openModalRegister = () => {
		btnUserItems.current.classList.add('d-none')
		dispatch(modalActions.open({
			name: 'register'
		}))
	}

	return (
		<div className={`bg-body-dark-5 min-h-100`}>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<div className="w-full bg-body-dark flex flex-wrap top-0 fixed z-16">
				<div className="w-100 flex" style={{ height: '70px' }}>
					<div className="w-25 flex items-center h4 ps-4">

					</div>
					<div className="w-50">
						<img src={window.location.origin + '/assets/img/name.png'} alt="" className="mx-auto" style={{ height: '70px' }} />
					</div>
					<div className="w-25 relative">
						<div className="w-100 relative">
							<div className="w-100 flex items-center justify-content-end">
								<div className="w-50"></div>
								<div className="w-50 flex items-center justify-content-end">
									{user.id && (
										<div className="w-25 cursor-pointer flex items-center justify-center">
											<a href="abababa"><i className='m-0 py-2 bx bx-bell text-white h3'></i></a>
										</div>
									)}
									{user.id && (
										<div className="w-25 cursor-pointer flex items-center justify-center">
											<i className='m-0 py-2 bx bx-heart text-white h3' onClick={() => setParamsConstant({ ...paramsConstant, userId: user.id ?? '' })}></i>
										</div>
									)}
									{user.id && (
										<div className="w-25 cursor-pointer flex items-center justify-center" onClick={() => dispatch(modalActions.open({ name: 'cart' }))}>
											<i className='m-0 py-2 bx bx-shopping-bag text-white h3'></i>
										</div>
									)}
									<div className="w-25 cursor-pointer flex items-center justify-center" onClick={() => handleClickBtnUser()}>
										<i className='m-0 py-2 bx bx-user text-white h3'></i>
									</div>
								</div>
							</div>
							<div
								className="absolute w-fit rounded-lg d-none bg-light text-black shadow-lg py-2 overflow-hidden right-0"
								ref={btnUserItems}
								onBlur={() => btnUserItems?.current?.classList?.remove('d-none')}

							>
								{(user?.accessToken) ? (
									<div className="">
										<div className="py-2 px-3 cursor-pointer option text-break">Thông tin tài khoản</div>
										<div className="py-2 px-3 cursor-pointer option text-break">Đổi mật khẩu</div>
										<div className="py-2 px-3 cursor-pointer option text-break" onClick={() => logout()}>Đăng xuất</div>
									</div>
								) : (
									<div className="">
										<div className="py-2 px-3 cursor-pointer option text-break" onClick={() => openModalLogin()}>Đăng nhập</div>
										<div className="py-2 px-3 cursor-pointer option text-break" onClick={() => openModalRegister()}>Đăng ký</div>
									</div>
								)}
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
			<div className="w-100 flex mx-auto" style={{ marginTop: '107px' }}>
				{constant?.productTypes?.map((item) => (
					<div
						className={`w-full cursor-pointer p-3 text-black text-center bg-gray ${paramsConstant?.productTypeId != item.id && 'opacity-50'}`}
						key={item.id}
						onClick={() => {
							delete paramsConstant['userId']
							setParamsConstant({ ...paramsConstant, productTypeId: item.id ?? '' })
						}}
					>
						{item.name}
					</div>
				))}
			</div>
			{(loading == false && lists?.length < 1) ? (
				<div className="w-full mt-6 mx-auto p-6">
					<div className="w-fit mx-auto">
						Không có kết quả phù hợp
					</div>
				</div>
			) : (
				<div className={`vw-75 mx-auto py-3 grid-container`}>
					{lists?.map((item, index) => (
						<div className={`relative cursor-pointer overflow-hidden rounded-lg product-img-user ${'item-' + index}`} key={item.id}>
							<div className="w-100 absolute p-2 bottom-0">
								<div className="w-100 overflow-hidden des-img">
									<div className="py-2 w-fit px-3 rounded-lg mb-1 fw-bold bg-gray text-black" style={{ fontSize: '20px' }}>{item.name}</div>
									<div className="py-2 w-fit px-3 rounded-lg fw-bold bg-gray text-black" style={{ fontSize: '20px' }}>{VND.format(item.price)}</div>
								</div>
							</div>
							<div className="des-img absolute right-0 text-end pe-3">
								<i className={`bx bx-heart-circle ${user?.favourites?.includes(item?.id) && 'text-red'}`} style={{ fontSize: '50px' }} onClick={() => setFavourite(item.id)}></i>
							</div>
							<img src={item.mainImage} alt="" className={`h-100 rounded-lg min-width-100 mx-auto`} onClick={() => openModalDetail(item)} />
						</div>
					))}
				</div>
			)}
			{pagination?.count > 1 && (
				<div className="w-100 pb-4">
					<div className="w-fit mx-auto">
						<Pagination
							count={pagination?.count}
							page={pagination?.page}
							onChange={handlePagination}
							color="secondary"
							defaultPage={pagination?.page}
						/>
					</div>
				</div>
			)}
			<Detail
				modalKey='detail'
				data={dataItem}
				callbackOpenLogin={() => openModalLogin()}
				accessToken={user.accessToken}
			/>
			<Login
				modalKey='login'
				callbackLogin={(value) => {
					setUser(value)
					getMe(value.accessToken)
				}}
				callbackOpenRegister={() => openModalRegister()}
			/>
			<Register
				modalKey='register'
				callbackRegister={(value) => {
					setUser(value)
					getMe(value.accessToken)
				}}
				callbackOpenLogin={() => openModalLogin()}
			/>
			<Cart
				modalKey='cart'
				callbackOpenBill={(selected) => dispatch(modalActions.open({ name: 'bill', data: selected }))}
				accessToken={user.accessToken}
			/>
			<Bill
				modalKey='bill'
				callbackOpenCart={() => dispatch(modalActions.open({ name: 'cart', accessToken: user.accessToken }))}
				user={user}
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