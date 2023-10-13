<?php

namespace App\Http\Controllers\AdminApi;

use App\Helper\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\Store;
use App\Http\Requests\Supplier\Update;
use App\Http\Resources\Supplier\SupplierCollection;
use App\Models\District;
use App\Models\Province;
use App\Models\Ward;
use App\Services\CadastralService;
use App\Services\SupplierService;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected $supplierService;
    protected $cadastralService;

    public function __construct(
        SupplierService $supplierService,
        CadastralService $cadastralService,
    )
    {
        $this->supplierService = $supplierService;
        $this->cadastralService = $cadastralService;
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
            'provinceId'    => $request->provinceId,
            'districtId'    => $request->districtId,
            'wardId'        => $request->wardId,
        ];

        $suppliersCollection = $this->supplierService->index($params);

        $suppliers = SupplierCollection::collection($suppliersCollection);

        return $suppliers;
    }

    public function store(Store $request) 
    {
        $params = [
            'name' => $request->name,
            'provinceId' => $request->provinceId,
            'districtId' => $request->districtId,
            'wardId' => $request->wardId,
            'address' => $request->address,
        ];

        $result = $this->supplierService->store($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function update(Update $request)
    {
        $params = [
            'id' => $request->id,
            'name' => $request->name,
            'provinceId' => $request->provinceId,
            'districtId' => $request->districtId,
            'wardId' => $request->wardId,
            'address' => $request->address,
        ];

        $result = $this->supplierService->update($params);

        return Response::responseArray($result['status'], $result['message']);
    }

    public function destroy(Request $request) 
    {
        $params = [
            'id' => $request->id,
        ];

        $result = $this->supplierService->destroy($params);

        return Response::responseArray($result['status'], $result['message']);
    }
    
    public function getConstant(Request $request)
    {
        $params = [
            'provinceId' => $request->provinceId,  
            'districtId' => $request->districtId,  
        ];
        
        $permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('displayName', 'key') : [];
        $provinces = $this->cadastralService->getProvinces();
        $districts = $this->cadastralService->getDistricts($params);
        $wards = $this->cadastralService->getWards($params);

        $params = [
            'permissions'       => $permissions,
            'provinces'         => $provinces,
            'districts'         => $districts,
            'wards'             => $wards,
        ];
        return $params;
    }
}
