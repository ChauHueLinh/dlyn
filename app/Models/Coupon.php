<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    const PERCENT = '%';
    const VND = 'VND';
    const LIST_UNIT = [
        self::PERCENT => '%',
        self::VND => 'VNĐ',
    ];

    protected $fillable = [
        'code',
        'value',
        'unit',
        'createdBy',
        'updatedBy',
    ];
}
