<?php

namespace App\Http\Middleware;

use App\Helper\Response;
use Closure;
use Illuminate\Http\Request;
use App\Helper\Validation;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;

class CheckActiveUser
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
        $user = $request->user();
        if(!$user) {
            return Response::responseJson(false, 'Bạn cần đăng nhập.');
        }
        $tokens = $user->tokens();
        if(!$tokens) {
            return Response::responseJson(false, 'Bạn cần đăng nhập.');
        }
        $current_access_token = $user->currentAccessToken();
        if(!$current_access_token) {
            return Response::responseJson(false, 'Bạn cần đăng nhập.');
        }
        if($user->status != 1) {
            $tokens->where('id', $current_access_token->id)->delete();

            return Response::responseJson(false, 'Đã có lỗi xảy ra.');
        }

        return $next($request);
    }
}
