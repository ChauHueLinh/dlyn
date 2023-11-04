<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'userId',
        'productId',
        'groupAttributeName',
        'quantity',
    ];

    public function scopeUser($query, $userId)
    {
        return $query->where('userId', $userId);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId', 'id');
    }
}
