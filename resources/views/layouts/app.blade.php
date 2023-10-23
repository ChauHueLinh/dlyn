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
<body>
    <div id="app" class="wrapper toggled">
        <div class="sidebar-wrapper" data-simplebar="true">
            <div class="sidebar-header">
                <div class="">
                    <img src="{{ asset('assets/img/logo.png') }}" class="logo-icon-2" alt="" />
                </div>
                <div>
                    <h4 class="logo-text">DLYN</h4>
                </div>
                <a href="javascript:;" class="toggle-btn ms-auto"> <i class="bx bx-menu"></i>
                </a>
            </div>
            <!--navigation-->
           @include('partials.menu')
            <!--end navigation-->
        </div>
        <header class="top-header">
            <nav class="navbar navbar-expand">
                <div class="left-topbar d-flex align-items-center">
                    <a href="javascript:;" class="toggle-btn">	<i class="bx bx-menu"></i>
                    </a>
                </div>
                <div class="flex-grow-1 search-bar">
                </div>
                <div class="right-topbar ms-auto">
                    <ul class="navbar-nav">
                        <li class="nav-item search-btn-mobile">
                            <a class="nav-link position-relative" href="javascript:;">	
                                <i class="bx bx-search vertical-align-middle"></i>
                            </a>
                        </li>
                        <li class="nav-item dropdown dropdown-user-profile">
                            <a class="nav-link dropdown-toggle dropdown-toggle-nocaret" id='btn-account' href="javascript:;" data-bs-toggle="dropdown">
                                <div class="d-flex user-box align-items-center">
                                    <div class="user-info">
                                        <p class="user-name mb-0">{{ auth()->guard('admin')->user()->name }}</p>
                                    </div>
                                    <img src="{{ auth()->guard('admin')->user()->avatar != '' ? asset(auth()->guard('admin')->user()->avatar) : asset('assets/img/default-avatar.png') }}" class="user-img" alt="user avatar">
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end" id='items-btn-account'>
                                <a class="dropdown-item" href="">
                                    <i class="bx bx-user"></i>
                                    <span>Thông tin cá nhân</span>
                                </a>
                                <div class="dropdown-divider mb-0"></div>
                                <a class="dropdown-item" href="">
                                    <i class='bx bx-lock'></i>
                                    <span>Đổi mật khẩu</span>
                                </a>
                                <div class="dropdown-divider mb-0"></div>
                                <a href="{{ route('admin.logout') }}" class="dropdown-item" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                    <i class="bx bx-power-off"></i>
                                    <span>Đăng xuất</span>
                                </a>
                                <form id="logout-form" action="{{ route('admin.logout') }}" method="GET" class="d-none">
                                    @csrf
                                </form>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <div class="page-wrapper">
            <div class="page-content-wrapper">
                <div class="page-content">

                    @yield('content')

                </div>
            </div>
        </div>
        <div class="overlay toggle-btn-mobile"></div>
    </div>


    <script src="{{ asset('assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/simplebar/js/simplebar.min.js') }}"></script>
    <script src="{{ asset('assets/plugins/metismenu/js/metisMenu.min.js') }}"></script>
    
    <script src="{{ mix('js/app.js') }}"></script>
    <script>
        $('#btn-account').on('click', function () {
            console.log('admin');
            if ($('#items-btn-account').hasClass('show')) {
                $('#items-btn-account').removeClass('show')
            } else {
                $('#items-btn-account').addClass('show')
            }
        })
    </script>
</body>
</html>
