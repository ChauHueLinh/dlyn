<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return view('guest.index');
    }
    public function test(Request $request)
    {
        return $request->all();
    }
}