@php
    $auth = auth()->guard('admin')->user();
@endphp
<ul class="metismenu" id="menu">
    <li>
        <a class="" href="{{ route("admin.dashboard") }}">
            <div class="parent-icon icon-color-5">
                <i class='text-white bx bxs-home'></i>
            </div>
            <div class="menu-title">Trang chủ</div>
        </a>
    </li>
    @if ($auth->hasRoles('indexAdmin') || $auth->hasRoles('indexRole'))
        <li>
            <a class="has-arrow" href="javascript:;">
                <div class="parent-icon icon-color-5">
                    <i class='text-white bx bxs-user' ></i>
                </div>
                <div class="menu-title">Quản trị viên</div>
            </a>
            <ul>
                @if (Auth::user()->can('index', \App\Models\Admin::class))
                    <li >
                        <a href="{{ route("admin.index") }}">
                            <div class="ps-4 py-1 menu-title">Danh sách quản trị viên</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Role::class))
                    <li>
                        <a href="{{ route("role.index") }}">
                            <div class="ps-4 py-1 menu-title">Vai trò</div>
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif
    @if ($auth->hasRoles('indexProduct') ||  $auth->hasRoles('indexCoupon') ||  $auth->hasRoles('indexProductType') ||  $auth->hasRoles('indexBranch'))
        <li>
            <a class="has-arrow" href="javascript:;">
                <div class="parent-icon icon-color-5">
                    <i class='text-white bx bxs-package' ></i>
                </div>
                <div class="menu-title">Sản phẩm</div>
            </a>
            <ul>
                @if (Auth::user()->can('index', \App\Models\Product::class))
                    <li>
                        <a href="{{ route('product.index') }}">
                            <div class="ps-4 py-1 menu-title">Danh sách sản phẩm</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Receip::class))
                    <li>
                        <a href="">
                            <div class="ps-4 py-1 menu-title">Hóa đơn</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\ProductType::class))
                    <li>
                        <a href="{{ route("productType.index") }}">
                            <div class="ps-4 py-1 menu-title">Loại sản phẩm</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Branch::class))
                    <li>
                        <a href="{{ route("branch.index") }}">
                            <div class="ps-4 py-1 menu-title">Thương hiệu</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Supplier::class))
                    <li>
                        <a href="{{ route("supplier.index") }}">
                            <div class="ps-4 py-1 menu-title">Nhà cung cấp</div>
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif
    @if ($auth->hasRoles('indexCoupon'))
        <li>
            <a class="has-arrow" href="javascript:;">
                <div class="parent-icon icon-color-5">
                    <i class='text-white bx bxs-cart' ></i>
                </div>
                <div class="menu-title">Bán hàng</div>
            </a>
            <ul>
                @if (Auth::user()->can('index', \App\Models\Receipt::class))
                    <li>
                        <a href="{{ route("receipt.index") }}">
                            <div class="ps-4 py-1 menu-title">Hóa đơn</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Order::class))
                    <li>
                        <a href="{{ route("order.index") }}">
                            <div class="ps-4 py-1 menu-title">Đơn hàng</div>
                        </a>
                    </li>
                @endif
                @if (Auth::user()->can('index', \App\Models\Coupon::class))
                    <li>
                        <a href="{{ route("coupon.index") }}">
                            <div class="ps-4 py-1 menu-title">Mã giảm giá</div>
                        </a>
                    </li>
                @endif
            </ul>
        </li>
    @endif
</ul>