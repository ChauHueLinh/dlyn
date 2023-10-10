<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Product;
use App\Models\Permission;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\returnSelf;

class ProductService
{
    protected $product;
    protected $permission;
    protected $productImage;
    protected $productAttribute;

    public function __construct(
        Product $product,
        Permission $permission,
        ProductImage $productImage,
        ProductAttribute $productAttribute,
    )
    {
        $this->product = $product;
        $this->permission = $permission;
        $this->productImage = $productImage;
        $this->productAttribute = $productAttribute;
    }

    public function index($params)
    {
        $products = $this->product
            ->with([
                'attributes',
                'mainImage',
                'descriptionImages',
            ])
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['per_page'])) {
            $products = $products
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $products = $products->get();
        }

        return $products;
    }

    public function store($params) 
    {
        $product = $this->product->create($params);

        if(isset($params['attributes'])){
            foreach($params['attributes'] as $attribute){
                $attribute = json_decode($attribute);
                $this->productAttribute->create([
                    'productId' => $product->id,
                    'name' => $attribute->name,
                    'value' => $attribute->value,
                ]);
            }
        }
        if(isset($params['mainImage'])){
            $this->productImage->create([
                'productId' => $product->id,
                'key' => 'main',
                'src' => $params['mainImage'],
            ]);
        }
        if(isset($params['descriptionImages'])){
            foreach($params['descriptionImages'] as $descriptionImage){
                $this->productImage->create([
                    'productId' => $product->id,
                    'key' => 'description',
                    'src' => $descriptionImage,
                ]);
            }
        }

        return Response::responseArray(true, 'Tạo mới thành công.');
    }

    public function update($params)
    {
        $product = $this->product->where('id', $params['id'])->first();
        $product->update([
            'name' => $params['name'],
            'price' => $params['price'],
            'status' => $params['status'],
            'quantity' => $params['quantity'],
        ]);

        if(isset($params['deletedAttributes'])) {
            $this->productAttribute->where('productId', $params['id'])->whereIn('id', $params['deletedAttributes'])->delete();
        }
        if(isset($params['deletedDescriptionImages'])) {
            $this->productImage->where('productId', $params['id'])->whereIn('id', $params['deletedDescriptionImages'])->delete();
        }
        if(isset($params['mainImage'])) {
            $this->productImage->where('productId', $params['id'])->where('key', 'main')->update(['src' => $params['mainImage']]);
        }
        if(isset($params['attributes'])) {
            foreach($params['attributes'] as $attribute) {
                $attribute = json_decode($attribute);
                $this->productAttribute->updateOrCreate([
                    'id'        => $attribute->id,
                    'productId' => $product->id,
                ], [
                    'productId' => $product->id,
                    'name'      => $attribute->name,
                    'value'     => $attribute->value,
                ]);
            }
        }
        if(isset($params['descriptionImages'])) {
            foreach($params['descriptionImages'] as $descriptionImage) {
                $this->productImage->updateOrCreate([
                    'id'        => $attribute->id,
                    'productId' => $product->id,
                    'key'       => 'description',
                ], [
                    'productId' => $product->id,
                    'key'       => 'description',
                    'src'       => $descriptionImage,
                ]);
            }
        }
        
        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function getPermissions()
    {
        $permissions = $this->permission
            ->where('parentId', Permission::PARENT_ID)
            
            ->with([
                'childrent' => function ($q) {
                    return $q->orderBy('id', 'ASC');
                }
            ])->get();
            
        return $permissions;
    }
}
