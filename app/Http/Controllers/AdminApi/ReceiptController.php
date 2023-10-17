<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Http\Resources\Receipt\ReceiptCollection;
use App\Services\CouponService;
use App\Services\ProductService;
use App\Services\ReceiptService;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    protected $receiptService;
    protected $productService;
    protected $couponService;

    public function __construct(
        ReceiptService $receiptService,
        ProductService $productService,
        CouponService $couponService,
    )
    {
        $this->receiptService = $receiptService;
        $this->productService = $productService;
        $this->couponService = $couponService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);
        
        $params = [
            'keywords' => $request->keywords,
            'per_page' => $request->per_page,
            'page' => $request->page,
        ];

        $receiptsCollection = $this->receiptService->index($params);

        $receipts = ReceiptCollection::collection($receiptsCollection);

        return $receipts;
    }

    public function store(Request $request)
    {
        dd($request->products);
    }

    public function getConstant(Request $request) 
    {
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $products = $this->productService->index([]);
        $coupons = $this->couponService->index([]);

        $params = [
            'permissions'       => $permissions,
            'products'          => $products,
            'coupons'          => $coupons,
        ];

        return $params;
    }
}
