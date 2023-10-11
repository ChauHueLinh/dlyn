<?php

namespace App\Http\Resources\Branch;

use Illuminate\Http\Resources\Json\JsonResource;

class BranchCollection extends JsonResource
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
            'image'         => url('storage' . DIRECTORY_SEPARATOR . $this->image),
        ];
    }
}
