<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Product;
use App\Models\Permission;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['status']), function ($query) use ($params) {
                return $query->status($params['status']);
            })
            ->when(isset($params['productTypeId']), function ($query) use ($params) {
                return $query->productType($params['productTypeId']);
            })
            ->when(isset($params['supplierId']), function ($query) use ($params) {
                return $query->supplier($params['supplierId']);
            })
            ->when(isset($params['branchId']), function ($query) use ($params) {
                return $query->branch($params['branchId']);
            })
            ->when(isset($params['userId']), function ($query) use ($params) {
                return $query->user($params['userId']);
            })
            ->when(isset($params['productId']), function ($query) use ($params) {
                return $query->similar($params['productId'])->inRandomOrder()->limit(4);
            });

        $products = $products
            ->with([
                'attributes',
                'mainImage',
                'descriptionImages',
                'suppliers',
                'productType'
            ]);

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

        foreach($params['supplierId'] as $supplierId) {
            $product->suppliers()->attach($supplierId);
        }

        if(isset($params['attributes'])){
            foreach($params['attributes'] as $attribute){
                $attribute = json_decode($attribute);
                $product->attributes()->create([
                    'name' => $attribute->name,
                    'value' => $attribute->value,
                    'groupName' => $attribute->groupName,
                    'quantity' => $attribute->quantity,
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
        
        if(!$product) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $product->update([
            'name'          => $params['name'],
            'price'         => $params['price'],
            'status'        => $params['status'],
            'productTypeId' => $params['productTypeId'],
            'quantity'      => $params['quantity'],
        ]);

        if(isset($params['deletedAttributes'])) {
            $this->productAttribute->where('productId', $params['id'])->whereIn('id', $params['deletedAttributes'])->delete();
        }
        if(isset($params['deletedDescriptionImages'])) {
            $deletedDescriptionImages = $this->productImage->where('productId', $params['id'])->whereIn('id', $params['deletedDescriptionImages'])->get();
            foreach($deletedDescriptionImages as $deletedDescriptionImage) {
                if(Storage::disk('public')->exists($deletedDescriptionImage['src'])) {
                    Storage::disk('public')->delete($deletedDescriptionImage['src']);
                }
                $deletedDescriptionImage->delete();
            }
        }
        if(isset($params['mainImage'])) {
            $deletedMainImage = $this->productImage->where('productId', $params['id'])->where('key', 'main')->first();
            if(Storage::disk('public')->exists($deletedMainImage['src'])) {
                Storage::disk('public')->delete($deletedMainImage['src']);
            }
            $deletedMainImage->update(['src' => $params['mainImage']]);
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
                    'groupName' => $attribute->groupName,
                    'quantity'  => $attribute->quantity,
                ]);
            }
        }
        if(isset($params['descriptionImages'])) {
            foreach($params['descriptionImages'] as $descriptionImage) {
                $this->productImage->create([
                    'productId' => $product->id,
                    'key'       => 'description',
                    'src'       => $descriptionImage,
                ]);
            }
        }

        $product->suppliers()->sync($params['supplierId']);
        
        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function destroy($params)
    {
        $images =  $this->productImage->where('productId', $params['id'])->get();
        $attributes =  $this->productAttribute->where('productId', $params['id'])->get();

        $this->product->where('id', $params['id'])->delete();
        foreach($images as $image) {
            if(Storage::disk('public')->exists($image['src'])) {
                Storage::disk('public')->delete($image['src']);
            }
            $image->delete();
        }
        foreach($attributes as $attribute) {
            $attribute->delete();
        }

        return Response::responseArray(true, 'Đã xóa thành công.');
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
