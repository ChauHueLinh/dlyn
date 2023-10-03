<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\JsonResponse;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function apiResponse($status = false, $message = null, $result = [], $errors = []): JsonResponse
    {
        $response = [
            'status'        => $status,
            'message'       => $message,
        ];

        if(!empty($result)) {
            $response['result'] = $result;
        }

        if(!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response);
    }
}
