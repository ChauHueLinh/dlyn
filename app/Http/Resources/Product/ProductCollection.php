<?php

namespace App\Http\Resources\Product;

use App\Models\ProductImage;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductCollection extends JsonResource
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
            'id'                => $this->id,
            'name'              => $this->name,
            'price'             => $this->price,
            'status'            => $this->status,
            'quantity'          => $this->quantity,
            'attributes'        => $this->attributes,
            'mainImage'         => url($this->mainImage['src']),
            'descriptionImages' => ProductDescriptionImageCollection::collection($this->descriptionImages),
        ];
    }
}
