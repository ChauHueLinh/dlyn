<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Auth\LoginController;
use App\Http\Controllers\Admin\Auth\LoginController as UserLoginController;

use App\Http\Controllers\Guest\DashboardController;

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReceiptController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductTypeController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;

use App\Http\Controllers\AdminApi\RoleController as CommonRoleController;
use App\Http\Controllers\AdminApi\AdminController as CommonAdminController;
use App\Http\Controllers\AdminApi\BranchController as CommonBranchController;
use App\Http\Controllers\AdminApi\CouponController as CommonCouponController;
use App\Http\Controllers\AdminApi\ProductController as CommonProductController;
use App\Http\Controllers\AdminApi\ReceiptController as CommonReceiptController;
use App\Http\Controllers\AdminApi\SupplierController as CommonSupplierController;
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
		Route::get('branch', [BranchController::class, 'index'])->name('branch.index');
		Route::get('supplier', [SupplierController::class, 'index'])->name('supplier.index');
		Route::get('receipt', [ReceiptController::class, 'index'])->name('receipt.index');

		Route::prefix('common-api')->name('common.')->group(function () {
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
			Route::prefix('branch')->group(function () {
				Route::get('', [CommonBranchController::class, 'index']);
				Route::post('store', [CommonBranchController::class, 'store'])->name('branch.store');
				Route::put('update', [CommonBranchController::class, 'update'])->name('branch.update');
				Route::delete('destroy', [CommonBranchController::class, 'destroy'])->name('branch.destroy');
			});
			Route::prefix('supplier')->group(function () {
				Route::get('', [CommonSupplierController::class, 'index']);
				Route::post('store', [CommonSupplierController::class, 'store'])->name('supplier.store');
				Route::put('update', [CommonSupplierController::class, 'update'])->name('supplier.update');
				Route::delete('destroy', [CommonSupplierController::class, 'destroy'])->name('supplier.destroy');
			});
			Route::prefix('receipt')->group(function () {
				Route::get('', [CommonReceiptController::class, 'index']);
				Route::post('store', [CommonReceiptController::class, 'store'])->name('receipt.store');
				Route::put('update', [CommonReceiptController::class, 'update'])->name('receipt.update');
				Route::delete('destroy', [CommonReceiptController::class, 'destroy'])->name('receipt.destroy');
			});

			Route::get('admin/constant', [CommonAdminController::class, 'getConstant'])->name('admin.constant');
			Route::get('role/constant', [CommonRoleController::class, 'getConstant'])->name('role.constant');
			Route::get('coupon/constant', [CommonCouponController::class, 'getConstant'])->name('coupon.constant');
			Route::get('product/constant', [CommonProductController::class, 'getConstant'])->name('product.constant');
			Route::get('product-type/constant', [CommonProductTypeController::class, 'getConstant'])->name('product-type.constant');
			Route::get('branch/constant', [CommonBranchController::class, 'getConstant'])->name('branch.constant');
			Route::get('supplier/constant', [CommonSupplierController::class, 'getConstant'])->name('supplier.constant');
			Route::get('receipt/constant', [CommonReceiptController::class, 'getConstant'])->name('receipt.constant');
		});
	});
});
