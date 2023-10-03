<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helper\Validation;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;

class CheckActiveAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
    //     $admin = $request->user();

    //   if(isset($admin) && $admin->status != Admin::ADMIN_ACTIVITY) {
    //         Auth::logout();
    //         return redirect('login');
    //     } else {
    //         return $next($request);
    //     }    
    }
}
