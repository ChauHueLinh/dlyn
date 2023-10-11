<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Branch\Store;
use App\Http\Requests\Branch\Update;
use App\Http\Resources\Branch\BranchCollection;
use App\Models\Branch;
use App\Services\BranchService;
use App\Services\UploadFileSevice;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    protected $branchService;
    protected $uploadFileService;

    public function __construct(
        BranchService $branchService,
        UploadFileSevice $uploadFileService,
    )
    {
        $this->branchService = $branchService;
        $this->uploadFileService = $uploadFileService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);

        $params = [
            'keywords'  => $request->keywords,
            'per_page'  => $request->per_page,
            'page'      => $request->page ?? 1,
            'order_by'  => $request->order_by,
            'sort_key'  => $request->sort_key,
        ];

        $branchesCollection = $this->branchService->index($params);

        $branches = BranchCollection::collection($branchesCollection);

        return $branches;
    }

    public function store(Store $request) 
    {
        $params = [
            'name' => $request->name,
            'image' => $this->uploadFileService->uploadImg($request->avatar, Branch::FOLDER)['result'],
        ];

        $result = $this->branchService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function update(Update $request)
    {
        $params = [
            'id' => $request->id,  
            'name' => $request->name,  
        ];

        if(isset($request['avatar'])) {
            $params['image'] = $this->uploadFileService->uploadImg($request->avatar, Branch::FOLDER)['result'];
        }

        $result = $this->branchService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $params =[
            'id' => $request->id,
        ];

        $result = $this->branchService->destroy($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function getConstant(Request $request)
    {
        $permissions = auth()->guard('admin')->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];

        $result = [
            'permissions' => $permissions,
        ];

        return $result;
    }
}
