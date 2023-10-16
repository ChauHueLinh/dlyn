<?php

namespace App\Services;

use App\Models\Receipt;

use function PHPUnit\Framework\returnSelf;

class ReceiptService
{
    protected $receipt;

    public function __construct(
        Receipt $receipt,
    )
    {
        $this->receipt = $receipt;
    }

    public function index($params)
    {
        $receipts = $this->receipt
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            // ->when(isset($params['status']), function ($query) use ($params) {
            //     return $query->status($params['status']);
            // })
            // ->when(isset($params['productTypeId']), function ($query) use ($params) {
            //     return $query->productType($params['productTypeId']);
            // })
            // ->when(isset($params['supplierId']), function ($query) use ($params) {
            //     return $query->supplier($params['supplierId']);
            // })
            // ->when(isset($params['branchId']), function ($query) use ($params) {
            //     return $query->branch($params['branchId']);
            // })
            ;

        $receipts = $receipts
            ->with([
                'attributes',
                'mainImage',
                'descriptionImages',
                'suppliers'
            ]);

        if (isset($params['per_page'])) {
            $receipts = $receipts
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $receipts = $receipts->get();
        }

        return $receipts;
    }
}
