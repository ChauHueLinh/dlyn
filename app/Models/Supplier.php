<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'provinceId',
        'districtId',
        'wardId',
        'address',
    ];

    public function scopeSort($query, $sortKey, $orderBy)
    {
        return $query->orderBy($sortKey, $orderBy);
    }

    public function scopeKeywords($query, $keywords)
    {
        $keywords = trim(urldecode($keywords));
        
        return $query->where('name', 'LIKE', "%$keywords%");
    }

    public function scopeProvince($query, $provinceId)
    {
        return $query->where('provinceId', $provinceId);
    }

    public function scopeDistrict($query, $districtId)
    {
        return $query->where('districtId', $districtId);
    }

    public function scopeWard($query, $wardId)
    {
        return $query->where('wardId', $wardId);
    }

    public function province()
    {
        return $this->hasOne(Province::class, 'id', 'provinceId');
    }

    public function district()
    {
        return $this->hasOne(District::class, 'id', 'districtId');
    }

    public function ward()
    {
        return $this->hasOne(Ward::class, 'id', 'wardId');
    }
}
