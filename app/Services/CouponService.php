<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Coupon;
use Illuminate\Support\Facades\Auth;

class CouponService
{
    protected $coupon;

    public function __construct(Coupon $coupon)
    {
        $this->coupon = $coupon;
    }

    public function index($params)
    {
        $coupons = $this->coupon->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if(isset($params['keywords'])) {
            $coupons = $coupons->where('code', 'LIKE', '%'.$params['keywords'].'%');
        }
        if(isset($params['unit'])) {
            $coupons = $coupons->where('unit', $params['unit']);
        }
        
        if (isset($params['per_page'])) {
            $coupons = $coupons
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $coupons = $coupons->get();
        }

        return $coupons;
    }

    public function destroy($id)
    {
        $coupon = $this->coupon->find($id);
        if(!isset($coupon)) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        if($coupon->delete()) {
            return Response::responseArray(true, 'Đã xóa thành công.');
        } else {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
    }
    
    public function store($params) 
    {
        if($this->coupon->create($params)) {
            return Response::responseArray(true, 'Tạo mới thành công.');
        } else {
            return Response::responseArray(false, 'Đã có lỗi cảy ra.');
        }
    }
}
