<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Province;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = file_get_contents('database/backup/district.json');
        $districts = json_decode($file);
        foreach($districts as $district) {
            District::updateOrCreate([
                'id' => $district->id,
            ], [
                'id'            => $district->id,
                'name'          => $district->name,
                'type'          => $district->type,
                'provinceId'    => $district->provinceId,
            ]); 
        }
    }
}