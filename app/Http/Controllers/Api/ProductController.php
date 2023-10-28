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
        $paramsJson = json_decode($request->params);

        $params = [
            'per_page' => trim($paramsJson->per_page) ?? 36,
            'page' => trim($paramsJson->page) ?? 1,
        ];

        $productsCollection = $this->productService->index($params);
        $products = ProductCollection::collection($productsCollection);
        $data = [
            'products' => $products,
            'currentPage' => $productsCollection->currentPage(),
            'lastPage' => $productsCollection->lastPage(),
        ];

        return Response::responseArray(true, 'Thành công', $data);
    }
}
