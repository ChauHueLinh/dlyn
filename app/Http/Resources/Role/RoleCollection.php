<?php

namespace App\Http\Resources\Role;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleCollection extends JsonResource
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
            'description'   => $this->description,
            'permissions'   => isset($this->permissions) ? array_column($this->permissions->toArray(), 'id') : [],
        ];
    }
}
