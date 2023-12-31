<?php

namespace App\Models;

use App\Services\ProductService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'atributes',
        'price',
        'productTypeId',
        'branchId',
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

    public function scopeStatus($query, $status)
    {
        if($status != 0) {
            return $query->where('status', $status);
        }
    }

    public function scopeProductType($query, $productTypeId)
    {
        return $query->where('productTypeId', $productTypeId);
    }

    public function scopeBranch($query, $branchId)
    {
        return $query->whereHas('branchId', $branchId);
    }

    public function scopeSupplier($query, $supplierId)
    {
        return $query->whereHas('suppliers', function ($q) use($supplierId) {
            return $q->where('suppliers.id', $supplierId);
        });
    }

    public function scopeUser($query, $userId)
    {
        return $query->whereHas('users', function ($q) use($userId) {
            return $q->where('userId', $userId);
        });
    }

    public function scopeSimilar($query, $productId)
    {
        $product = $this->where('id', $productId)->first();
        return $query
            ->where('productTypeId', $product->productTypeId)
            ->where('id', '!=', $product->id)
            ->inRandomOrder();
    }

    public function scopeSort($query, $sortKey, $orderBy)
    {
        return $query->orderBy($sortKey, $orderBy);
    }

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

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_suppliers', 'productId', 'supplierId');
    }

    public function productType()
    {
        return $this->hasOne(ProductType::class, 'id', 'productTypeId');
    }

    public function users()
    {
        return $this->hasMany(UserFavourite::class, 'productId', 'id');
    }
}
