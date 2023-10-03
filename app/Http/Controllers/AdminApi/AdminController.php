<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Store;
use App\Http\Requests\Admin\Update;
use App\Http\Resources\Admin\AdminCollection;
use App\Models\Admin;
use App\Services\AdminService;
use App\Services\RoleService;
use App\Services\UploadFileSevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    protected $adminService;
    protected $roleService;
    protected $uploadFileService;

    public function __construct(
        AdminService $adminService,
        RoleService $roleService,
        UploadFileSevice $uploadFileService,
    )
    {
        $this->roleService = $roleService;
        $this->adminService = $adminService;
        $this->uploadFileService = $uploadFileService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);
        
        $params = [
            'keywords' => $request->keywords,
            'per_page' => $request->per_page,
            'page' => $request->page,
            'roleId' => $request->roleId,
            'status' => $request->status,
        ];

        $adminsCollection = $this->adminService->index($params);

        $admins = AdminCollection::collection($adminsCollection);

        return $admins;
    }

    public function store(Store $request)
    {
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'roleId' => $request->roleId,
            'status' => $request->status,
        ];
        if(isset($request->avatar)) {
            $avatar = $this->uploadFileService->uploadImg($request->avatar, Admin::FOLDER);
            if($avatar['status'] == false) {
                return Response::responseJson(false, $avatar['message']);
            } else {
                $data['avatar'] = $avatar['result'];
            }
        }

        $result = $this->adminService->store($data);

        return Response::responseJson($result['status'], $result['message']);
    }

    public function update(Update $request)
    {
        $data = [
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'roleId' => $request->roleId,
            'status' => $request->status,
        ];

        if(isset($request->avatar)) {
            $avatar = $this->uploadFileService->uploadImg($request->avatar, Admin::FOLDER);
            if($avatar['status'] == false) {
                return Response::responseJson(false, $avatar['message']);
            } else {
                $data['avatar'] = $avatar['result'];
            }
        }

        if(isset($request->password)) {
            $data['password'] = Hash::make($request->password);
        }

        $result = $this->adminService->update($data, $request->id);

        return Response::responseJson($result['status'], $result['message']);
    }

    public function destroy(Request $request) {
        $params = [
            'id' => $request->id,
        ];

        $result = $this->adminService->destroy($params);

        return $this->apiResponse($result['status'], $result['message']);
    }

    public function updateStatus(Request $request)
    {
        try {
            $params = [
                'status' => $request->status,
            ];
    
            $admin = Admin::find($request->id);
    
            $this->adminService->upadateStatus($params, $admin);

            return $this->apiResponse(true, 'Cập nhật thành công.'); 
        } catch (\Exception $e) {
            return $this->apiResponse(false, 'Cập nhật không thành công.', [], $e->getMessage());
        }
    }

    public function getConstant(Request $request)
    {
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $roles = $this->roleService->index([]);
        $status = Admin::LIST_STATUS;

        $result = [
            'permissions' => $permissions,
            'roles' => $roles,
            'status' => (array)$status,
        ];

        return $result;
    }
}
