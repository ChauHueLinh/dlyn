<?php

namespace App\Http\Resources\Product;

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
        $attributes = [];
        if(isset($this->attributes)) {
            foreach($this->attributes->toArray() as $attribute) {
                if(!isset($attributes[$attribute['groupName']])) {
                    $attributes[$attribute['groupName']] = [
                        'name'      => $attribute['groupName'],
                        'quantity'  => $attribute['quantity'],
                        'attributes'  => [],
                    ];
                }
                array_push($attributes[$attribute['groupName']]['attributes'], [
                    'id' => $attribute['id'],
                    'name' => $attribute['name'],
                    'value' => $attribute['value'],
                ]);
            }
        }
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'price'             => $this->price,
            'status'            => $this->status,
            'quantity'          => $this->quantity,
            'attributes'        => $attributes,
            'mainImage'         => url('storage' . DIRECTORY_SEPARATOR . $this->mainImage['src']),
            'descriptionImages' => ProductDescriptionImageCollection::collection($this->descriptionImages),
            'suppliers'         => $this->suppliers,
            'productTypeId'     => $this->productTypeId,
            'branchId'          => $this->branchId,
        ];
    }
}
