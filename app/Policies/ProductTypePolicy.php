<?php

namespace App\Policies;

use App\Models\Admin;

class ProductTypePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexProductType');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewProductType');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createProductType');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateProductType');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteProductType');
    }
}
