import React, { use } from "react"
import { useState } from "react"
import ReactPaginate from 'react-paginate'
import SelectBox from '~/components/molecules/SelectBox'

export default function Paginate(props) {
	const [per_page, setPerPage] = useState()

	const arr_per_page = [
		{id: 1, name: 10},
		{id: 2, name: 20},
		{id: 3, name: 50},
		{id: 4, name: 100},
		{id: 5, name: 250},
		{id: 6, name: 500},
	]

	if(props?.data?.data?.length > 0) {
		return (
		<nav className={`flex items-center justify-content-end space-x-2 mb-3 ${props.className && props.className}`} aria-label="Table navigation">
			<div className="flex align-items-center">
				<div className="">Số hàng</div>
			</div>
			<SelectBox
				data={arr_per_page}
				value={per_page ?? 1}
				callback={(value) => {
					props.callbackPerPage(value.name)
					setPerPage(value.id)
				}}
				styleContainer={{width: '80px'}}
			>
			</SelectBox>
			<div className="text-sm font-normal text-gray-500 flex align-items-center space-x-1">
				<span>Đang hiển thị</span>
				<div className="font-semibold text-gray-900">{ props?.data && props?.data.meta?.from + " - " + props?.data.meta?.to}</div>
				<span>của</span>
				<div className="font-semibold text-gray-900">{ props?.data && props?.data.meta?.total }</div>
			</div>
			<ReactPaginate
				forcePage={props?.currentPage}
				breakLabel='...'
				nextLabel={<svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z' clipRule='evenodd'></path></svg>}
				onPageChange={(e) => props.callbackPaginate(e.selected + 1)}
				pageRangeDisplayed={3}
				marginPagesDisplayed={1}
				breakClassName='px-3 h-9 border border-gray-300 pt-1'
				pageCount={ props?.data && props?.data.meta?.last_page }
				previousLabel={<svg aria-hidden='true' className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z' clipRule='evenodd'></path></svg>}
				renderOnZeroPageCount={null}
				containerClassName='inline-flex items-center -space-x-px'
				pageClassName='pageClassName'
				activeClassName='activeClassName'
				activeLinkClassName='z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-sky-100 hover:bg-sky-200 hover:text-blue-700 h-9 block'
				pageLinkClassName='px-3 py-2 leading-tight text-gray-500 border border-gray-300 hover:bg-sky-200 hover:text-gray-700 h-9 block'
				previousClassName='block px-3 py-2 ml-0 leading-tight text-gray-500 border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 h-9'
				nextClassName='block px-3 py-2 leading-tight text-gray-500 border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 h-9'
			/>
		</nav>
		)
  	}
}