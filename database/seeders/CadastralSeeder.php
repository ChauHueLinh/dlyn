<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Database\Seeder;

class CadastralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = file_get_contents('database/backup/cadastral.json');
        $address = json_decode($file);
        Province::truncate();
        District::truncate();
        Ward::truncate();
        foreach($address as $eachAddress) {
            $provinceAttributes = [
                'name' => $eachAddress->ProvinceName,
                'nameExtension' => implode(',', $eachAddress->NameExtension),
                'type' => str_contains(implode(',', $eachAddress->NameExtension), 'Tỉnh') == true ? 'T' : 'TP'
            ];
            $province = Province::create($provinceAttributes);
            echo 'province ' . trim($province->name) . PHP_EOL;
            if($eachAddress->districts && count($eachAddress->districts) > 0) {
                foreach ($eachAddress->districts as $eachDistrict) {
                    $districtAttributes = [
                        'name' => $eachDistrict->DistrictName,
                        'nameExtension' => (isset($eachDistrict->NameExtension) && count($eachDistrict->NameExtension) > 0) ? implode(',', $eachDistrict->NameExtension) : '',
                    ];
                    if (str_contains($eachDistrict->DistrictName, 'Quận') == true) {
                        $districtAttributes['type'] = 'Q';
                    } elseif (str_contains($eachDistrict->DistrictName, 'Thành phố') == true) {
                        $districtAttributes['type'] = 'TP';
                    } elseif (str_contains($eachDistrict->DistrictName, 'Thị xã') == true) {
                        $districtAttributes['type'] = 'TX';
                    } else {
                        $districtAttributes['type'] = 'H';
                    };
                    $district = $province->districts()->create($districtAttributes);
                    if(isset($eachDistrict->wards) && count($eachDistrict->wards) > 0) {
                        foreach ($eachDistrict->wards as $eachWard) {
                            $wardAttributes = [
                                'name' => $eachWard->WardName,
                                'nameExtension' => (isset($eachWard->NameExtension) && count($eachWard->NameExtension) > 0) ? implode(',', $eachWard->NameExtension) : '',
                            ];
                            if (str_contains($eachWard->WardName, 'Xã') == true) {
                                $wardAttributes['type'] = 'X';
                            } elseif (str_contains($eachDistrict->DistrictName, 'Thị trấn') == true) {
                                $wardAttributes['type'] = 'TT';
                            } else {
                                $wardAttributes['type'] = 'P';
                            };
                            $ward = $district->wards()->create($wardAttributes);
                        }
                    }
                }
            }
        }
    }
}