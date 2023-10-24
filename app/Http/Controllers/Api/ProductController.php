<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function getList(Request $request)
    {
        $params = [];

        $productsCollection = $this->productService->index($params);

        $products = ProductCollection::collection($productsCollection);

        return Response::responseArray(true, 'Thành công', $products);
    }
}
