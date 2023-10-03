<?php

namespace App\Policies;

use App\Models\Admin;

class CouponPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        
    }
    
    public function index(Admin $admin)
    {
        return $admin->hasRoles('indexCoupon');
    }

    public function view(Admin $admin)
    {
        return $admin->hasRoles('viewCoupon');
    }

    public function create(Admin $admin)
    {
        return $admin->hasRoles('createCoupon');
    }

    public function update(Admin $admin)
    {
        return $admin->hasRoles('updateCoupon');
    }

    public function delete(Admin $admin)
    {
        return $admin->hasRoles('deleteCoupon');
    }
}
