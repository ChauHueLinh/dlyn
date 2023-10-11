<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

use App\Models\Admin;
use App\Models\Role;
use App\Models\Coupon;
use App\Models\Product;

use App\Policies\AdminPolicy;
use App\Policies\RolePolicy;
use App\Policies\CouponPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ProductTypePolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Admin::class                    => AdminPolicy::class,
        Role::class                     => RolePolicy::class,
        Coupon::class                   => CouponPolicy::class,
        Product::class                  => ProductPolicy::class,
        ProductType::class              => ProductTypePolicy::class,
        Branch::class                   => BranchPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
}
