<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductType\Store;
use App\Http\Requests\ProductType\Update;
use App\Http\Resources\ProductType\ProductTypeCollection;
use App\Services\ProductTypeService;
use Illuminate\Http\Request;

class ProductTypeController extends Controller
{
    protected $productTypeService;

    public function __construct(ProductTypeService $productTypeService)
    {
        $this->productTypeService = $productTypeService;
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

        $productTypesCollection = $this->productTypeService->index($params);

        $productTypes = ProductTypeCollection::collection($productTypesCollection);

        return $productTypes;
    }

    public function store(Store $request)
    {
        $params = [
            'name' => $request->name,
        ];

        $result = $this->productTypeService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function update(Update $request)
    {
        $params = [
            'id' => $request->id,
            'name' => $request->name,
        ];

        $result = $this->productTypeService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $params = [
            'id' => $request->id,
        ];

        $result = $this->productTypeService->destroy($params);

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
