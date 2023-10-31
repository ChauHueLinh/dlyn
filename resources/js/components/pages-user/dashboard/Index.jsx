import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider, useDispatch, useSelector } from 'react-redux'
import axiosAPI from '~/libs/axiosAPI'
import store from '~/components/store'
import { url } from '~/components/pages-user/dashboard/Url'
import { useCookies } from 'react-cookie'
import toast, { Toaster } from 'react-hot-toast'
import { modalActions } from '~/components/store/modal-slice'
import Login from '~/components/pages-user/user/Login'
import Register from '~/components/pages-user/user/Register'

function DashboardIndex() {
    const dispatch = useDispatch()

    const btnUserItems = useRef(null);
    const [cookies, setCookie, removeCookie]    = useCookies([])
    const [user, setUser]                       = useState({
        accessToken: cookies.accessToken
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
        if(user?.accessToken != undefined && user?.accessToken != '') {
            getMe(cookies.accessToken)
        }
    }, [])

    const handleClickBtnUser = () => {
        if(btnUserItems.current.classList.contains('d-none') == false) {
            btnUserItems.current.classList.add('d-none')
        } else {
            btnUserItems.current.classList.remove('d-none')
        }
    }

    const logout = () => {
        axiosAPI.delete(url.logout, {headers: {
            'Authorization': user.accessToken,
            'Content-Type': 'application/json'
        }})
        .then((response) => {
            toast.dismiss()
            if(response?.data?.status == true) {
                toast.success('Đăng xuất thành công.')
                removeCookie(['accessToken'])
                setUser({})
            } else {
                toast.error('Đăng xuất thất bại.')
            }
        })
        btnUserItems.current.classList.add('d-none')
    }

    const getMe = (token) => {
        if(token != undefined) {
            let user = axiosAPI.get(url.me, {headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }}).then((response) => {
                setUser({...user,
                    id: response.data.result.id,
                    name: response.data.result.name,
                    favourites: response.data.result.favourites,
                    accessToken: token,
                })
            })
        } else {
            return false
        }
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
        <div className="bg-light">
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
                                <div className="w-50 flex items-center justify-content-center">
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-bell text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-heart text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center">
                                        <a href="abababa"><i className='m-0 py-2 bx bx-shopping-bag text-white h3'></i></a>
                                    </div>
                                    <div className="w-100 cursor-pointer flex items-center justify-center" onClick={() => handleClickBtnUser()}>
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
                    <div className="flex items-center justify-center cursor-pointer w-100 py-2 bg-light text-black rounded-top">
                        GIỚI THIỆU
                    </div>
                    <div className="flex items-center justify-center cursor-pointer w-100 py-2">
                        <a href={url.product} className="text-white">
                            SẢN PHẨM
                        </a>
                    </div>
                    <div className="flex items-center justify-center cursor-pointer py-2 w-100 text-white">BỘ SƯU TẬP</div>
                    <div className="flex items-center justify-center cursor-pointer py-2 w-100 text-white">SHOWROOM</div>
                </div>
            </div>
            <div className="w-full pt-1 relative" style={{ marginTop: '107px' }}>
                <div className="text-white p-6 card-center text-break opacity-75 w-75 bg-dark radius-15 container">
                    <div className="text-center h3">THELYN – Phong cách tạo nên sự khác biệt!</div>
                    <div className="h5 mt-4">
                        THELYN là thương hiệu womenswear, hướng đến những dòng sản phẩm thiết kế, may đo cao cấp, đi sâu vào khai thác các chất liệu và đường nét hiện đại.
                        Sản phẩm của THELYN được ví như thước đo chuẩn mực, đại diện cho phong thái thanh lịch và sang trọng, kết hợp với sự tinh tế từ chất liệu và nghệ thuật thêu đính thủ công, tôn vinh sắc vóc người phụ nữ.
                    </div>
                    <div className="h5 mt-4">
                        Triết lý thiết kế chủ đạo của THELYN bắt nguồn từ vẻ đẹp của phụ nữ, kết hợp cùng kỹ thuật Tailoring thượng hạng phác họa bóng dáng nữ tính, vừa thu hút gợi cảm, vừa kín đáo nhưng vẫn biểu bộ đường nét quyến rũ và quý phái.
                        Điều này không chỉ đánh thức sự tự tin bên trong mà còn giúp thiết kế thương hiệu trở thành biểu tượng đại diện cho phong cách sống vô cùng cuốn hút của phụ nữ đương đại.
                    </div>
                </div>
                <img src={window.location.href + 'assets/img/index-user-1.jpg'} alt="" className='w-full' />
            </div>
            <div className="flex space-x-6 mt-4">
                <div className="w-50">
                    <div className="bg-gray ms-4 mb-4 radius-15">
                        <div className="px-6 py-3 h3 text-break fw-bold text-black">
                            Hoài bão kiến tạo một đế chế thời trang xa xỉ bậc nhất từ chính những tinh hoa văn hóa dân tộc
                        </div>
                        <div className="px-6 h5 text-break text-black">
                            THELYN khát khao kiến tạo một đế chế thời trang xa xỉ với những giá trị nhân văn từ chính những tinh hoa văn hóa dân tộc.
                            Ngay từ ngày đầu ra mắt, THELYN đã cho thấy màu sắc đặc trưng của chính mình thông qua các bộ sưu tập.
                            Mỗi một thiết kế tại THELYN đều là sự kết hợp giao hòa của nghệ thuật thêu đính thủ công tinh xảo cùng với tình yêu và đam mê từ người nghệ nhân, tôn lên nét đẹp sang trọng và thần thái tao nhã của quý cô thượng lưu.
                        </div>
                        <div className="px-6 py-3 h5 text-break text-black">
                            Để hoàn thiện một bộ trang phục, những nghệ nhân của chúng tôi phải mất đến hàng trăm giờ lao động miệt mài và cần một lượng lớn nhân công.
                            Lấy giá trị thủ công làm nền tảng thiết kế nhưng phủ lên mình phong cách hiện đại, THELYN dùng “phép thuật” từ đôi bàn tay của người nghệ nhân tài ba, hiện thực hóa màu chì trên giấy, tạo ra những thiết kế độc đáo mang tính thời đại.
                            Chính sự cầu kỳ từ khâu thiết kế đến khâu sản xuất mà mỗi sản phẩm của THELYN đều trở thành những tuyệt tác nghệ thuật độc bản, tinh xảo từng đường kim mũi chỉ.
                        </div>
                    </div>
                    <div className="bg-gray ms-4 radius-15">
                        <div className="px-6 py-3 h3 text-break fw-bold text-black">
                            Sứ mệnh mang những giá trị tốt đẹp đến với đại chúng
                        </div>
                        <div className="px-6 h5 text-break text-black">
                            Một giá trị thiết thực song hành cùng sứ mệnh phát triển đã được THELYN xác định chính là đem những giá trị tốt đẹp đến với đông đảo đại chúng.
                            Không chỉ ở phía khách hàng mà còn là tạo ra cơ hội việc làm cho hàng trăm nghệ nhân, người lao động với một mức thu nhập ổn định, trong một môi trường làm việc văn minh.
                        </div>
                        <div className="px-6 py-3 h5 text-break text-black">
                            Cân bằng giữa thời trang và giá trị nghệ thuật truyền thống luôn là một thách thức nhưng THELYN vẫn luôn khát khao hiện thực hóa với hoài bão kiến tạo một đế chế thời trang xa xỉ.
                            Và hành trình phát triển, mở rộng thương hiệu tại các thành phố lớn trên tấm bản đồ chữ S của THELYN là lời giải thuyết phục nhất.
                            THELYN định hướng trở thành thương hiệu thời trang hàng hiệu của người Việt, mang tầm vóc quốc gia và vươn tầm quốc tế, sánh ngang với các thương hiệu đắt giá trên thế giới.
                        </div>
                    </div>
                </div>
                <div className="w-50 bg-gray me-4 mb-2 radius-15 flex overflow-hidden">
                    <div className="">
                        <div className="px-6 py-3 h3 text-break fw-bold text-black">
                            Sản phẩm xuất phát từ tình yêu
                        </div>
                        <div className="px-6 h5 text-break text-black">
                            Tại THELYN mọi sản phẩm đều được sản sinh từ trái tim và tình yêu.
                            Điều đặc biệt của THELYN đó chính là luôn quan tâm đến thể trạng thực tế của khách hàng về ngoại hình.
                            Với người phụ nữ có ngoại hình tương đối chuẩn chỉ, vóc dáng cân đối thì mẫu trang phục của THELYN sẽ làm tôn lên sắc vóc yêu kiều cùng những đường cong gợi cảm.
                            Với phụ nữ ở độ tuổi trung niên, có nhiều khiếm khuyết trên cơ thể, THELYN dành riêng những thiết kế thanh lịch để che đi khuyết điểm nhưng vẫn đảm bảo giúp quý cô, quý bà trở nên xinh đẹp, lộng lẫy và đẳng cấp.
                        </div>
                        <div className="px-6 pt-3 h5 text-break text-black">
                            Lắng nghe và thấu cảm với chính người phụ nữ, THELYN sẽ luôn khơi gợi nét duyên dáng và thanh thoát ẩn sâu bên trong.
                            Chứng minh một điều: THELYN là thương hiệu xuất phát từ tình yêu và khát khao chạm đến trái tim của người phụ nữ, nhằm tôn vinh giá trị, vẻ đẹp truyền thống của người phụ nữ Việt Nam hiện đại.
                        </div>
                    </div>
                    <img src={window.location.href + 'assets/img/index-user-2.jpg'} alt="" className='w-50' />
                </div>
            </div>
            <div className="w-full bg-dark">
                <div className="w-50 mt-2 flex space-x-6 mx-auto p-6">
                    <div className="">
                        <div className="fw-bold mb-3">DỊCH VỤ ĐỘC QUYỀN</div>
                        <div className="">
                            Dịch vụ của DLYN
                            <br />
                            Thẻ trả trước
                            <br />
                            Chính sách VIP
                            <br />
                            May theo số đo riêng
                            <br />
                            Chuyến tham quan ảo
                        </div>
                    </div>
                    <div className="">
                        <div className="fw-bold mb-3">CẦN GIÚP ĐỠ</div>
                        <div className="">
                            Chính sách vận chuyển
                            <br />
                            Chính sách đổi trả hàng
                            <br />
                            Hướng dẫn mua hàng
                            <br />
                            Hình thức thanh toán
                            <br />
                            Chính sách bảo hành
                            <br />
                            Hướng dẫn chăm sóc sản phẩm
                            <br />
                            Hướng dẫn lấy thông số đo
                            <br />
                            Tư vấn size
                            <br />
                            Hướng dẫn khiếu nại
                        </div>
                    </div>
                    <div className="">
                        <div className="fw-bold mb-3">CÔNG TY</div>
                        <div className="">
                            Về chúng tôi
                            <br />
                            Thông tin công ty
                            <br />
                            Chính sách bảo mật
                        </div>
                    </div>
                    <div className="">
                        <div className="fw-bold mb-3">TÌM CHÚNG TÔI TRÊN</div>
                        <div className="">
                            Facebook
                            <br />
                            Instagram
                            <br />
                            Tiktok
                            <br />
                            Youtube
                            <br />
                            0384.335.223
                        </div>
                    </div>
                </div>
            </div>
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
        </div>
    )
}

export default DashboardIndex

if (document.getElementById("user-dashboard-index")) {
    ReactDOM.createRoot(document.getElementById("user-dashboard-index")).render(
        <Provider store={store}>
            <DashboardIndex />
        </Provider>
    )
}