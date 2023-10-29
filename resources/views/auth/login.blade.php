<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">

	<link href="{{ mix('css/app.css') }}" rel="stylesheet">
	
	<title>Login</title>
</head>
<body class="text-autofill-white">
	<div class="vh-100 vw-100 bg-body-dark">
		<div class="h-75 w-50 card-center lis-rounded-circle-50 border overflow-hidden flex">
            <div class="w-50 h-100 bg-login">

            </div>
            <div class="w-50 h-100">
                <div class="w-100 text-center text-white mt-5 fw-bold cursive" style="font-size: 100px">CMS</div>
                <div class="h-75 text-white p-5">
                    <form action="{{ route("cms.login.post") }}" method="POST" autocomplete="off">
                        @csrf
                        <label for="" class="mb-3 h4">Email</label>
                        <div class="w-full bg-transparent overflow-hidden mb-5 h5">
                            <input type="text" name="email" class="w-full bg-transparent input-outline-none text-white" value="{{ old('email') }}">
                        </div>
                        <label for="" class="mb-3 mt-5 h4">Mật khẩu</label>
                        <div class="w-full bg-transparent overflow-hidden h5">
                            <input type="password" name='password' class="w-full bg-transparent input-outline-none text-white mb-5">
                        </div>
                        <div class="w-50 mx-auto mt-5 h4" style="height: 50px">
                            <button type="submit" class="mx-auto rounded-3 w-full btn-login h-100 bg-success">
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
		</div>
	</div>
</body>
</html>