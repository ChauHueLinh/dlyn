<?php

namespace App\Http\Resources\Coupon;

use App\Models\Admin;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponCollection extends JsonResource
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
            'value'         => $this->value,
            'unit'          => $this->unit,
            'createdBy'     => $this->createdBy,
            'updatedBy'     => $this->updatedBy,
        ];
    }
}
