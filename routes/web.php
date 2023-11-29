<?php

use App\Events\Message;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Auth\LoginController;

use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReceiptController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductTypeController;
use App\Http\Controllers\Admin\DashboardController;

use App\Http\Controllers\AdminApi\RoleController as CommonRoleController;
use App\Http\Controllers\AdminApi\UserController as CommonUserController;
use App\Http\Controllers\AdminApi\AdminController as CommonAdminController;
use App\Http\Controllers\AdminApi\OrderController as CommonOrderController;
use App\Http\Controllers\AdminApi\BranchController as CommonBranchController;
use App\Http\Controllers\AdminApi\CouponController as CommonCouponController;
use App\Http\Controllers\AdminApi\ProductController as CommonProductController;
use App\Http\Controllers\AdminApi\ReceiptController as CommonReceiptController;
use App\Http\Controllers\AdminApi\SupplierController as CommonSupplierController;
use App\Http\Controllers\AdminApi\ProductTypeController as CommonProductTypeController;

use App\Http\Controllers\Guest\DashboardController as UserDashboardController;
use App\Http\Controllers\Guest\ProductController as UserProductController;

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
Route::get('test', function(){
	broadcast(new Message(auth()->user(), 'message chat'))->toOthers();
});

// User
 
Route::get('login', [UserLoginController::class, 'showLoginForm'])->name('login.get');

Route::prefix('')->group(function () {
	Route::get('', [UserDashboardController::class, 'index'])->name('guest.index');
	Route::get('test', [UserDashboardController::class, 'test']);
	Route::get('product', [UserProductController::class, 'index'])->name('guest.product');
});


//Admin
Route::prefix('cms')->group(function () {
	Route::post('login', [LoginController::class, 'login'])->name('cms.login.post');
	Route::get('login', [LoginController::class, 'showLoginForm'])->name('cms.login.get');

	Route::middleware(['authAdmin'])->group(function () {
		Route::get('logout', [LoginController::class, 'logout'])->name('admin.logout');

		Route::get('role', [RoleController::class, 'index'])->name('role.index');
		Route::get('admin', [AdminController::class, 'index'])->name('admin.index');
		Route::get('coupon', [CouponController::class, 'index'])->name('coupon.index');
		Route::get('branch', [BranchController::class, 'index'])->name('branch.index');
		Route::get('product', [ProductController::class, 'index'])->name('product.index');
		Route::get('receipt', [ReceiptController::class, 'index'])->name('receipt.index');
		Route::get('', [DashboardController::class, 'index'])->name('admin.dashboard');
		Route::get('supplier', [SupplierController::class, 'index'])->name('supplier.index');
		Route::get('productType', [ProductTypeController::class, 'index'])->name('productType.index');
		Route::get('order', [OrderController::class, 'index'])->name('order.index');

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
			Route::prefix('order')->group(function () {
				Route::get('', [CommonOrderController::class, 'index']);
				Route::post('store', [CommonOrderController::class, 'store'])->name('order.store');
				Route::put('update', [CommonOrderController::class, 'update'])->name('order.update');
				Route::delete('destroy', [CommonOrderController::class, 'destroy'])->name('order.destroy');
			});
			// Route::prefix('user')->group(function () {
			// 	Route::get('', [CommonReceiptController::class, 'index']);
			// 	Route::post('store', [CommonReceiptController::class, 'store'])->name('receipt.store');
			// 	Route::put('update', [CommonReceiptController::class, 'update'])->name('receipt.update');
			// 	Route::delete('destroy', [CommonReceiptController::class, 'destroy'])->name('receipt.destroy');
			// });

			Route::get('role/constant', [CommonRoleController::class, 'getConstant'])->name('role.constant');
			Route::get('admin/constant', [CommonAdminController::class, 'getConstant'])->name('admin.constant');
			Route::get('order/constant', [CommonOrderController::class, 'getConstant'])->name('order.constant');
			Route::get('branch/constant', [CommonBranchController::class, 'getConstant'])->name('branch.constant');
			Route::get('coupon/constant', [CommonCouponController::class, 'getConstant'])->name('coupon.constant');
			Route::get('receipt/constant', [CommonReceiptController::class, 'getConstant'])->name('receipt.constant');
			Route::get('product/constant', [CommonProductController::class, 'getConstant'])->name('product.constant');
			Route::get('supplier/constant', [CommonSupplierController::class, 'getConstant'])->name('supplier.constant');
			Route::get('product-type/constant', [CommonProductTypeController::class, 'getConstant'])->name('product-type.constant');
		});

		Route::prefix('adminApi')->group(function () {
			Route::get('users', [CommonUserController::class, 'getList']);
		});
	});
});
