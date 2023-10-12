<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Province;
use Illuminate\Database\Seeder;
use App\Models\Role;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $file = file_get_contents('database/backup/province.json');
        $provinces = json_decode($file);
        foreach($provinces as $province) {
            Province::updateOrCreate([
                'id' => $province->id,
            ], [
                'id' => $province->id,
                'name' => $province->name,
                'type' => $province->type,
            ]);
        }
    }
}