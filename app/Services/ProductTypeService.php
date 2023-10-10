<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\ProductType;

class ProductTypeService
{
    protected $productType;

    public function __construct(
        ProductType $productType,
    )
    {
        $this->productType = $productType;
    }

    public function index($params)
    {
        $productTypes = $this->productType
            ->sort($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['keywords']), function ($query) use($params) {
                return $query->keywords($params['keywords']);
            });
        if(isset($params['per_page'])) {
            $productTypes = $productTypes
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $productTypes = $productTypes->get();
        }

        return $productTypes;
    }

    public function store($params)
    {
        $this->productType->create([
            'name' => $params['name'],
        ]);

        return Response::responseArray(true, 'Tạo mới thành công.');
    }

    public function update($params)
    {
        $productType = $this->productType->where('id', $params['id'])->update(['name' => $params['name']]);

        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function destroy($params)
    {
        $productType = $this->productType->where('id', $params['id'])->delete();

        return Response::responseArray(true, 'Đã xóa thành công.');
    }
}
