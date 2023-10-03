<?php

namespace App\Policies;

use App\Models\Admin;

class AdminPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexAdmin');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewAdmin');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createAdmin');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateAdmin');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteAdmin');
    }
}
