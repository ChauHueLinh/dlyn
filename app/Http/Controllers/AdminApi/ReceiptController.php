<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Http\Resources\Receipt\ReceiptCollection;
use App\Services\ReceiptService;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    protected $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);
        
        $params = [
            'keywords' => $request->keywords,
            'per_page' => $request->per_page,
            'page' => $request->page,
        ];

        $receiptsCollection = $this->receiptService->index($params);

        $receipts = ReceiptCollection::collection($receiptsCollection);

        return $receipts;
    }

    public function getConstant(Request $request) 
    {
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];

        $params = [
            'permissions'       => $permissions,
        ];

        return $params;
    }
}
