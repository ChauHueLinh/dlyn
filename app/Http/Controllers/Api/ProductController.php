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
        $params = [
            'per_page' => $request->per_page,
            'page' => $request->page,
        ];
        isset($request->userId) && $params['userId'] =  $request->userId;
        isset($request->productTypeId) && $params['productTypeId'] =  $request->productTypeId;

        $productsCollection = $this->productService->index($params);
        $products = ProductCollection::collection($productsCollection);
        $data = [
            'products' => $products,
            'currentPage' => $productsCollection->currentPage(),
            'lastPage' => $productsCollection->lastPage(),
        ];

        return Response::responseArray(true, 'Thành công', $data);
    }

    public function getSimilarProducts(Request $request)
    {
        $params = [
            'productId' => $request->productId,
        ];
        $similarProductsCollection = $this->productService->index($params);
        $similarProducts = ProductCollection::collection($similarProductsCollection);
        return Response::responseArray(true, 'Thành công', $similarProducts);
    }
}
