<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\Login;
use App\Http\Requests\Api\User\Register;
use App\Http\Resources\User\DetailUserClollection;
use App\Models\User;
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

    public function me(Request $request)
    {
        $userId = $request->user()->id;
        $result = $this->userService->me($userId);
        $user = new DetailUserClollection($result['result']);

        return Response::responseJson($result['status'], $result['message'], $user);
    }

    public function sendMailResetPassword()
    {

    }

    public function changePassword()
    {

    }

    public function favourite(Request $request)
    {
        $params = [
            'userId'    => $request->user()->id,
            'productId' => $request->productId,
            'status'    => $request->status,
        ];
        $result = $this->userService->setFavourite($params);
        
        return Response::responseJson($result['status'], $result['message']);
    }
}
