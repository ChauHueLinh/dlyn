<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&family=Roboto&display=swap" />
                
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body class="text-white">
    
    <div class="" style="margin-top: 107px">
        
        @yield('content')
        
    </div>
    <div class="w-full fixed bg-body-dark flex flex-wrap top-0">
        <div class="w-100 flex" style="height: 70px">
            <div class="w-25 flex items-center h4 ps-4">

            </div>
            <div class="w-50">
                <img src="{{ asset('assets/img/name.png') }}" alt="" class="mx-auto" style="height: 70px">
            </div>
            <div class="w-25 flex justify-content-end relative">
                <div class="w-50 relative">
                    <div class="w-100 flex items-center justify-content-center">
                        <div class="w-100 cursor-pointer flex items-center justify-center">
                            <a href="abababa"><i class='m-0 py-2 bx bx-bell text-white h3'></i></a>
                        </div>
                        <div class="w-100 cursor-pointer flex items-center justify-center">
                            <a href="abababa"><i class='m-0 py-2 bx bx-heart text-white h3'></i></a>
                        </div>
                        <div class="w-100 cursor-pointer flex items-center justify-center">
                            <a href="abababa"><i class='m-0 py-2 bx bx-shopping-bag text-white h3'></i></a>
                        </div>
                        <div class="w-100 cursor-pointer flex items-center justify-center" id="btn-account">
                            <i class='m-0 py-2 bx bx-user text-white h3'></i>
                        </div>
                    </div>
                    <div class="absolute w-100 radius-15 bg-light text-black shadow-lg d-none py-2 overflow-hidden" id="items-btn-account">
                        @if (auth()->guard('user')->user())
                            <div class="p-2 cursor-pointer option">Thông tin tài khoản</div>
                            <div class="p-2 cursor-pointer option">Đổi mật khẩu</div>
                        @endif
                        <div class="p-2 cursor-pointer option">{{ auth()->guard('user')->user() ? 'Đăng xuất' : 'Đăng nhập'}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-75 mx-auto m-0 flex justify-content-around" id="header-menu">
            <div class="flex items-center justify-center cursor-pointer w-100 py-2">
                <a href="{{ route('guest.index')}}" class="text-white">
                    GIỚI THIỆU
                </a>
            </div>
            <div class="flex items-center justify-center cursor-pointer w-100 py-2">
                <a href="{{ route('guest.product')}}" class="text-white">
                    SẢN PHẨM
                </a>
            </div>
            <div class="flex items-center justify-center cursor-pointer py-2 w-100" class="text-white">BỘ SƯU TẬP</div>
            <div class="flex items-center justify-center cursor-pointer py-2 w-100" class="text-white">SHOWROOM</div>
        </div>
    </div>
    
    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/simplebar/js/simplebar.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/metismenu/js/metisMenu.min.js') }}"></script>
    
    <script src="{{ mix('js/app.js') }}"></script>
    <script>
        $.map($('a'), (item) => {
            if(item.href == window.location.href) {
                $(item).attr('class', 'text-black')
                $(item).parent().addClass('bg-light text-black rounded-top')
            } else {
                $(item).parent().removeClass('bg-light text-black rounded-top')
                $(item).attr('class', 'text-white')
            }
        })

        $('#btn-account').on('click', function () {
            if ($('#items-btn-account').hasClass('d-none')) {
                $('#items-btn-account').removeClass('d-none')
            } else {
                $('#items-btn-account').addClass('d-none')
            }
        })
    </script>
</body>
</html>
