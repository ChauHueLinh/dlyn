<?php

namespace App\Services;

use App\Helper\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UploadFileSevice
{
    public function __construct()
    {
        
    }

	public function uploadImg($file, $folder)
	{
		$time = Carbon::now()->timestamp;
		$fileName = $time . '_' . $file->getClientOriginalName();
		$filePath = $folder . '/' . $fileName;

		if (Storage::disk('public')->exists($filePath)) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        } else {
			Storage::disk('public')->putFileAs($folder, $file, $fileName);
		}

		$fullUrl = $filePath;

		return Response::responseArray(true, 'Thành công.', $fullUrl);
	}

	public function uploadImgs($files, $folder)
	{
		$time = Carbon::now()->timestamp;
		$result = [];
		foreach($files as $file) {
			$fileName = $time . '_' . $file->getClientOriginalName();
			$filePath = $folder . '/' . $fileName;

			if (Storage::disk('public')->exists($filePath)) {
			    return Response::responseArray(false, 'Đã có lỗi xảy ra.');
			} else {
				Storage::disk('public')->putFileAs($folder, $file, $fileName);
			}

			$result[] = $filePath;
		}

		return Response::responseArray(true, 'Thành công.', $result);
	}
}
