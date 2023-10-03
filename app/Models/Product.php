<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'atributes',
        'price',
    ];

    const HOT = 1;
    const OUT_OF_STOCK = 2;
    const LIST_STATUS = [
        self::HOT => 'Hot',
        self::OUT_OF_STOCK => 'Hết hàng',
    ];

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'productId', 'id');
    }
}
