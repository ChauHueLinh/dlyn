<?php

use App\Http\Controllers\Api\ProductTypeController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserController;
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
    Route::middleware([])->group(function () {
        Route::post('login', 'login');
        Route::post('register', 'register');
    });

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::delete('logout', 'logout');
    });
});

Route::get('product-types', [ProductTypeController::class, 'getList']);
Route::get('products', [ProductController::class, 'getList']);
Route::get('favourite', [UserController::class, 'getListFavourite']);
