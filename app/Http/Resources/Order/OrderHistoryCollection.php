<?php

namespace App\Http\Resources\Order;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderHistoryCollection extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        if($this->resource) {

        }
        if(!empty($this->items)) {
            return [];
        }
        return [
            'id'            => $this->id,
            'status'        => $this->status,
            'date'          => Carbon::parse($this->created_at)->format('H:i:s d-m-Y'),
        ];
    }
}
