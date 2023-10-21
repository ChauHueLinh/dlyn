<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use Illuminate\Http\Request;
use App\Services\OrderService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\Update;
use App\Http\Resources\Order\OrderCollection;
use App\Models\Order;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);

        $params = [
            'keywords'  => $request->keywords,
            'per_page'  => $request->per_page,
            'page'      => $request->page ?? 1,
            'order_by'  => $request->order_by,
            'sort_key'  => $request->sort_key,
        ];

        $ordersCollection = $this->orderService->index($params);

        $orders = OrderCollection::collection($ordersCollection);

        return $orders;
    }

    public function update(Update $request) 
    {
        $params = [
            'id'        => $request->id,
            'status'    => $request->status,
        ];

        $result = $this->orderService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function getConstant(Request $request)
    {
        $permissions = auth()->guard('admin')->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $status = Order::LIST_STATUS;

        $result = [
            'permissions' => $permissions,
            'status' => $status,
        ];

        return $result;
    }
}
