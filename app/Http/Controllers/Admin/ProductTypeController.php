<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class ProductTypeController extends Controller
{
    public function index()
    {
        return view('admin.productType.index');
    }
}
