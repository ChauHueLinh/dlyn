<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    const NEW = 0;
    const CONFIRMED = 1;
    const TRANSPORT = 2;
    const DELIVERING = 3;
    const DELIVERED = 4;

    const LIST_STATUS = [
        self::NEW => 'Đang xác nhận',
        self::CONFIRMED => 'Đã xác nhận',
        self::TRANSPORT => 'Đang vận chuyển',
        self::DELIVERING => 'Đang giao hàng',
        self::DELIVERED => 'Đã giao hàng',
    ];

    protected $fillable = [
        'code',
        'status',
        'createdBy',
        'updatedBy',
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

    public function histories()
    {
        return $this->hasMany(OrderHistory::class, 'orderId', 'id')->orderBy('id', 'DESC');
    }
}
