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
    <div id="app" class="wrapper">
        <header class="bg-body-dark">
            <div class="text-white flex space-x-1">
                <div class="w-25 h4 ps-4 flex items-center"> 0384.335.223 </div>
                <div class="w-50">
                    <img src="{{ asset('assets/img/name.png') }}" alt="" style="height: 100px" class="mx-auto">
                </div>
                <div class="w-25 flex justify-content-end items-center">
                    <div class="w-50 flex space-x-1 h1">
                        <div class="w-25"><i class='bx bx-bell'></i></div>
                        <div class="w-25"><i class='bx bx-shopping-bag' ></i></div>
                        <div class="w-25"><i class='bx bx-heart-circle'></i></div>
                        <div class="w-25"><i class='bx bx-user-circle'></i></div>
                    </div>
                </div>
            </div>
            <div class="w-full text-white flex items-center justify-center p-3 h4">
                <div class="flex space-x-6">
                    <div class="">
                        GIỚI THIỆU
                    </div>
                    <div class="">
                        SẢN PHẨM
                    </div>
                    <div class="">
                        BỘ SƯU TẬP
                    </div>
                    <div class="">
                        VIDEO
                    </div>
                    <div class="">
                        SHOWROOM
                    </div>
                    <div class="">
                        V.I.P
                    </div>
                </div>
            </div>
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
</body>
</html>
