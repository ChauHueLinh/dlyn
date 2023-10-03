<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Admin;
use Illuminate\Support\Facades\Auth;

class AdminService
{
    protected $admin;

    public function __construct(Admin $admin)
    {
        $this->admin = $admin;
    }

    public function index($params)
    {
        $admins = $this->admin
            ->where('id', '!=', Auth::guard('admin')->id())
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if(isset($params['keywords'])) {
            $admins = $admins->where ('name', 'LIKE', '%'.trim(urldecode($params['keywords']), ' \n\r\t\v\0').'%');
        }

        if(isset($params['roleId'])) {
            $admins = $admins->where('roleId', $params['roleId']);
        }

        if(isset($params['status'])) {
            $admins = $admins->where('status', $params['status']);
        }

        $admins = $admins->with('role');

        if (isset($params['per_page'])) {
            $admins = $admins
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $admins = $admins->get();
        }

        return $admins;
    }

    public function store($data)
    {
        if($this->admin->create($data)) {
            return Response::responseArray(true, 'Tạo mới thành công.');
        } else {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.'); 
        }
    }

    public function update($data, $id)
    {
        $admin = $this->admin->find($id);

        if(!isset($admin)) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        if($admin->update($data)) {
            return Response::responseArray(true, 'Tạo mới thành công.');
        } else {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.'); 
        }
    }

    public function destroy($id) 
    {
        $admin = $this->admin->find($id)->first();

        if(!isset($admin)) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $admin->delete();

        return Response::responseArray(true, 'Đã xóa thành công.');
    }

    public function upadateStatus($param, Admin $admin) 
    {
        try {
            $admin->update($param);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
}
