<?php

namespace App\Services;

use App\Models\District;
use App\Models\Permission;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Support\Facades\Auth;

class CadastralService
{
    protected $province;
    protected $district;
    protected $ward;

    public function __construct(
        Province $province,
        District $district,
        Ward $ward,
    )
    {
        $this->province = $province;
        $this->district = $district;
        $this->ward = $ward;
    }

    public function getProvinces()
    {
        $provinces = $this->province->orderBy('name', 'ASC')->get();

        return $provinces;
    }

    public function getDistricts($params)
    {
        if(isset($params['provinceId'])) {
            $districts = $this->district->where('provinceId', $params['provinceId'])->orderBy('name', 'ASC')->get();
        } else {
            $districts = [];
        }

        return $districts;
    }

    public function getWards($params)
    {
        if(isset($params['districtId'])) {
            $wards = $this->ward->where('districtId', $params['districtId'])->orderBy('name', 'ASC')->get();
        } else {
            $wards = [];
        }
        
        return $wards;
    }
}
