<?php

namespace App\Services;

use App\Helper\Response;
use App\Models\Branch;
use Illuminate\Support\Facades\Storage;

class BranchService
{
    protected $branch;

    public function __construct(
        Branch $branch,
    )
    {
        $this->branch = $branch;
    }

    public function index($params)
    {
        $branches = $this->branch
            ->sort($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            ->when(isset($params['keywords']), function ($query) use($params) {
                return $query->keywords($params['keywords']);
            });
        if(isset($params['per_page'])) {
            $branches = $branches
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $branches = $branches->get();
        }

        return $branches;
    }

    public function store($params)
    {
        $this->branch->create($params);

        return Response::responseArray(true, 'Tạo mới thành công');
    }

    public function update($params)
    {
        $branch = $this->branch->where('id', $params['id'])->first();
        if(!$branch) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
        if(isset($params['image'])) {
            if(Storage::disk(('public'))->exists($branch->image)) {
                Storage::disk(('public'))->delete($branch->image);
            }
        }

        $branch->update($params);

        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function destroy($params)
    {
        $branch = $this->branch->where('id', $params['id'])->first();
        if(!$branch) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }
        if(Storage::disk(('public'))->exists($branch->image)) {
            Storage::disk(('public'))->delete($branch->image);
        }

        $branch->delete();

        return Response::responseArray(true, 'Đã xóa thành công.');
    }
}
