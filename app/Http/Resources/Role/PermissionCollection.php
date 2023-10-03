<?php

namespace App\Http\Resources\Role;

use Illuminate\Http\Resources\Json\JsonResource;

class PermissionCollection extends JsonResource
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
            'id'           => $this->id,
            'key'          => $this->key,
            'displayName'  => $this->displayName,
            'permissions'  => PermissionDetailsCollection::collection($this->childrent),
        ];
    }
}
