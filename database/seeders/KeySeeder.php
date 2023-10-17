<?php

namespace Database\Seeders;

use App\Models\Key;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class KeySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $keys = [
            [
                'id'        => 1,
                'key'       => Hash::make('dlyn_get_users'),
                'type'      => 'API',
                'scope'     => 'get_user',
            ],
        ];

        foreach ($keys as $key) {
            Key::updateOrCreate(
                [
                    'id'        => $key['id']
                ],
                [
                    'id'        => $key['id'],
                    'key'       => $key['key'],
                    'type'      => $key['type'],
                    'scope'     => $key['scope'],
                ]
            );
        }
    }
}