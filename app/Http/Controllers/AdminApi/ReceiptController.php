<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Receipt\Store;
use App\Http\Requests\Receipt\Update;
use App\Http\Resources\Receipt\ReceiptCollection;
use App\Models\Receipt;
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

    public function store(Store $request)
    {
        $params = [
            'userId'    => $request->userId,
            'name'      => $request->name,
            'phone'     => $request->phone,
            'email'     => $request->email,
            'address'   => $request->address,
            'note'      => $request->note,
            'products'  => $request->products,
            'status'    => $request->status,
            'couponId'  => $request->couponId,
        ];

        $result = $this->receiptService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function update(Update $request)
    {
        $params = [
            'id' => $request->id,
            'status' => $request->status,
            'note' => $request->note,
        ];

        $result = $this->receiptService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $params = [
            'id' => $request->id,
        ];

        $result = $this->receiptService->destroy($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function getConstant(Request $request) 
    {
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $products = $this->productService->index([]);
        $coupons = $this->couponService->index([]);

        $params = [
            'permissions'       => $permissions,
            'products'          => $products,
            'coupons'           => $coupons,
        ];

        return $params;
    }
}
