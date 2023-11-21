<?php

namespace App\Http\Controllers\Api;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Receipt\ApiCreateRequest;
use App\Services\ReceiptService;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    protected $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }
    
    public function createReceipt(ApiCreateRequest $request)
    {
        $params = $request->validated();
        $params['userId'] = $request->user()->id;
        $result = $this->receiptService->apiCreateReceipt($params);

        return Response::responseJson($result['status'], $result['message']);
    }
}