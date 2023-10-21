<?php

namespace App\Http\Resources\Order;

use App\Models\OrderHistory;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderCollection extends JsonResource
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
            'status'        => $this->status,
            'histories'     => OrderHistoryCollection::collection($this->histories),
        ];
    }
}
