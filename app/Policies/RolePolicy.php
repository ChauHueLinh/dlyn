<?php

namespace App\Policies;

use App\Models\Admin;

class RolePolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexRole');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewRole');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createRole');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateRole');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteRole');
    }
}
