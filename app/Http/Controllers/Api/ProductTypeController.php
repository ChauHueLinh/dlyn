<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function getList(Request $request)
    {
        $params = [];

        $productTypesCollection = $this->productTypeService->index($params);

        $productTypes = ProductTypeCollection::collection($productTypesCollection);

        return $productTypes;
    }
}
