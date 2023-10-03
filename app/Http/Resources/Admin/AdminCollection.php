<?php

namespace App\Http\Resources\Admin;

use App\Models\Admin;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCollection extends JsonResource
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
            'status'        => $this->status,
            'phone'         => $this->phone,
            'email'         => $this->email,
            'role'          => $this->role,
            'avatar'        => isset($this->avatar) ? url($this->avatar) : url(Admin::DEFAULT_IMG),
        ];
    }
}
