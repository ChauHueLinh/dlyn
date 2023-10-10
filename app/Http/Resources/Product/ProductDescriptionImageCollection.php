<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductDescriptionImageCollection extends JsonResource
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
            'id' => $this->id,
            'productId' => $this->productId,
            'key' => $this->key,
            'src' => url('storage' . DIRECTORY_SEPARATOR . $this->src),
        ];
    }
}
