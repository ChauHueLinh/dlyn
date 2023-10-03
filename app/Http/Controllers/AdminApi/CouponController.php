<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Coupon\Store;
use App\Http\Resources\Coupon\CouponCollection;
use App\Models\Coupon;
use App\Services\CouponService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    protected $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);

        $params = [
            'keywords' => $request->keywords,
            'page' => $request->page,
            'per_page' => $request->per_page,
            'order_by' => $request->order_by,
            'sort_key' => $request->sort_key,
        ];

        $resultCollection = $this->couponService->index($params);

        $result = CouponCollection::collection($resultCollection);

        return $result;
    }

    public function store(Store $request)
    {
        $params = [
            'code' => $request->code,
            'value' => $request->value,
            'unit' => $request->unit,
            'createdBy' => auth()->guard('admin')->user()->id,
        ];

        $result = $this->couponService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $result = $this->couponService->destroy($request->id);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function getConstant(Request $request)
    {
        $permissions = auth()->guard('admin')->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $unit = Coupon::LIST_UNIT;

        $result = [
            'permissions' => $permissions,
            'unit' => (array)$unit,
        ];

        return $result;
    }
}
