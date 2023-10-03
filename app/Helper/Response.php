<?php

namespace App\Helper;

use Illuminate\Http\JsonResponse;

class Response
{
	public static function responseJson($status = false, $message = null, $result = null, $errors = []):JsonResponse
	{
		$response = [
			'status'        => $status,
			'message'       => $message,
		];

		if(isset($result)) {
				$response['result'] = $result;
		}

		if(!empty($errors)) {
				$response['errors'] = $errors;
		}

		return response()->json($response);
	}

	public static function responseArray($status = false, $message, $result = null, $errors = [])
	{
		$response = [
			'status'        => $status,
			'message'       => $message,
		];
		if(isset($result)) {
			$response['result'] = $result;
		}

		if(!empty($errors)) {
				$response['errors'] = $errors;
		}

		return $response;
	}
}