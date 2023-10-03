<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

use App\Models\Permission;
use App\Models\Role;

class PermissionRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role        = Role::first();
        $permissions = Permission::all()->pluck('id');

        $role->permissions()->sync($permissions);
    }
}