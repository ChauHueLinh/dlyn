<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Supplier;

class SupplierService
{
    protected $supplier;

    public function __construct(
        Supplier $supplier,
    )
    {
        $this->supplier = $supplier;
    }

    public function index($params)
    {
        $suppliers = $this->supplier
            ->sort($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['keywords']), function ($query) use($params) {
                return $query->keywords($params['keywords']);
            })
            ->when(isset($params['provinceId']), function ($query) use($params) {
                return $query->province($params['provinceId']);
            })
            ->when(isset($params['districtId']), function ($query) use($params) {
                return $query->district($params['districtId']);
            })
            ->when(isset($params['wardId']), function ($query) use($params) {
                return $query->ward($params['wardId']);
            });

        $suppliers = $suppliers
            ->with([
                'province',
                'district',
                'ward',
            ]);

        if(isset($params['per_page'])) {
            $suppliers = $suppliers
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $suppliers = $suppliers->get();
        }

        return $suppliers;
    }

    public function store($params)
    {
        $this->supplier->create($params);

        return Response::responseArray(true, 'Tạo mới thành công.');
    }

    public function update($params)
    {
        $supplier = $this->supplier->where('id', $params['id'])->first();

        if(!$supplier) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $supplier->update($params);

        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function destroy($params)
    {
        $supplier = $this->supplier->where('id', $params['id'])->first();

        if(!$supplier) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $supplier->delete();

        return Response::responseArray(true, 'Đã xóa thành công.');
    }
}
