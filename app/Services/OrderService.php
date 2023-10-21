<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class OrderService
{
    protected $order;

    public function __construct(
        Order $order,
    )
    {
        $this->order = $order;
    }

    public function index($params)
    {
        $orders = $this->order
            ->sort($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['keywords']), function ($query) use($params) {
                return $query->keywords($params['keywords']);
            })
            ->with([
                'histories',
                'histories.admin',
            ]);
        if(isset($params['per_page'])) {
            $orders = $orders
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $orders = $orders->get();
        }

        return $orders;
    }

    public function update($params)
    {
        try {
            DB::beginTransaction();
            $order = $this->order->find($params['id']);

            if(!$order) {
                return Response::responseArray(false, 'Đã có lỗi xảy ra.');
            }

            $order->update(['status' => $params['status']]);
            $order->histories()->create([
                'orderId' => $order->id,
                'status' => $params['status'],
                'createdBy' => auth()->guard('admin')->user()->id,
            ]);
            DB::commit();

            return Response::responseArray(true, 'Cập nhật thành công.');
        } catch (\Throwable $th) {
            DB::rollBack();

            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
    }
}
