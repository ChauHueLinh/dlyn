<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Receipt extends Model
{
    use HasFactory, SoftDeletes;

    const UNPAID = 0;
    const PAID = 1;

    protected $fillable = [
        'code',
        'status',
        'userId',
        'orderId',
        'couponId',
        'total',
        'name',
        'phoneNumber',
        'address',
        'note',
        'createdBy',
        'updatedBy',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'receipt_products', 'receiptId', 'productId')->withPivot('quantity', 'price', 'total');
    }

    public function order()
    {
        return $this->hasOne(Order::class, 'receiptId', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'userId');
    }

    public function coupon()
    {
        return $this->hasOne(Coupon::class, 'id', 'couponId');
    }
}
