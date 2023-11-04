<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Cart;
use App\Models\User;

class CartService
{
    protected $cart;
    protected $user;

    public function __construct(
        Cart $cart,
        User $user,
    )
    {
        $this->cart = $cart;
        $this->user = $user;
    }

    public function index($params)
    {
        try {
            $cartItems = $this->cart
                ->orderBy('id', 'DESC')
                ->when(isset($params['userId']), function ($query) use ($params) {
                    return $query->user($params['userId']);
                })
                ->with([
                    'product'
                ])
                ->get();
        
            return Response::responseArray(true, 'Thành công.', $cartItems);
        } catch (\Throwable $th) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.', []);
        }
    }

    public function add($params)
    {
        try {
            $user = $this->user->find($params['userId']);
            if(!$user) {
                return Response::responseArray(false, 'Đã có lỗi xảy ra.');
            }
            $cartItem = $user
                ->cartItems()
                ->where('productId', $params['productId'])
                ->where('groupAttributeName', $params['groupAttributeName'])
                ->first();
            if($cartItem) {
                $cartItem->update([
                    'quantity' => $cartItem->quantity + $params['quantity']
                ]);
            } else {
                $user->cartItems()->create([
                    'productId' => $params['productId'],
                    'groupAttributeName' => $params['groupAttributeName'],
                    'quantity' => $params['quantity'],
                ]);
            }

            return Response::responseArray(true, 'Thêm vào giỏ hàng thành công.');
        } catch (\Throwable $th) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
    }

    public function remove($params)
    {
        try {
            $user = $this->user->find($params['userId']);
            if(!$user) {
                return Response::responseArray(false, 'Đã có lỗi xảy ra.');
            }
            $cartItem = $user
                ->cartItems()
                ->where('productId', $params['productId'])
                ->where('groupAttributeName', $params['groupAttributeName'])
                ->first();
            if($cartItem) {
                $cartItem->update([
                    'quantity' => $cartItem->quantity + $params['quantity']
                ]);
            } else {
                $user->cartItems()->create([
                    'productId' => $params['productId'],
                    'groupAttributeName' => $params['groupAttributeName'],
                    'quantity' => $params['quantity'],
                ]);
            }

            return Response::responseArray(true, 'Thêm vào giỏ hàng thành công.');
        } catch (\Throwable $th) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
    }
}
