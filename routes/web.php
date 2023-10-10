<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\LoginController As UserLoginController;

use App\Http\Controllers\Guest\DashboardController;

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductTypeController;
use App\Http\Controllers\Admin\DashboardController As AdminDashboardController;

use App\Http\Controllers\AdminApi\RoleController As CommonRoleController;
use App\Http\Controllers\AdminApi\AdminController As CommonAdminController;
use App\Http\Controllers\AdminApi\CouponController as CommonCouponController;
use App\Http\Controllers\AdminApi\ProductController as CommonProductController;
use App\Http\Controllers\AdminApi\ProductTypeController as CommonProductTypeController;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
// User
Route::get('login', [UserLoginController::class, 'showLoginForm'])->name('login.get');

Route::middleware('authUser')->group(function () {
	Route::get('', [DashboardController::class, 'index'])->name('guest.index');
	Route::get('test', [TestController::class, 'index']);
});


//Admin
Route::prefix('cms')->group(function () {
	Route::get('login', [LoginController::class, 'showLoginForm'])->name('cms.login.get');
	Route::post('login', [LoginController::class, 'login'])->name('cms.login.post');
	
	Route::middleware(['authAdmin'])->group(function () {
		Route::get('logout', [LoginController::class, 'logout'])->name('admin.logout');
		
		Route::get('', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
		Route::get('admin', [AdminController::class, 'index'])->name('admin.index');
		Route::get('role', [RoleController::class, 'index'])->name('role.index');
		Route::get('coupon', [CouponController::class, 'index'])->name('coupon.index');
		Route::get('product', [ProductController::class, 'index'])->name('product.index');
		Route::get('productType', [ProductTypeController::class, 'index'])->name('productType.index');
		
		Route::prefix('common-api')->name('common.')->group(function(){
			Route::prefix('admin')->group(function () {
				Route::get('', [CommonAdminController::class, 'index'])->name('admin.index');
				Route::post('store', [CommonAdminController::class, 'store'])->name('admin.store');
				Route::post('update', [CommonAdminController::class, 'update'])->name('admin.update');
				Route::delete('destroy', [CommonAdminController::class, 'destroy'])->name('admin.destroy');
				Route::put('update-status', [CommonAdminController::class, 'updateStatus'])->name('admin.updateStatus');
			});
			Route::prefix('role')->group(function () {
				Route::get('', [CommonRoleController::class, 'index']);
				Route::post('store', [CommonRoleController::class, 'store'])->name('role.store');
				Route::put('update', [CommonRoleController::class, 'update'])->name('role.update');
				Route::delete('destroy', [CommonRoleController::class, 'destroy'])->name('role.destroy');
			});
			Route::prefix('receipt')->group(function () {
				Route::get('', [CommonRoleController::class, 'index']);
				// Route::post('store', [CommonRoleController::class, 'store'])->name('role.store');
				// Route::put('update', [CommonRoleController::class, 'update'])->name('role.update');
				// Route::delete('destroy', [CommonRoleController::class, 'destroy'])->name('role.destroy');
			});
			Route::prefix('coupon')->group(function () {
				Route::get('', [CommonCouponController::class, 'index']);
				Route::post('store', [CommonCouponController::class, 'store'])->name('coupon.store');
				// Route::put('update', [CommonRoleController::class, 'update'])->name('role.update');
				Route::delete('destroy', [CommonCouponController::class, 'destroy'])->name('coupon.destroy');
			});
			Route::prefix('product')->group(function () {
				Route::get('', [CommonProductController::class, 'index']);
				Route::post('store', [CommonProductController::class, 'store'])->name('product.store');
				Route::put('update', [CommonProductController::class, 'update'])->name('product.update');
				Route::delete('destroy', [CommonProductController::class, 'destroy'])->name('product.destroy');
			});
			Route::prefix('product-type')->group(function () {
				Route::get('', [CommonProductTypeController::class, 'index']);
				Route::post('store', [CommonProductTypeController::class, 'store'])->name('product-type.store');
				Route::put('update', [CommonProductTypeController::class, 'update'])->name('product-type.update');
				Route::delete('destroy', [CommonProductTypeController::class, 'destroy'])->name('product-type.destroy');
			});

			Route::get('admin/constant', [CommonAdminController::class, 'getConstant'])->name('admin.constant');
			Route::get('role/constant', [CommonRoleController::class, 'getConstant'])->name('role.constant');
			Route::get('coupon/constant', [CommonCouponController::class, 'getConstant'])->name('coupon.constant');
			Route::get('product/constant', [CommonProductController::class, 'getConstant'])->name('product.constant');
			Route::get('product-type/constant', [CommonProductTypeController::class, 'getConstant'])->name('product-type.constant');
		});
	});
	
});
