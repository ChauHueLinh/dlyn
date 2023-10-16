import {Fragment, useEffect, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

export default function SelectBox(props) {
	const [data, setData] 			= useState([])
	const [query, setQuery] 		= useState('')
	const [errors, setErrors] 		= useState({})
	const [selected, setSelected] 	= useState({
		id: null,
		name: '',
	})
  
	useEffect(() => {
		if (props.data?.length > 0) {
			const defaultValue = props.data.find(data => data.id == props.value) || props.data[0] || {}
	
			setSelected(defaultValue)
			setData(props.data)
		}
	}, [props.data])
  
	useEffect(() => {
		if (props.name && props.validate[props.name] != undefined) {
			Object.entries(props.validate).forEach(([key, value]) => {
				if (props.name == key) {
					setErrors({
					name: key,
					message: value
					})
				}
			})
		} else {
			setErrors({})
		}
	}, [props?.validate])
  
	const callback=(e) => {
		setSelected(e)
		props.callback(e)
	}

	const dataList = 
		query 
		=== ''
			? data
			: data.filter((item) =>
				item?.name
					.toLowerCase()
					.replace(/\s+/g, '')
					.includes(query.toLowerCase().replace(/\s+/g, ''))
			)
  
  
	return (
		<div style={props.styleContainer && props.styleContainer}>
			<Combobox 
				value={selected} 
				open={true} 
				disabled={props.disabled ?? false}
				onChange={(e) => callback(e)}
			>
				<div className={`relative ${props.containerClass && props.containerClass}`}>
					{props.label &&
						<div className={`mb-2 top-0 left-0 z-10`}>
							{props?.label} {props?.isRequired && <span className="text-red-500 ps-1">*</span>}
						</div>
					}
					<div
						className={`relative border border-solid rounded-md ${props?.isError ? 'border-red-500' : 'border-gray-300'} ${props?.selectBoxProduct ?? props?.selectBoxProduct}`}
						id="combobox"
					>
						<div className="relative w-full cursor-default overflow-hidden rounded-lg bg-light text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
							<Combobox.Button className="combobox-button w-full">
								<input
									className={`w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 px-2 bg-gray-50 combobox-input ${props.inputClass ?? ''} ${props.inputBgClass ?? 'bg-light'}`}
									style={{height: '38px'}}
									value={selected?.name}
									readOnly
								/>
							</Combobox.Button>
							<Combobox.Button className={`absolute inset-y-0 right-0 flex items-center pr-2 ${props.inputClass ?? ''} ${props.buttonClass ?? 'bg-light'}`} style={{minWidth: '30px'}}>
							<ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
							</Combobox.Button>
						</div>
					</div>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						afterLeave={() => setQuery('')}
					>
						<Combobox.Options style={{zIndex: 401, maxHeight: '200px'}} className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white combobox-options py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							{props.search && (
								<Combobox.Input
								className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 px-2 combobox-input"
								onChange={(e) => setQuery(e.target.value)}
								/>
							)}
							{dataList.length === 0 && query !== '' ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Không có dữ liệu
								</div>
							) : (
								dataList.map((item) => (
									<Combobox.Option
										key={item.id}
										className={({active}) => `relative w-full cursor-pointer select-none flex p-2 ${active ? 'bg-blue-100 text-gray-900' : 'text-gray-900'}`}
										value={item}
									>
										{({selected, active}) => (
											<>
												<span className={`flex block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
													<CheckIcon className={`h-5 w-5 ${active ? 'text-teal-600' : 'text-white'}`} aria-hidden="true" />{item?.name}
												</span>
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
					{ errors?.message?.map((item, index) => (
            <div key={index} className="text-red-500 mt-1">{ item }</div>
          )) }
				</div>
			</Combobox>
		</div>
	)
}