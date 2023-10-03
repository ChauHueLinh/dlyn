import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filtersActions } from '~/components/store/filters-slice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

export default function Table(props) {
    const dispatch  = useDispatch()
    const param     = useSelector((state) => state.filters.param)
    const status    = useSelector((state) => state.filters.status)
    const reload    = useSelector((state) => state.modal.isLoadingTable)

    const sortHead  = (item) => {
        dispatch(filtersActions.handle({
            sort_key: item.key
        }))
    }

    const sortIcon = (item) => {
        if (param.sort_key == item) {
            switch (status) {
                case 0:
                    return <FontAwesomeIcon icon={faSort} />
                case 1:
                    return <FontAwesomeIcon icon={faSortUp} />
                case 2:
                    return <FontAwesomeIcon icon={faSortDown} />
            }
        } else {
            return <FontAwesomeIcon icon={faSort} />
        }
    }

    return (
        <div className="relative border border-solid border-gray-200 rounded-md overflow-x-inherit">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-b-100">
                    <tr>
                        {
                            props.thead && props.thead.map((item, index) => (
                                <th scope="col" className={ item.classCol ? item.classCol : 'p-3 min-w-max' } key={index}>
                                    <div className={ item.className ? item.className : 'flex items-center space-x-1' }>
                                        <div className='min-w-max'> { item.name } </div>
                                        { item.key &&
                                            <button
                                                type="button"
                                                onClick={() => sortHead(item)}
                                            >
                                            { sortIcon(item.key) }

                                            </button>
                                        }
                                    </div>
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    { reload
                        ?
                            props?.length?.map((item) => (
                                <Loading key={item.id} thead={props.thead} />
                            ))
                        :
                            props.children
                    }
                </tbody>
            </table>
        </div>
    )
}

function Loading(props) {
    return (
        <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
            { props.thead.map((item, index) => (
              <>
                {
                  index == 0
                  ?
                    <td className="p-3 colum-id" key={index}>
                        <div className="placeholder" style={{width: '34px', height: '16px'}}>
                            <div className="animated-background"></div>
                        </div>
                    </td>
                  :
                    index + 1 == props.thead.length
                    ?
                      <td className="p-3 text-break" key={index}>
                          <div className='flex items-center space-x-2'>
                              <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                  <div className="animated-background"></div>
                              </div>
                              <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                  <div className="animated-background"></div>
                              </div>
                          </div>
                      </td>
                    :
                      <td className="p-3" key={index}>
                          <div className="placeholder" style={{width: '110px', height: '16px'}}>
                              <div className="animated-background"></div>
                          </div>
                      </td>
                  }
              </>
            )) }
        </tr>
    )
}