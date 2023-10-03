<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        return view('guest.index');
    }
}