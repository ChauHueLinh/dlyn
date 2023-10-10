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
        'productType',
        'quantity',
        'status',
    ];

    const FOLDER = 'product';
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

    public function mainImage()
    {
        return $this->hasOne(ProductImage::class, 'productId', 'id')->where('key', 'main');
    }

    public function descriptionImages()
    {
        return $this->hasMany(ProductImage::class, 'productId', 'id')->where('key', 'description');
    }
}
