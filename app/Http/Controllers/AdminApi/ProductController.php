<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\Store;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
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

        $productsCollection = $this->productService->index($params);

        $products = ProductCollection::collection($productsCollection);

        return $products;
    }

    public function store(Store $request)
    {
        dd($request->all());
    }

    public function getConstant(Request $request) 
    {
        $permissions = auth()->guard('admin')->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $status = Product::LIST_STATUS;

        $result = [
            'permissions' => $permissions,
            'status' => (array)$status,
        ];

        return $result;
    }
}
