<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PhpParser\Node\Stmt\TryCatch;

class UserService
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function index($params)
    {
        $users = $this->user
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['phone']), function ($query) use ($params) {
                return $query->where('phone', 'LIKE', '%'.$params['phone'].'%');
            });

        if (isset($params['per_page'])) {
            $users = $users
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $users = $users->get();
        }

        return $users;
    }

    public function getList($params)
    {
        $users = $this->user
            ->orderBy('name', 'ASC')
            ->when(isset($params['phone']), function ($query) use ($params) {
                return $query->phone($params['phone']);
            })
            ->when(isset($params['email']), function ($query) use ($params) {
                return $query->email($params['email']);
            })
            ->get();

        return $users;
    }

    public function store($params)
    {
        try {
            $user = $this->user->create([
                'name' => $params['name'],
                'status' => User::ACTIVATE,
                'email' => $params['email'],
                'phone' => $params['phone'],
                'address' => $params['address'],
                'password' => Hash::make($params['password']),
            ]);

            $accessToken = $user->createToken('accessToken')->plainTextToken;

            return Response::responseArray(
                true, 
                'Đăng ký thành công.', 
                [
                    'id'            => $user->id,
                    'name'          => $user->name,
                    'accessToken'   => $accessToken,
                ]
            );
        } catch (\Throwable $th) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.', $th);
        }
    }

    public function login($params)
    {
        $user = $this->user->where('email', $params['email'])->first();
        if(!$user) {
            return Response::responseArray(false, 'Tài khoản hoặc email chưa chính xác.', []);
        }
        if($user->status == User::DEACTIVATE) {
            return Response::responseArray(false, 'Tài khoản đã bị tắt kích hoạt. Vui lòng liên hệ quản trị viên để được hỗ trợ.', []);
        }
        $check = Hash::check($params['password'], $user->password, []);
        if($check == false) {
            return Response::responseArray(false, 'Tài khoản hoặc email chưa chính xác.', []);
        }
        $accessToken = $user->createToken('accessToken')->plainTextToken;
        $data = [
            'id' => $user->id,
            'name' => $user->name,
            'accessToken' => $accessToken,
        ];

        return Response::responseArray(true, "Đăng nhập thành công.", $data);
    }
}
