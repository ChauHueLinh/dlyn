<?php

namespace App\Http\Resources\Cart;

use App\Http\Resources\Product\ProductCollection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemColection extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'groupAttributeName'    => $this->groupAttributeName,
            'quantity'              => $this->quantity,
            'product'               => new ProductCollection($this->product),
        ];
    }
}
