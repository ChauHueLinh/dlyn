<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'orderId',
        'status',
        'createdBy',
    ];

    public function admin()
    {
        return $this->hasOne(Admin::class, 'id', 'createdBy');
    }
}
