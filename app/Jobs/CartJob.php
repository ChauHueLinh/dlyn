<?php

namespace App\Jobs;

use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Stmt\TryCatch;

class CartJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $productId;
    protected $groupAttributeName;
    protected $userId;
    protected $quantity;

    public function __construct($params)
    {
        $this->productId = $params['productId'];
        $this->groupAttributeName = $params['groupAttributeName'];
        $this->userId = $params['userId'];
        $this->quantity = $params['quantity'];
    }

    public function handle(User $user, ProductAttribute $productAttribute)
    {
        try {
            DB::beginTransaction();
            $user = $user->find($this->userId);
            $cartItem = $user
                ->cartItems()
                ->where('productId', $this->productId)
                ->where('groupAttributeName', $this->groupAttributeName)
                ->first();
            // if($cartItem) {
            //     $cartItem->update([
            //         'quantity' => $cartItem->quantity + $this->quantity,
            //     ]);
            // } else {
            //     $user->cartItems()->save([
            //         'productId' => $this->productId,
            //         'groupAttributeName' => $this->groupAttributeName,
            //         'quantity' => $this->quantity,
            //     ]);
            // }
            $productAttributes = $productAttribute
                ->where('productId', $this->productId)
                ->where('groupName', $this->groupAttributeName)
                ->get();
            foreach($productAttributes as $eachAttribute) {
                $eachAttribute->update([
                    'quantity' => $eachAttribute->quantity - $this->quantity,
                ]);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }
    }
}
