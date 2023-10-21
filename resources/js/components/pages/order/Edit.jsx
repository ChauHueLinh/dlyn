import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import axiosAPI from '~/libs/axiosAPI'
import Modal from '~/components/molecules/Modal'
import Input from '~/components/molecules/Input'
import SelectBox from '~/components/molecules/SelectBox'

import { url } from '~/components/pages/order/Url'
import { modalActions } from '~/components/store/modal-slice'

export default function Add(props) {
	const dispatch = useDispatch()
	const status = useSelector((state) => state.modal.isOpen)
	const collection = useSelector((state) => state.modal.collection)

	const [errors, setErrors] = useState({})
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState({})

	const openDialog = collection.name == props.modalKey && status

	useEffect(() => {
		setData({
			...data,
			id: props.data.id,
			code: props.data.code,
			status: props.data.status,
			histories: props.data.histories,
		})
	}, [props.data, status])

	const handler = (e) => {
		e.preventDefault()

		setLoading(true)

		let form = new FormData()
		form.append('id', data.id ?? '')
		form.append('status', data.status ?? '')
		form.append('_method', 'PUT')

		axiosAPI.post(url.update, form)
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

	const close = () => {
		dispatch(modalActions.close())
		setLoading(false)
		setErrors({})
	}

	return (
		<Modal
			display={openDialog}
			callbackClose={() => close()}
			wrapperClass='w-50'
		>
			<h2 className="text-lg font-medium leading-6 text-gray-900 mb-4">Chỉnh sửa đơn hàng</h2>
			<div className="w-100">
				<form onSubmit={handler} className="space-y-6">
					<Input
						id='code'
						name='code'
						type='text'
						labelName='Mã'
						value={data.code ?? ''}
						isRequired={true}
						validate={errors}
						disabled={true}
						containerClass='w-full mb-4'
						onChange={(value) => {
							setData({ ...data, name: value })
						}}
					/>
					<SelectBox
						label='Trạng thái'
						data={props.constant ? props.constant.status : []}
						value={data.status ?? 0}
						callback={(value) => setData({ ...data, status: value.id })}
						search={false}
						isRequired={true}
						containerClass='mt-4'
					/>
					<div className="border-top border-dark mt-2 p-2">
						<label htmlFor="" className='mb-2'>Lịch sử</label>
						{data?.histories?.map((item, index) => (
							<div className={`row ${index % 2 == 0 && 'bg-gray-100'}`} key={item.id}>
								<div className="col py-2">{props?.constant?.status && props?.constant?.status[item.status]?.name}</div>
								<div className="col py-2 text-center">{item.date}</div>
								<div className="col py-2 text-end">{item.name + '(ID: ' + item.adminId +')'}</div>
							</div>
						))
						}
					</div>
					<div className="flex justify-content-around mt-6 w-full">
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
							<button type="submit" className="px-6 py-2 rounded-md bg-sky-800 hover:bg-sky-700 text-white"> Cập nhật </button>
						)}
					</div>
				</form>
			</div>
		</Modal>
	)
}