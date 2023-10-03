<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">

	<link href="{{ mix('css/app.css') }}" rel="stylesheet">
	
	<title>Login</title>
</head>
<body>
	<div class="vh-100 vw-100 bg-body-dark">
		<div class="h-50 w-50 card-center lis-rounded-circle-50 border overflow-hidden">
			<div class="h-25 bg-twitter pt-4">
				<div class="h1 text-center fw-bold">Login</div>
			</div>
			<div class="h-75 bg-gray-100 p-5">
				<form action="{{ route("admin.login") }}" method="POST">
					@csrf
					<label for="" class="mb-2 h5">Email</label>
					<div class="w-full bg-transparent overflow-hidden">
						<input type="text" name="email" class="w-full bg-transparent input-outline-none">
					</div>
					<label for="" class="mb-2 mt-4 h5">Mật khẩu</label>
					<div class="w-full bg-transparent overflow-hidden">
						<input type="text" name='password' class="w-full bg-transparent input-outline-none">
					</div>
					<div class="w-25 mx-auto mt-5" style="height: 50px">
						<button type="submit" class="mx-auto rounded-3 w-full btn-login h-100 bg-success">
							Đăng nhập
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>