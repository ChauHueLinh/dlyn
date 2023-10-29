<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\Login;
use App\Http\Requests\Api\User\Register;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function login(Login $request)
    {
        $params = $request->validated();
        $result = $this->userService->login($params);
        
        return Response::responseJson($result['status'], $result['message'], $result['result']);
    }

    public function register(Register $request)
    {
        $params = $request->validated();
        $result = $this->userService->store($params);
        
        return Response::responseJson($result['status'], $result['message'], $result['result']);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if($user) {
            $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
            
            return Response::responseJson(true, 'Đăng xuất thành công.');
        }
    }

    public function information()
    {

    }

    public function sendMailResetPassword()
    {

    }

    public function changePassword()
    {

    }

    public function getListFavourite(Request $request)
    {
        return true;
    }
}
