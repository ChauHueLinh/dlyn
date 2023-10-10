<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            [
                'id'            => 1,
                'key'           => 'admin',
                'displayName'  => 'Quản trị viên',
                'parentId'     => 0
            ],
            [
                'id'            => 2,
                'key'           => 'indexAdmin',
                'displayName'  => 'Danh sách',
                'parentId'     => 1
            ],
            [
                'id'            => 3,
                'key'           => 'createAdmin',
                'displayName'  => 'Tạo mới',
                'parentId'     => 1
            ],
            [
                'id'            => 4,
                'key'           => 'updateAdmin',
                'displayName'  => 'Cập nhật',
                'parentId'     => 1
            ],
            [
                'id'            => 5,
                'key'           => 'deleteAdmin',
                'displayName'  => 'Xóa',
                'parentId'     => 1
            ],
            [
                'id'            => 6,
                'key'           => 'role',
                'displayName'  => 'Vai trò',
                'parentId'     => 0
            ],
            [
                'id'            => 7,
                'key'           => 'indexRole',
                'displayName'  => 'Danh sách',
                'parentId'     => 6
            ],
            [
                'id'            => 8,
                'key'           => 'createRole',
                'displayName'  => 'Tạo mới',
                'parentId'     => 6
            ],
            [
                'id'            => 9,
                'key'           => 'updateRole',
                'displayName'  => 'Cập nhật',
                'parentId'     => 6
            ],
            [
                'id'            => 10,
                'key'           => 'deleteRole',
                'displayName'  => 'Xóa',
                'parentId'     => 6
            ],
            [
                'id'            => 11,
                'key'           => 'coupon',
                'displayName'  => 'Mã giảm giá',
                'parentId'     => 0
            ],
            [
                'id'            => 12,
                'key'           => 'indexCoupon',
                'displayName'  => 'Danh sách',
                'parentId'     => 11
            ],
            [
                'id'            => 13,
                'key'           => 'createCoupon',
                'displayName'  => 'Tạo mới',
                'parentId'     => 11
            ],
            [
                'id'            => 14,
                'key'           => 'updateCoupon',
                'displayName'  => 'Cập nhật',
                'parentId'     => 11
            ],
            [
                'id'            => 15,
                'key'           => 'deleteCoupon',
                'displayName'  => 'Xóa',
                'parentId'     => 11
            ],
            [
                'id'            => 16,
                'key'           => 'product',
                'displayName'  => 'Sản phẩm',
                'parentId'     => 0
            ],
            [
                'id'            => 17,
                'key'           => 'indexProduct',
                'displayName'  => 'Danh sách',
                'parentId'     => 16
            ],
            [
                'id'            => 18,
                'key'           => 'createProduct',
                'displayName'  => 'Tạo mới',
                'parentId'     => 16
            ],
            [
                'id'            => 19,
                'key'           => 'updateProduct',
                'displayName'  => 'Cập nhật',
                'parentId'     => 16
            ],
            [
                'id'            => 20,
                'key'           => 'deleteProduct',
                'displayName'  => 'Xóa',
                'parentId'     => 16
            ],
            [
                'id'            => 21,
                'key'           => 'productType',
                'displayName'  => 'Loại sản phẩm',
                'parentId'     => 0
            ],
            [
                'id'            => 22,
                'key'           => 'indexProductType',
                'displayName'  => 'Danh sách',
                'parentId'     => 21
            ],
            [
                'id'            => 23,
                'key'           => 'createProductType',
                'displayName'  => 'Tạo mới',
                'parentId'     => 21
            ],
            [
                'id'            => 24,
                'key'           => 'updateProductType',
                'displayName'  => 'Cập nhật',
                'parentId'     => 21
            ],
            [
                'id'            => 25,
                'key'           => 'deleteProductType',
                'displayName'  => 'Xóa',
                'parentId'     => 21
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                [
                    'id'            => $permission['id']
                ],
                [
                    'key'           => $permission['key'],
                    'displayName'  => $permission['displayName'],
                    'parentId'     => $permission['parentId'],
                ]
            );
        }
    }
}