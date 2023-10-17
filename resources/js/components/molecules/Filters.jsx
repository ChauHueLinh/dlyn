import React from 'react'
import { useDispatch } from 'react-redux'
import { filtersActions } from '~/components/store/filters-slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function Filters(props) {
    const dispatch = useDispatch()

    const submitSearch = (event) => {
        dispatch(filtersActions.handle({ keywords: event.target.value }))
    }

    const onKeyUp = (event) => {
        if (event.keyCode === 13) {
            submitSearch(event)
        }
    }

    return (
        <div className="flex items-center space-x-4 mb-3">
            { props.isSearch &&
                <div>
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#6b7280"}} />
                        </div>
                        <input
                            onBlur={(event) => submitSearch(event)}
                            onKeyUp={(event) => onKeyUp(event)}
                            type="text"
                            id="search"
                            className="block pr-2 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 pe-5" 
                            style={{height: '42px'}}
                            placeholder="Tìm kiếm"
                        />
                    </div>
                </div>
            }
            <div className="flex items-center space-x-4">
                { props.children }
            </div>
        </div>
    )
}