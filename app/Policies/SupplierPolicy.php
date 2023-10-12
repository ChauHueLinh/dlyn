<?php

namespace App\Policies;

use App\Models\Admin;

class SupplierPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexSupplier');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewSupplier');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createSupplier');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateSupplier');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteSupplier');
    }
}
