import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function MultiSelectBox(props) {
	const [query, setQuery] = useState('');
	const [data, setData] = useState(props.data);
	const [selected, setSelected] = useState([]);
	const [idSelected, setIdSelected] = useState([]);


	const filtered =
		query === ''
			? data
			: data.filter((item) =>
				item.name
					.toLowerCase()
					.replace(/\s+/g, '')
					.includes(query.toLowerCase().replace(/\s+/g, '')),
			);

	const callback = (e) => {
		var id = []
		var arr = []
		e.map(item => {
			if (item.id != null) {
				arr.push(item)
				if (id.includes(item.id) == true) {
					arr = arr.filter((i) => i.id != item.id)
					id = id.filter((i) => i != item.id)
				} else {
					id.push(item.id)
				}
			}
		})
		setSelected(arr)
		setIdSelected(id)

		props.callback(arr)
	}

	useEffect(() => {
		setSelected(props.value ? props.value : []);
		setData(props.data)
		var arr = []
		props?.value?.map((item) => {
			arr.push(item.id)
		})

		setIdSelected(arr)
	}, [props.data])

	const deleteItemSelected = (itemDelete) => {
		const select = selected.filter(item => item.id != itemDelete.id)
		const newIdSelected = idSelected.filter(item => item != itemDelete.id)
		setSelected(select);
		setIdSelected(newIdSelected);
		props.callback(select);
	}

	return (
		<Combobox value={selected} onChange={callback} multiple disabled={props.disabled ?? false} className={props.containerClass ?? props.containerClass}>
			<div className={`relative`}>
				<div className={`top-0 left-0 z-10 ${props?.classLabel}`}>
					{props?.label}
					{props?.isRequired && <span className="text-red-500">*</span>}
				</div>
				<div className={`border border-solid rounded-md ${props?.isError ? 'border-red-500' : 'border-gray-300'}`} id="multiple-combobox">
					<div className="relative w-full cursor-default overflow-hidden rounded-md bg-light text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-light focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
						{selected.length > 0 && (
							<ul className={`combobox-selected relative top-0 left-0 pe-4 z-15 ${props.disabled ? 'placeholder' : 'bg-light max-w-fit'} `}>
								{selected.map((item) => (

									<li key={item.id}>
										<XMarkIcon className="hover-icon-x"
											width={14}
											onClick={() => {
												if (props.disabled) return false
												deleteItemSelected(item)
											}}
										/>
										<div>{item[props.showLabel ? props.showLabel : 'id']}</div>
									</li>

								))}
							</ul>
						)}

						<Combobox.Button className={`combobox-button h-full ${selected.length > 0 && 'absolute'} top-0 left-0 z-10`}>
							<input
								className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 px-2 combobox-input-placeholder"
								style={{height: '38px'}}
								readOnly
							/>
							<div
								className={`${props.disabled ? 'bg-gray-300 disabled' : 'bg-light'} placeholder absolute top-0 left-0 flex items-center justify-content-start cursor-default ps-2 py-2`}
								id="placeholder"
								style={{
									cursor: 'default'
								}}
							>
								{selected.length > 0 ? '' : props?.placeholder}
							</div>
						</Combobox.Button>

						<Combobox.Button className={`absolute inset-y-0 right-0 flex items-center pr-2 z-15 ${props.disabled && 'disabled-btn'}`}>
							<ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</Combobox.Button>
					</div>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						afterLeave={() => setQuery('')}
					>
						<Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-light combobox-options py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{props.search && (
								<Combobox.Input
									className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 px-2 combobox-input"
									onChange={(e) => setQuery(e.target.value)}
								/>
							)}
							{filtered.length === 0 && query !== '' ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Không có dữ liệu
								</div>
							) : (
								filtered.map((item) => (
									<Combobox.Option
										key={item.id}
										className={({ active }) =>
											`relative cursor-pointer select-none flex items-center combobox-option ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
											}`
										}
										value={item}
									>
										{({ selected, active }) => (
											<>
												{(selected || idSelected.includes(item.id) == true) ? (
													<span
														className={`combobox-icon ${active ? 'text-white' : 'text-teal-600'
															}`}
													>
														<CheckIcon className="h-5 w-5" aria-hidden="true" />
													</span>
												) : null}
												<span
													className={`block truncate combobox-text ${selected ? 'font-medium' : 'font-normal'
														}`}
												>
													{
														props.typeStar == true ?
															(
																item?.id != '' ?
																	(
																		<div>
																			{Array.from(Array(item?.id ?? 0), (e, i) => {
																				return <i className='bx bxs-star' style={{ color: '#fee284', fontSize: '20px' }} key={i}></i>
																			})}
																			{Array.from(Array(item?.id ? (5 - item?.id) : 5), (e, i) => {
																				return <i className='bx bx-star' style={{ color: '#fee284', fontSize: '20px' }} key={i}></i>
																			})}
																		</div>
																	) : (
																		item?.name
																	)
															) : (
																item?.name
															)
													}
												</span>
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
				</div>
			</div>
		</Combobox>
	);
}
