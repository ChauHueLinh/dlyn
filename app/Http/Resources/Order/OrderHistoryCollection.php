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
        if(!empty($this->items)) {
            return [];
        }
        return [
            'id'            => $this->id,
            'adminId'       => $this->admin->id,
            'name'          => $this->admin->name,
            'name'          => $this->admin->name,
            'status'        => $this->status,
            'date'          => Carbon::parse($this->created_at)->format('H:i:s d-m-Y'),
        ];
    }
}
