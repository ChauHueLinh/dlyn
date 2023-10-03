import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { modalActions } from '~/components/store/modal-slice'

export default function PageFrame(props) {
    const dispatch          = useDispatch()
    let errorPage
    let notFound
    
    var loading = true
    
    if (props.data && !props.data.message) {
        if(props?.data?.data.length < 1) {
            notFound = <h2 className='py-5 text-center'>Không có dữ liệu</h2>
            loading = false
        } else {
            loading = false
        }
    } else if (props?.data?.message) {
        errorPage = true
        loading = false
    }
    
    const openModal = () => {
        dispatch(modalActions.open({
            id: 0,
            name: "create"
        }))
        dispatch(modalActions.loading(false))
    }
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className='bg-white rounded-md p-4'>
                
                { !loading && errorPage && <Error403/> }
                { !errorPage &&
                    <>
                        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3 h-9">
                            <h1 className="text-xl font-medium"> { props.name } </h1>
                            <div className="ms-auto">
                                { loading
                                    ?
                                        <div className="placeholder h-9" style={{width: '100px', height: '36px'}}>
                                            <div className="animated-background"></div>
                                        </div>
                                    :
                                        props.isCreate &&
                                        <button onClick={() => openModal()} className="rounded-md bg-sky-800 hover:bg-sky-700 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                            Tạo mới
                                        </button>
                                }  
                            </div>
                        </div>

                        { loading && <Loading/> }
                        
                        { !loading && props.children }

                        { notFound && notFound}
                    </>
                }
            </div>
        </>
    )
}

function Loading() {
    return (
        <div>
            <div className='flex justify-content-between'>
                <div className='flex items-center space-x-4 pb-4'>
                    <div className="placeholder" style={{width: '320px', height: '40px'}}>
                        <div className="animated-background"></div>
                    </div>
                    <div className="placeholder" style={{width: '110px', height: '40px'}}>
                        <div className="animated-background"></div>
                    </div>
                    <div className="placeholder" style={{width: '180px', height: '40px'}}>
                        <div className="animated-background"></div>
                    </div>
                </div>
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 table-fixed">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b border-b-100">
                    <tr>
                        <th scope="col" className="p-3 id-default-thead">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="w-full text-center">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                        <th scope="col" className="p-3">
                            <div className="flex items-center space-x-1">
                                <div className="placeholder" style={{height: '16px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 colum-id">
                            <div className="placeholder" style={{width: '34px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '40px', height: '40px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '110px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '80px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="placeholder" style={{width: '150px', height: '16px'}}>
                                <div className="animated-background"></div>
                            </div>
                        </td>
                        <td className="p-3 text-break">
                            <div className='flex items-center space-x-2'>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                                <div className="placeholder" style={{width: '34px', height: '34px'}}>
                                    <div className="animated-background"></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav className="flex items-center justify-between pt-4">
                <div className="placeholder" style={{width: '192px', height: '22px', marginLeft: '0px'}}>
                    <div className="animated-background"></div>
                </div>
                <div className="placeholder h-9" style={{width: '340px', marginRight: '0px'}}>
                    <div className="animated-background"></div>
                </div>
            </nav>
        </div>
    )
}

function Error403() {
    return (
        <>
            <h2 style={{fontSize: '20px'}} className='text-center'>Bạn không có quyền truy cập vào chức năng này</h2>
        </>
    )
}