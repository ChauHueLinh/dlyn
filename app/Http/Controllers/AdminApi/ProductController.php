<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\Store;
use App\Http\Requests\Product\Update;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Product;
use App\Services\BranchService;
use App\Services\ProductService;
use App\Services\ProductTypeService;
use App\Services\UploadFileSevice;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;
    protected $uploadFileSevice;
    protected $productTypeService;
    protected $branchService;

    public function __construct(
        ProductService $productService,
        UploadFileSevice $uploadFileSevice,
        ProductTypeService $productTypeService,
        BranchService $branchService,
    )
    {
        $this->productService = $productService;
        $this->uploadFileSevice = $uploadFileSevice;
        $this->productTypeService = $productTypeService;
        $this->branchService = $branchService;
    }

    public function index(Request $request)
    {
        $this->authorize("index", Admin::class);

        $params = [
            'keywords'      => $request->keywords,
            'per_page'      => $request->per_page,
            'page'          => $request->page ?? 1,
            'order_by'      => $request->order_by,
            'sort_key'      => $request->sort_key,
            'status'        => $request->status,
            'productTypeId' => $request->productTypeId,
            'branchId'      => $request->branchId,
        ];

        $productsCollection = $this->productService->index($params);

        $products = ProductCollection::collection($productsCollection);

        return $products;
    }

    public function store(Store $request)
    {
        $params = [
            'name' => $request->name,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'status' => $request->status,
            'productTypeId' => $request->productTypeId,
            'branchId' => $request->branchId,
            'attributes' => $request->attr,
        ];

        if(isset($request->mainImage)) {
            $params['mainImage'] = $this->uploadFileSevice->uploadImg($request->mainImage, Product::FOLDER)['result'];
        }
        if(isset($request->descriptionImages)) {
            $params['descriptionImages'] = $this->uploadFileSevice->uploadImgs($request->descriptionImages, Product::FOLDER)['result'];
        }

        $result = $this->productService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function update(Update $request) 
    {
        $params = [
            'id'                        => $request->id,
            'name'                      => $request->name,
            'price'                     => $request->price,
            'quantity'                  => $request->quantity,
            'status'                    => $request->status,
            'productTypeId'             => $request->productTypeId,
            'branchId'                  => $request->branchId,
            'attributes'                => $request->attr,
            'deletedAttributes'         => $request->deletedAttributes,
            'deletedDescriptionImages'  => $request->deletedDescriptionImages,
        ];

        if(isset($request->mainImage)) {
            $params['mainImage'] = $this->uploadFileSevice->uploadImg($request->mainImage, Product::FOLDER)['result'];
        }
        if(isset($request->descriptionImages)) {
            $params['descriptionImages'] = $this->uploadFileSevice->uploadImgs($request->descriptionImages, Product::FOLDER)['result'];
        }

        $result = $this->productService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request)
    {
        $params = [
            'id' => $request->id,
        ];

        $result = $this->productService->destroy($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function getConstant(Request $request) 
    {
        $permissions = auth()->guard('admin')->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $status = Product::LIST_STATUS;
        $productTypes = $this->productTypeService->index([]);
        $branchs = $this->branchService->index([]);

        $result = [
            'permissions' => $permissions,
            'status' => (array)$status,
            'productTypes' => $productTypes,
            'branchs' => $branchs,
        ];

        return $result;
    }
}
