<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    const NEW = 0;
    const TRANSPORT = 1;
    const DELIVERING = 2;
    const DELIVERED = 3;

    protected $fillable = [
        'code',
        'status',
        'createdBy',
        'updatedBy',
    ];
}
