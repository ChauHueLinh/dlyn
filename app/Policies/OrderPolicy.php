<?php

namespace App\Policies;

use App\Models\Admin;

class OrderPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexOrder');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewOrder');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createOrder');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateOrder');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteOrder');
    }
}
