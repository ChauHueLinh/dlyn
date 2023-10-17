<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        // $this->authorize("index", Admin::class);

        // $params = [
        //     'keywords'      => $request->keywords,
        //     'per_page'      => $request->per_page,
        //     'page'          => $request->page ?? 1,
        //     'order_by'      => $request->order_by,
        //     'sort_key'      => $request->sort_key,
        //     'provinceId'    => $request->provinceId,
        //     'districtId'    => $request->districtId,
        //     'wardId'        => $request->wardId,
        // ];

        // $suppliersCollection = $this->supplierService->index($params);

        // $suppliers = SupplierCollection::collection($suppliersCollection);

        // return $suppliers;
    }

    public function getList(Request $request)
    {
        $params = [
            'phone' => $request->phone,
        ];
        $users = $this->userService->getList($params);

        return $users;
    }
}
