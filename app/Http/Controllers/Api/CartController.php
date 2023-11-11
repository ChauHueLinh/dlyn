<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\Cart\CartItemColection;
use App\Jobs\CartJob;
use App\Models\Cart;
use App\Services\CartService;
use Illuminate\Http\Request;

use function React\Promise\all;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index(Request $request)
    {
        $params = [
            'userId' => $request->user()->id,
        ];
        $result = $this->cartService->index($params);
        $cartItems = CartItemColection::collection($result['result']);

        return Response::responseJson($result['status'], $result['message'], $cartItems);
    }

    public function add(Request $request) 
    {
        $params = [
            'userId' => $request->user()->id,
            'productId' => $request->productId,
            'groupAttributeName' => $request->groupAttributeName,
            'quantity' => $request->quantity,
        ];

        $result = $this->cartService->add($params);

        return Response::responseJson($result['status'], $result['message']);
    }

    public function remove(Request $request)
    {
        $params = [
            'productId'             => $request->productId,
            'status'                => $request->status,
            'userId'                => $request->user()->id,
            'groupAttributeName'    => $request->groupAttributeName,
        ];
        
        $result = $this->cartService->remove($params);

        return Response::responseJson($result['status'], $result['message']);
    }
}
