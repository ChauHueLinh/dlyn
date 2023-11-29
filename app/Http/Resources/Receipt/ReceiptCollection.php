<?php

namespace App\Http\Resources\Receipt;

use App\Http\Resources\Order\OrderCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptCollection extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if(!empty($this->items)) {
            return [];
        }

        return [
            'id'            => $this->id,
            'code'          => $this->code,
            'total'         => $this->total,
            'status'        => $this->status,
            'name'          => $this->name,
            'address'       => $this->address,
            'phoneNumber'   => $this->phoneNumber,
            'user'          => $this->user,
            'coupon'        => $this->coupon,
            'note'          => $this->note,
            'products'      => $this->products,
            'order'         => new OrderCollection($this->order),
        ];
    }
}
