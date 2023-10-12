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
            });
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
}
