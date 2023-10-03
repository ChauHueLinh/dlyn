<?php

namespace App\Policies;

use App\Models\Admin;

class ProductPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexProduct');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewProduct');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createProduct');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateProduct');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteProduct');
    }
}
