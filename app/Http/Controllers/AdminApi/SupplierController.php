<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
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
            'keywords'  => $request->keywords,
            'per_page'  => $request->per_page,
            'page'      => $request->page ?? 1,
            'order_by'  => $request->order_by,
            'sort_key'  => $request->sort_key,
        ];

        $suppliersCollection = $this->supplierService->index($params);

        $suppliers = SupplierCollection::collection($suppliersCollection);

        return $suppliers;
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
