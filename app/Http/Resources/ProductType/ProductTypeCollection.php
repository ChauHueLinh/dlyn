<?php

namespace App\Http\Resources\ProductType;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductTypeCollection extends JsonResource
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
            'name'          => $this->name,
        ];
    }
}
