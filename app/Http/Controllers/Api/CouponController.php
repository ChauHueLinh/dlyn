<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\Coupon\CouponCollection;
use App\Services\CouponService;
use App\Services\UserService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    protected $couponService;
    protected $userService;

    public function __construct(CouponService $couponService, UserService $userService) 
    {
        $this->couponService = $couponService;
        $this->userService = $userService;
    }
    
    public function getCoupon(Request $request)
    {
        $params = [
            'userId' => $request->user()->id,
        ];

        $result = $this->userService->getListCoupons($params);
        $coupons = CouponCollection::collection($result['result']);

        return Response::responseJson($result['status'], $result['message'], $coupons);
    }
}
