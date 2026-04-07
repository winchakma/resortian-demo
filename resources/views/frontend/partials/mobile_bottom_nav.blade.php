<nav class="mobile-bottom-nav">
    <ul class="bottom-nav-list">
        <li class="bottom-nav-item">
            <a href="{{ route('index') }}" class="bottom-nav-link {{ request()->routeIs('index') ? 'active' : '' }}">
                <i class="fas fa-home"></i>
                <span>{{ __('Home') }}</span>
            </a>
        </li>
        <li class="bottom-nav-item">
            <a href="{{ route('rooms') }}" class="bottom-nav-link {{ request()->routeIs('rooms') ? 'active' : '' }}">
                <i class="fas fa-bed"></i>
                <span>{{ __('Rooms') }}</span>
            </a>
        </li>
        <li class="bottom-nav-item">
            <a href="{{ route('user.room_bookings') }}" class="bottom-nav-link {{ request()->routeIs('user.room_bookings') ? 'active' : '' }}">
                <i class="fas fa-calendar-check"></i>
                <span>{{ __('Bookings') }}</span>
            </a>
        </li>
        <li class="bottom-nav-item">
            @auth('web')
                <a href="{{ route('user.dashboard') }}" class="bottom-nav-link {{ request()->routeIs('user.dashboard') ? 'active' : '' }}">
                    <i class="fas fa-user"></i>
                    <span>{{ __('Account') }}</span>
                </a>
            @else
                <a href="{{ route('user.login') }}" class="bottom-nav-link">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>{{ __('Login') }}</span>
                </a>
            @endauth
        </li>
    </ul>
</nav>
