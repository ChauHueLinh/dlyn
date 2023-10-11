<?php

namespace App\Policies;

use App\Models\Admin;

class BranchPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexBranch');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewBranch');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createBranch');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateBranch');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteBranch');
    }
}
