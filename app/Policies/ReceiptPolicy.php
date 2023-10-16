<?php

namespace App\Policies;

use App\Models\Admin;

class ReceiptPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexReceipt');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewReceipt');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createReceipt');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateReceipt');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteAdmin');
    }
}
