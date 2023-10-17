<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            ->get();

        return $users;
    }
}
