<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Province;
use App\Models\Ward;
use Illuminate\Database\Seeder;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = file_get_contents('database/backup/ward.json');
        $wards = json_decode($file);
        foreach($wards as $ward) {
            Ward::updateOrCreate([
                'id' => $ward->id
            ], [
                'id' => $ward->id,
                'name' => trim($ward->name),
                'type' => $ward->type,
                'districtId' => $ward->districtId,
            ]);
            echo trim($ward->name) . PHP_EOL;
        }
    }
}