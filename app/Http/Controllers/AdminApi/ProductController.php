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
use App\Services\SupplierService;
use App\Services\UploadFileSevice;
use App\Services\UserService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;
    protected $uploadFileSevice;
    protected $productTypeService;
    protected $branchService;
    protected $supplierService;
    protected $userService;

    public function __construct(
        ProductService $productService,
        UploadFileSevice $uploadFileSevice,
        ProductTypeService $productTypeService,
        SupplierService $supplierService,
        BranchService $branchService,
        UserService $userService,
    )
    {
        $this->productService = $productService;
        $this->uploadFileSevice = $uploadFileSevice;
        $this->productTypeService = $productTypeService;
        $this->branchService = $branchService;
        $this->supplierService = $supplierService;
        $this->userService = $userService;
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
            'supplierId'    => $request->supplierId,
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
            'supplierId' => $request->supplierId,
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
            'attributes'                => $request->attr,
            'price'                     => $request->price,
            'status'                    => $request->status,
            'quantity'                  => $request->quantity,
            'branchId'                  => $request->branchId,
            'supplierId'                => $request->supplierId,
            'productTypeId'             => $request->productTypeId,
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
        $productTypes = $this->productTypeService->index(['sort_key' => 'name', 'order_by' => "ASC"]);
        $branchs = $this->branchService->index([]);
        $suppliers = $this->supplierService->index([]);

        $result = [
            'permissions' => $permissions,
            'status' => (array)$status,
            'productTypes' => $productTypes,
            'branchs' => $branchs,
            'suppliers' => $suppliers,
        ];

        return $result;
    }

    public function getUsers(Request $request)
    {
        $params = [
            'phone' => $request->phone,
        ];

        $users = $this->userService->index($params);

        return $users;
    }
}
