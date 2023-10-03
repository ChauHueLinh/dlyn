<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admins = [
            [
                'id'        => 1,
                'name'      => 'Dlyn',
                'email'     => 'had261tb@gmail.com',
                'status'    => '1',
                'roleId'    => '1',
                'password'  => Hash::make('Anh0yeu1em@'),
                'phone'     => '0374396613',
            ],
            [
                'id'        => 2,
                'name'      => 'Suqihan',
                'email'     => 'suqihan1004@gmail.com',
                'status'    => '1',
                'roleId'    => '2',
                'password'  => Hash::make('Anh0yeu1em@'),
                'phone'     => '0374396613',
            ],
        ];

        foreach ($admins as $admin) {
            Admin::updateOrCreate(
                [
                    'id'        => $admin['id']
                ],
                [
                    'id'        => $admin['id'],
                    'name'      => $admin['name'],
                    'email'     => $admin['email'],
                    'status'    => $admin['status'],
                    'roleId'    => $admin['roleId'],
                    'password'  => $admin['password'],
                    'phone'     => $admin['phone'],
                ]
            );
        }
    }
}