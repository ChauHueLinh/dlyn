<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    const FOLDER = 'branch';

    protected $fillable = [
        'name',
        'image',
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
}
