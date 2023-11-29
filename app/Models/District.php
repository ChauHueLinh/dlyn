<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'nameExtension',
        'type',
        'provinceId',
    ];

    public function wards()
    {
        return $this->hasMany(Ward::class, 'districtId', 'id');
    }
}
