<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

use App\Models\Role;
use App\Models\Admin;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Receipt;
use App\Models\Supplier;
use App\Policies\AdminPolicy;
use App\Policies\RolePolicy;
use App\Policies\CouponPolicy;
use App\Policies\OrderPolicy;
use App\Policies\ProductPolicy;
use App\Policies\ReceiptPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\ProductTypePolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Role::class                     => RolePolicy::class,
        Admin::class                    => AdminPolicy::class,
        Order::class                    => OrderPolicy::class,
        Coupon::class                   => CouponPolicy::class,
        Branch::class                   => BranchPolicy::class,
        Receipt::class                  => ReceiptPolicy::class,
        Product::class                  => ProductPolicy::class,
        Supplier::class                 => SupplierPolicy::class,
        ProductType::class              => ProductTypePolicy::class,
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
