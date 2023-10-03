<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = [
            [
                'id'            => 1,
                'name'          => 'Quản trị viên cấp cao',
                'description'   => 'Vai trò quản trị'
            ],
            [
                'id'            => 2,
                'name'          => 'Quản trị viên (non role)',
                'description'   => 'Không vai trò'
            ]
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                [
                    'id'            => $role['id']
                ],
                [
                    'name'          => $role['name'],
                    'description'   => $role['description']
                ]
            );
        }
    }
}