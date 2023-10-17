<?php

namespace Database\Seeders;

use App\Models\Key;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name'      => 'Hồng',
                'status'    => 1,
                'email'     => 'hvh@gmail.com',
                'phone'     => '0975819157',
                'address'   => '364 Phan Bá Vành, phường Quang Trung, thành phố Thái Bình, tỉnh Thái Bình',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Toan',
                'status'    => 1,
                'email'     => 'btbh@gmail.com',
                'phone'     => '0979006684',
                'address'   => '364 Phan Bá Vành, phường Quang Trung, thành phố Thái Bình, tỉnh Thái Bình',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Phượng',
                'status'    => 1,
                'email'     => 'hbp@gmail.com',
                'phone'     => '0384142938',
                'address'   => '364 Phan Bá Vành, phường Quang Trung, thành phố Thái Bình, tỉnh Thái Bình',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dũng',
                'status'    => 1,
                'email'     => 'had@gmail.com',
                'phone'     => '0384335223',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn@gmail.com',
                'phone'     => '0374396613',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn1@gmail.com',
                'phone'     => '0374396614',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn2@gmail.com',
                'phone'     => '0374396615',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn3@gmail.com',
                'phone'     => '03743966136',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn4@gmail.com',
                'phone'     => '0374396617',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
            [
                'name'      => 'Dlyn',
                'status'    => 1,
                'email'     => 'dlyn5@gmail.com',
                'phone'     => '0374396618',
                'address'   => '286 Nguyễn Xiển, huyện Thanh Trì, Hà Nội',
                'password'  => Hash::make('12345678'),
            ],
        ];

        foreach ($users as $user) {
            User::create(
                [
                    'name'        => $user['name'],
                    'email'       => $user['email'],
                    'phone'      => $user['phone'],
                    'status'     => $user['status'],
                    'address'     => $user['address'],
                    'password'     => $user['password'],
                ]
            );
        }
    }
}