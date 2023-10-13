<?php

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Resources\Json\JsonResource;

class SupplierCollection extends JsonResource
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
            'address'       => $this->address,
            'wardId'        => $this->wardId,
            'districtId'    => $this->districtId,
            'provinceId'    => $this->provinceId,
            'ward'          => $this->ward['name'],
            'district'      => $this->district['name'],
            'province'      => $this->province['name'],
        ];
    }
}
