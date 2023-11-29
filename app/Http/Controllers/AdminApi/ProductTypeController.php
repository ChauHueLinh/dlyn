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

    public function store(Request $request)
    {
        $attr = [
            '{"name":"vai","value":"36","groupName":"S","quantity":"5"}',
            '{"name":"ngực","value":"82","groupName":"S","quantity":"5"}',
            '{"name":"eo","value":"64","groupName":"S","quantity":"5"}',
            '{"name":"hông","value":"88","groupName":"S","quantity":"5"}',
            '{"name":"vai","value":"37","groupName":"M","quantity":"5"}',
            '{"name":"ngực","value":"86","groupName":"M","quantity":"5"}',
            '{"name":"eo","value":"68","groupName":"M","quantity":"5"}',
            '{"name":"hông","value":"92","groupName":"M","quantity":"5"}',
            '{"name":"vai","value":"38","groupName":"L","quantity":"5"}',
            '{"name":"ngực","value":"90","groupName":"L","quantity":"5"}',
            '{"name":"eo","value":"72","groupName":"L","quantity":"5"}',
            '{"name":"hông","value":"96","groupName":"L","quantity":"5"}',
            '{"name":"vai","value":"39","groupName":"XL","quantity":"5"}',
            '{"name":"ngực","value":"94","groupName":"XL","quantity":"5"}',
            '{"name":"eo","value":"75","groupName":"XL","quantity":"5"}',
            '{"name":"hông","value":"100","groupName":"XL","quantity":"5"}',
            '{"name":"vai","value":"40","groupName":"XL","quantity":"5"}',
            '{"name":"ngực","value":"98","groupName":"XL","quantity":"5"}',
            '{"name":"eo","value":"80","groupName":"XL","quantity":"5"}',
            '{"name":"hông","value":"104","groupName":"XL","quantity":"5"}',
        ];
        if(isset($request->mainImage)) {
            $mainImage = $this->uploadFileSevice->uploadImg($request->mainImage, Product::FOLDER)['result'];
        }
        if(isset($request->descriptionImages)) {
            $descriptionImages = $this->uploadFileSevice->uploadImgs($request->descriptionImages, Product::FOLDER)['result'];
        }
        $params = [
            'name' => $request->name,
            'price' => $request->price,
            'quantity' => 20,
            'status' => $request->status,
            'productTypeId' => 2,
            'branchId' => 1,
            'attributes' => $attr,
            'supplierId' => [1],
            'mainImage' => $mainImage,
            'descriptionImages' => $descriptionImages,
        ];
        
        
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
