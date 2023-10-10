@php
    $auth = auth()->guard('admin')->user();
@endphp
<ul class="metismenu" id="menu">
    <li>
        <a class="" href="{{ route("admin.dashboard") }}">
            <div class="parent-icon icon-color-5">
                <i class='bx bxs-home'></i>
            </div>
            <div class="menu-title">Trang chủ</div>
        </a>
    </li>
    @if ($auth->hasRoles('indexAdmin') || $auth->hasRoles('indexRole'))
        <li>
            <a class="has-arrow" href="javascript:;">
                <div class="parent-icon icon-color-5">
                    <i class='bx bxs-user' ></i>
                </div>
                <div class="menu-title">Quản trị viên</div>
            </a>
            <ul>
                @if (Auth::user()->can('index', \App\Models\Admin::class))
                    <li >
                        <a href="{{ route("admin.index") }}">
                            <div class="ps-4 menu-title">Danh sách</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Role::class))
                    <li>
                        <a href="{{ route("role.index") }}">
                            <div class="ps-4 menu-title">Vai trò</div>
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif
    @if ($auth->hasRoles('indexProduct') ||  $auth->hasRoles('indexCoupon') ||  $auth->hasRoles('indexProductType'))
        <li>
            <a class="has-arrow" href="javascript:;">
                <div class="parent-icon icon-color-5">
                    <i class='bx bxs-cart' ></i>
                </div>
                <div class="menu-title">Sản phẩm</div>
            </a>
            <ul>
                @if (Auth::user()->can('index', \App\Models\Product::class))
                    <li>
                        <a href="{{ route('product.index') }}">
                            <div class="ps-4 menu-title">Danh sách</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Receip::class))
                    <li>
                        <a href="">
                            <div class="ps-4 menu-title">Hóa đơn</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\ProductType::class))
                    <li>
                        <a href="{{ route("productType.index") }}">
                            <div class="ps-4 menu-title">Loại sản phẩm</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Coupon::class))
                    <li>
                        <a href="{{ route("coupon.index") }}">
                            <div class="ps-4 menu-title">Mã giảm giá</div>
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif
</ul>