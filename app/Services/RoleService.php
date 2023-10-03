<?php

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Support\Facades\Auth;

class RoleService
{
    protected $role;
    protected $permission;

    public function __construct(
        Role $role,
        Permission $permission,
    )
    {
        $this->role = $role;
        $this->permission = $permission;
    }

    public function index($params)
    {
        $roles = $this->role
            ->with('permissions')
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if(isset($params['keywords'])) {
            $roles = $roles
                ->where ('name', 'LIKE', '%'.trim(urldecode($params['keywords']), ' \n\r\t\v\0').'%');
        }

        if (isset($params['per_page'])) {
            $roles = $roles
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $roles = $roles->get();
        }

        return $roles;
    }

    public function store($params) 
    {
        
        $role = $this->role->create($params);

        if(isset($params['permission'])) {
            $permissions = explode(',', $params['permission']);
            foreach($permissions as $permission) {
                $role->permissions()->attach($role->id, [
                    'permissionId' => $permission,
                ]);
            }
        }
    }

    public function destroy($id)
    {
        $role = $this->role->find($id);
        if(isset($role)) {
            $role->delete();
            return true;
        } else {
            return false;
        }
    }

    public function update($params, $id)
    {
        $role = $this->role->find($id);

        if(!isset($role)) {
            return [
                'status' => false,
                'message' => 'Đã có lỗi xảy ra.',
            ];
        }

        if($role->id == 1) {
            return [
                'status' => false,
                'message' => 'Không thể chỉnh sửa vai trò này.',
            ];
        }
        
        $role->update($params);

        if(isset($params['permissions']) && !empty($params['permissions'])) {
            $permissions = explode(',', $params['permissions']);
            $role->permissions()->where('roles.id', $role->id)->whereNotIn('permissionId', $permissions)->detach();
            foreach($permissions as $permission) {
                $role->permissions()->attach($role->id, [
                    'permissionId' => $permission,
                ]);
            }
        } else {
            $role->permissions()->where('roles.id', $role->id)->detach();
        }

        return [
            'status' => true,
            'message' => 'Cập nhật thành công.',
        ];
    }

    public function getPermissions()
    {
        $permissions = $this->permission
            ->where('parentId', Permission::PARENT_ID)
            
            ->with([
                'childrent' => function ($q) {
                    return $q->orderBy('id', 'ASC');
                }
            ])->get();
            
        return $permissions;
    }
}
