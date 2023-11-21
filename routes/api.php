<?php

use App\Http\Controllers\Api\ProductTypeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ReceiptController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::controller(UserController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('me', 'me');

        Route::post('favourite', 'favourite');
        
        Route::delete('logout', 'logout');
    });
});

Route::controller(ProductController::class)->group(function () {
    Route::get('products', 'getList');
    Route::get('product/similar', 'getSimilarProducts');

});

Route::controller(CartController::class)->group(function () {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('cart', 'index');
        Route::post('cart/add', 'add');
        Route::post('cart/remove', 'remove');
    });
});

Route::controller(CouponController::class)->group(function () {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('coupon', 'getCoupon');
    });
});

Route::controller(ReceiptController::class)->group(function () {
    Route::middleware(['auth:sanctum'])->prefix('receipt')->group(function () {
        Route::post('create', 'createReceipt');
    });
});

Route::get('product-types', [ProductTypeController::class, 'getList']);
