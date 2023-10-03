<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Http\Requests\Role\Store;
use App\Http\Requests\Role\Update;
use App\Http\Resources\Admin\AdminCollection;
use App\Http\Resources\Role\PermissionCollection;
use App\Http\Resources\Role\RoleCollection;
use App\Models\Admin;
use App\Services\RoleService;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);
        
        $params = [
            'keywords' => $request->keywords,
            'per_page' => $request->per_page,
            'page' => $request->page,
        ];

        $rolesCollection = $this->roleService->index($params);

        $roles = RoleCollection::collection($rolesCollection);

        return $roles;
    }

    public function store(Store $request)
    {
        $params = [
            'name' => $request->name,
            'description' => $request->description,
            'permission' => $request->permission,
        ];
        
        $this->roleService->store($params);

        return $this->apiResponse(true, 'Tạo mới thành công.');
    }

    public function update(Update $request)
    {
        $params = [
            'name' => $request->name,
            'description' => $request->description,
            'permissions' => $request->permissions,
        ];

        $id = $request->id;
        $result = $this->roleService->update($params, $id);

        return $this->apiResponse($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $result = $this->roleService->destroy($request->id);
        
        if($result == true) {
            return $this->apiResponse(true, 'Đã xóa.');
        } else {
            return $this->apiResponse(false, 'Đã có lỗi xảy ra.');
        }
    }

    public function getConstant()
    {
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];

        $listPermissionsCollection = $this->roleService->getPermissions();
        $listPermissions = PermissionCollection::collection($listPermissionsCollection);

        $params = [
            'permissions'       => $permissions,
            'listPermissions'   => $listPermissions,
        ];
        return $params;
    }
}
