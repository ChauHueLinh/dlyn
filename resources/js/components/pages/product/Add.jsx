import React, { use, useEffect } from 'react'
import toast from 'react-hot-toast'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'
import MultiSelectBox from '~/components/molecules/MultiSelectBox'
import UploadFile from '~/components/molecules/UploadFile'
import UploadFiles from '~/components/molecules/UploadFiles'

import { url } from '~/components/pages/product/Url'
import { modalActions } from '~/components/store/modal-slice'

export default function Add(props) {
	const dispatch = useDispatch()
	const status = useSelector((state) => state.modal.isOpen)
	const collection = useSelector((state) => state.modal.collection)

	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({
		status: 0
	})
	const [groupAttributes, setGroupAttributes] = useState([])
	const [errorAttributes, setErrorAttributes] = useState([])
	const [errorGroupAttributes, setErrorGroupAttributes] = useState([])
	const [previewMainImage, setPreviewMainImage] = useState()
	const [previewDescriptionImage, setPreviewDescriptionImage] = useState([])
	const [errorsDescriptionImage, setErrorsDescriptionImage] = useState([])
	const [errorsMainImage, setErrorsMainImage] = useState([])

	const maxString = 255

	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		var quantity = 0
		groupAttributes?.map((item) => {
			let attributes = item?.attributes?.filter((item) => item.name != '')
			if (attributes?.length > 0) {
				quantity = quantity + Number(item.quantity)
			}
		})

		setData({ ...data, quantity: quantity })
	}, [groupAttributes])

	const handler = (e) => {
		e.preventDefault()

		if (errorAttributes?.length > 0 || errorsMainImage?.length > 0 || errorsDescriptionImage?.length > 0 || errorGroupAttributes?.length > 0) {
			return false
		}

		if (!data.mainImage) {
			setErrorsMainImage(['Ảnh đại diện là bắt buộc.'])
			return false
		}

		setLoading(true)

		let form = new FormData()
		form.append('name', data.name ?? '')
		form.append('price', data.price ?? '')
		form.append('quantity', data.quantity ?? '')
		form.append('status', data.status ?? '')
		form.append('productTypeId', data.productTypeId ?? '')
		form.append('branchId', data.branchId ?? '')
		groupAttributes?.length > 0 && groupAttributes.map((item) => {
			item?.attributes?.length > 0 && item?.attributes.map((i) => {
				if(i.name != '') {
					form.append('attr[]', JSON.stringify({
						groupName: item.name,
						quantity: item.quantity,
						name: i.name,
						value: i.value,
					}))
				}
			})
		})
		form.append('mainImage', data.mainImage ?? '')
		data?.descriptionImages?.length > 0 && data?.descriptionImages?.map((item) => {
			form.append('descriptionImages[]', item.value)
		})
		data?.suppliers?.length > 0 && data.suppliers.map((item) => {
			form.append('supplierId[]', item.id)
		})

		axiosAPI.post(url.store, form)
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

	const addGroupAttribute = () => {
		let attributes = [{ id: 1, name: '', value: '' }]
		setGroupAttributes([...groupAttributes, {id: groupAttributes?.length > 0 ? (attributes.at(-1).id + 1) : 1, name: '', quantity: 0, attributes: attributes }])
	}

	const removeGroupAttribute = (id) => {
		var new_array_group_attributes = groupAttributes.filter((item) => item.id != id)
		setGroupAttributes(new_array_group_attributes)
	}

	const setNameGroupAttribute = (id, name) => {
		const valueLength = 'Tên nhóm chưa tối đa ' + maxString + ' ký tự.'
		const new_error_group_atrributes = errorGroupAttributes.filter((item) => item.id != id)
		const new_group_attributes = groupAttributes?.filter((item) => item.id != id)
		const groupAttribute = groupAttributes?.filter((item) => item.id == id)
		const check = groupAttributes?.filter((item) => item.name == name)

		if(name?.length > maxString) {
			new_error_group_atrributes.push({id: id, value: valueLength})
		} else {
			new_error_group_atrributes.filter((item) => item.id != id)
		}
		if(check?.length > 1) {
			new_error_group_atrributes.push({id: id, value: 'Tên nhóm đã tồn tại.'})
		}
		setErrorGroupAttributes([...errorGroupAttributes])

		new_group_attributes?.push({
			id: id,
			name: name,
			quantity: groupAttribute[0].quantity,
			attributes: groupAttribute[0].attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const setQuantityGroupAttribute = (id, quantity) => {
		const new_error_group_atrributes = errorGroupAttributes.filter((item) => item.id != id)
		const new_group_attributes = groupAttributes?.filter((item) => item.id != id)
		const groupAttribute = groupAttributes?.filter((item) => item.id == id)
		const e = [];

		setErrorGroupAttributes([...errorGroupAttributes, new_error_group_atrributes])

		new_group_attributes?.push({
			id: id,
			name: groupAttribute[0].name,
			quantity: quantity,
			attributes: groupAttribute[0].attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const addAttribute = (groupId) => {
		const new_group_attributes = groupAttributes.filter((item) => item.id != groupId)
		const groupAttribute = groupAttributes.filter((item) => item.id == groupId)
		let attributes = groupAttribute[0].attributes
		
		attributes.push({
			id: attributes?.length > 0 ? (attributes.at(-1).id + 1) : 1,
			name: '',
			value: '',
		})
		attributes.sort((a, b) => a.id - b.id)
		new_group_attributes.push({
			id: groupId,
			name: groupAttribute[0].name,
			quantity: groupAttribute[0].quantity,
			quantity: groupAttribute[0].quantity,
			attributes: attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const removeAttribute = (groupId, id) => {
		const new_group_attributes = groupAttributes.filter((item) => item.id != groupId)
		const groupAttribute = groupAttributes.filter((item) => item.id == groupId)
		const attributes = groupAttribute[0].attributes.filter((i) => i.id != id)

		if(attributes?.length == 0) {
			attributes.push([{
				id: 1,
				name: '',
				value: '',
			}])
		}

		new_group_attributes.push({
			id: groupId,
			name: groupAttribute[0].name,
			quantity: groupAttribute[0].quantity,
			quantity: groupAttribute[0].quantity,
			attributes: attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const setNameAttribute = (groupId, id, name) => {
		const valueLength = 'Giá trị chứa tối đa ' + maxString + ' ký tự.'
		const new_group_attributes = groupAttributes.filter((item) => item.id != groupId)
		const groupAttribute = groupAttributes.filter((item) => item.id == groupId)
		let attributes = groupAttribute[0].attributes.filter((i) => i.id != id)
		const attribute = groupAttribute[0].attributes?.filter((i) => i.id == id)
		const check = groupAttribute[0].attributes?.filter((i) => i.name == name)
		let new_error_atrributes = errorAttributes?.filter((item) => item.id != String(groupId + '_' + id))

		if(check?.length > 0) {
			new_error_atrributes?.push({id: String(groupId + '_' + id), value: 'Tên thuộc tính đã tồn tại'})
		} else {
			if(name?.length > maxString) {
				new_error_atrributes?.push({id: String(groupId + '_' + id), value: valueLength})
			} else {
				new_error_atrributes = new_error_atrributes?.filter((item) => item.id != String(groupId + '_' + id))
			}
		}
		setErrorAttributes([...new_error_atrributes])

		attributes.push({
			id: id,
			name: name,
			value: attribute[0]?.value,
		})
		attributes.sort((a, b) => a.id - b.id)
		new_group_attributes.push({
			id: groupId,
			name: groupAttribute[0].name,
			quantity: groupAttribute[0].quantity,
			quantity: groupAttribute[0].quantity,
			attributes: attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const setValueAttribute = (groupId, id, value) => {
		const valueLength = 'Giá trị chứa tối đa ' + maxString + ' ký tự.'
		let new_group_attributes = groupAttributes.filter((item) => item.id != groupId)
		const groupAttribute = groupAttributes.filter((item) => item.id == groupId)
		const attributes = groupAttribute[0].attributes.filter((i) => i.id != id)
		const attribute = groupAttribute[0].attributes.filter((i) => i.id == id)
		let new_error_atrributes = errorAttributes?.filter((item) => item.id != groupId + '_' + id)

		if(attribute[0]?.name?.length > maxString) {
			new_error_atrributes?.push({id: groupId + '_' + id, value: valueLength})
		} else {
			new_error_atrributes = new_error_atrributes.filter((item) => item.id != groupId + '_' + id)
		}
		setErrorAttributes([...new_error_atrributes])

		attributes.push({
			id: id,
			name: attribute[0]?.name,
			value: value,
		})
		attributes.sort((a, b) => a.id - b.id)
		new_group_attributes.push({
			id: groupId,
			name: groupAttribute[0].name,
			quantity: groupAttribute[0].quantity,
			quantity: groupAttribute[0].quantity,
			attributes: attributes,
		})
		new_group_attributes.sort((a, b) => a.id - b.id)
		setGroupAttributes(new_group_attributes)
	}

	const callbackUploadFile = (file) => {
		const objectUrl = URL.createObjectURL(file)
		setPreviewMainImage(objectUrl)
		var arr_error = []
		var ruleType = ['jpg', 'jpeg', 'png']
		var type = file.type.split('/')
		if (ruleType.includes(type[1]) == false) {
			arr_error.push('Ảnh không đúng định dạng.')
		}
		if (file.size > 2000000) {
			arr_error.push('Dung lượng ảnh không vượt quá 2 MB.')
		}
		setErrorsMainImage([...arr_error])
		setData({ ...data, mainImage: file })
	}

	const callbackUploadFiles = (files) => {
		let newPreviewDescriptionImage = previewDescriptionImage ?? []
		let errors = errorsDescriptionImage ?? []
		let desImgs = data.descriptionImages ?? []

		Object?.entries(files)?.map((item) => {
			const objectUrl = URL.createObjectURL(item[1])
			const id = newPreviewDescriptionImage.length > 0 ? newPreviewDescriptionImage.at(-1)?.id + 1 : 0
			var ruleType = ['jpg', 'jpeg', 'png']
			var type = item[1].type.split('/')

			errors['desImg-' + id] = []
			if (ruleType.includes(type[1]) == false) {
				errors['desImg-' + id].push('Ảnh không đúng định dạng.')
			}
			if (item[1].size > 2000000) {
				errors['desImg-' + id].push('Dung lượng ảnh không vượt quá 2 MB.')
			}
			if (errors['desImg-' + id]?.length == 0) {
				delete errors['desImg-' + id]
			}
			desImgs.push({ id: id, value: item[1] })
			newPreviewDescriptionImage.push({ id: id, value: objectUrl })
		})

		setErrorsDescriptionImage(errors)
		setPreviewDescriptionImage([...newPreviewDescriptionImage])
		setData({ ...data, descriptionImages: desImgs })
	}

	const removeDescriptionImage = (id) => {
		const newPreviewDescriptionImage = previewDescriptionImage?.filter((item) => item.id != id)
		const newDescriptionImages = data?.descriptionImages?.filter((item) => item.id != id)

		delete errorsDescriptionImage['desImg-' + id]

		setPreviewDescriptionImage([...newPreviewDescriptionImage])
		setData({ ...data, descriptionImages: newDescriptionImages })
	}

	const close = () => {
		setData({ status: 0 })
		setErrors({})
		setLoading(false)
		setGroupAttributes([])
		setPreviewMainImage()
		setPreviewDescriptionImage([])
		dispatch(modalActions.close())
	}

	return (
		<Modal
			display={openDialog}
			callbackClose={() => close()}
			wrapperClass='w-75'
			btnClose={true}
		>
			<h2 className="text-lg font-medium leading-6 text-gray-900 mb-4"> Tạo mới sản phẩm</h2>
			<div className="flex space-x-6">
				<div className="w-50">
					<Input
						id='name'
						name='name'
						type='text'
						labelName='Tên'
						placeholder="Nhập tên"
						isRequired={true}
						validate={errors}
						containerClass='w-full mb-4'
						onChange={(value) => {
							setData({ ...data, name: value })
						}}
					/>
					<Input
						id='price'
						name='price'
						type='number'
						labelName='Giá'
						placeholder="Nhập giá"
						isRequired={true}
						validate={errors}
						containerClass='w-full mb-4'
						onChange={(value) => {
							setData({ ...data, price: value })
						}}
					/>
					<Input
						id='quantity'
						name='quantity'
						type='number'
						labelName='Số lượng'
						placeholder="Nhập số lượng"
						value={data?.quantity}
						isRequired={true}
						validate={errors}
						containerClass='w-full mb-4'
						onChange={(value) => {
							setData({ ...data, quantity: value })
						}}
					/>
					<div className="">Thuộc tính</div>
					{groupAttributes?.map((item) => (
						<div className="mt-0 mb-2" key={item.id}>
							<label htmlFor="" className='mt-2 ms-4 ps-2'>Nhóm</label>
							<div className="flex mt-0 w-full space-x-2">
								<div className="flex items-center justify-center mb-0 mt-2 h4">
									<i
										className='bx bx-x-circle text-red'
										onClick={() => removeGroupAttribute(item.id)}
									>
									</i>
								</div>
								<Input
									id={item.id}
									type='text'
									value={item.name}
									placeholder="Nhập tên nhóm"
									containerClass='w-75 mb-0'
									validate={errors}
									onChange={(value) => {
										setNameGroupAttribute(item.id, value)
									}}
								/>
								<Input
									id={item.id}
									type='number'
									value={item.quantity}
									placeholder="Nhập số lượng"
									containerClass='w-25 mb-0'
									validate={errors}
									min={0}
									onChange={(value) => {
										setQuantityGroupAttribute(item.id, value)
									}}
								/>
							</div>
							{item?.attributes?.map((i, index) => (
								<div className="ms-4 mt-1" key={index}>
									<div className="flex space-x-2">
										<div className="flex items-center justify-center mb-0 mt-2 h4 ms-3">
											<i
												className='bx bx-x-circle text-red'
												onClick={() => removeAttribute(item.id, i.id)}
											>
											</i>
										</div>
										<Input
											id={i.id}
											type='text'
											value={i.name}
											placeholder="Nhập tên thuộc tính"
											containerClass='w-50 mb-0'
											validate={errors}
											onChange={(value) => {
												setNameAttribute(item.id, i.id, value)
											}}
										/>
										<Input
											id={i.id}
											type='text'
											value={i.value}
											placeholder="Nhập giá trị"
											containerClass='w-100 mb-0'
											validate={errors}
											onChange={(value) => {
												setValueAttribute(item.id, i.id, value)
											}}
										/>
									</div>
								</div>
							))}
							<div className="flex items-center justify-content-start mb-4 mt-1 h4 ms-4 ps-3">
								<i
									className='bx bx-plus-circle text-green'
									onClick={() => addAttribute(item.id)}
								>
								</i>
							</div>
						</div>
					))}
					<div className="flex items-center justify-content-start mb-4 mt-1 h4">
						<i
							className='bx bx-plus-circle text-green'
							onClick={() => addGroupAttribute()}
						>
						</i>
					</div>
				</div>
				<div className="w-50">
					<div className="text-center">
						<label htmlFor="" className='h3'>Ảnh đại diện</label>
					</div>
					<div className="">
						{previewMainImage &&
							<div
								className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsMainImage?.length > 0 ? 'border-danger' : 'border-dark'}`}
								style={{ height: '100px', width: '100px' }}
							>
								<img src={previewMainImage} alt="" />
							</div>
						}

						<div className="text-red">{errorsMainImage[0] ?? ''}</div>
					</div>
					<UploadFile
						name='main'
						containerClass='mt-0 '
						validate={errors}
						callback={(file) => callbackUploadFile(file)}
						errors={errors}
						btnValue={<i className='bx bx-image-add'></i>}
						btnClass='w-full inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium text-black border border-1 border-dark bg-gray-100'
					/>
					<div className="text-center">
						<label htmlFor="" className='mt-6 h3'>Ảnh mô tả</label>
					</div>
					<div className="relative  flex space-x-1 flex-wrap">
						{previewDescriptionImage?.map((item) => (
							<div className="relative mt-2" key={item.id}>
								<div className="w-full absolute flex justify-content-end">
									<div
										className="bg-red flex items-center justify-center overflow-hidden rounded-circle"
										style={{ width: '19px', height: '19px', fontSize: '19px' }}
										onClick={(event) => removeDescriptionImage(item.id)}
									>
										<i className='bx bx-x-circle text-black bg-white' style={{ width: '19px' }}></i>
									</div>
								</div>
								<div
									className={`flex items-center justify-center rounded-4 overflow-hidden border-2 mt-1 me-1 ${errorsDescriptionImage['desImg-' + item.id]?.length > 0 ? 'border-danger' : 'border-dark'}`}
									style={{ height: '100px', width: '100px' }}
								>
									<img src={item.value} alt="" title={errorsDescriptionImage['desImg-' + item.id] ?? ''} />
								</div>
							</div>
						))}
					</div>
					<UploadFiles
						name='sub'
						preview={[]}
						containerClass=''
						validate={errors}
						callback={(files) => {
							callbackUploadFiles(files)
						}}
						errors={errors}
						btnClass='w-full inline-flex justify-center rounded-md border border-transparent px-2 py-2 text-sm font-medium text-black border border-1 border-dark bg-gray-100'
						btnValue={<i className='bx bx-image-add'></i>}
					/>
					<MultiSelectBox
						data={props.constant.suppliers ?? []}
						callback={(value) => setData({ ...data, suppliers: value })}
						label="Nhà cung cấp"
						containerClass=''
						placeholder="Chọn nhà cung cấp"
						showLabel='name'
						isRequired={false}
						search={true}
						classLabel='mt-4 mb-2'
					/>
					<SelectBox
						label='Trạng thái'
						data={props.constant ? props.constant.status : []}
						value={data.status ?? 0}
						callback={(value) => setData({ ...data, status: value.id })}
						search={false}
						containerClass='mt-4'
					/>
					<SelectBox
						label='Loại sản phẩm'
						data={props.constant ? props.constant.productTypes : []}
						value={data.productTypeId ?? 0}
						callback={(value) => setData({ ...data, productTypeId: value.id })}
						search={true}
						containerClass='mt-4'
					/>
					<SelectBox
						label='Thương hiệu'
						data={props.constant ? props.constant.branchs : []}
						value={data.branchId ?? 0}
						callback={(value) => setData({ ...data, branchId: value.id })}
						search={true}
						containerClass='mt-4'
					/>
				</div>
			</div>
			<div className="w-50 m-auto">
				<form onSubmit={handler} className="space-y-6">
					<div className="flex justify-content-start w-full">
						<div className="flex justify-content-around mt-6 w-100">
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
					</div>
				</form>
			</div>
		</Modal>
	)
}