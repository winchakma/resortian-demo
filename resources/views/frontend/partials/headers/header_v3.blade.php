    <!-- Start mobile menu -->
    <div class="mobile-menu">
      <div class="container">
        <div class="mobile-menu-wrapper"></div>
      </div>
    </div>
    <!-- End mobile menu -->

    <div class="main-responsive-nav">
      <div class="container">
        <!-- Mobile Logo -->
        <div class="logo">
          <a href="{{ route('index') }}">
            <img src="{{ asset('assets/img/' . $websiteInfo->logo) }}" alt="logo" width="64%">
          </a>
        </div>
        <!-- Menu toggle button -->
        <button class="menu-toggler" type="button">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <div class="container">
      <div class="row g-0">
        <div class="col-xl-2 d-none d-xl-block">
          <!-- Logo -->
          <div class="logo d-none d-xl-flex align-items-center bg-primary h-100 ">
            <a class="navbar-brand" href="{{ route('index') }}" target="_self" title="Link">
              <img src="{{ asset('assets/img/' . $websiteInfo->logo) }}" alt="Logo">
            </a>
          </div>
        </div>
        <div class="col-xl-10">
          <div class="header-top pt-2 pb-2 pb-xl-0">
            <div class="row align-items-center">
              <div class="col-sm-6 col-md-7 col-lg-6">
                <div class="header-left mt-2">
                  <ul class="list-unstyled d-flex align-items-center gap-3">
                    @if (!is_null($websiteInfo->address))
                      <li class="icon-start border-end pe-3">
                        <a target="_self" title="{{ $websiteInfo->address }}">
                          {{ $websiteInfo->address }}
                        </a>
                      </li>
                    @endif
                    @if (!is_null($websiteInfo->support_contact))
                      <li class="icon-start">
                        <a href="tel:{{ $websiteInfo->support_contact }}" target="_self">
                          <i class="fal fa-user-headset"></i>{{ $websiteInfo->support_contact }}
                        </a>
                      </li>
                    @endif

                  </ul>
                </div>
              </div>
              <div
                class="col-sm-6 col-md-5 col-lg-6 {{ $currentLanguageInfo->direction == 1 ? 'text-sm-start' : 'text-sm-end' }}">
                <div class="header-right mb-2">
                  <div class="social-link size-md">
                    @foreach ($socialLinkInfos as $socialLinkInfo)
                      <a class="rounded-pill" href="{{ $socialLinkInfo->url }}" target="_blank" t><i
                          class="{{ $socialLinkInfo->icon }}"></i></a>
                    @endforeach
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="header-bottom">
            <div class="main-navbar">
              <nav class="navbar navbar-expand-lg">
                <!-- Navigation items -->
                @php
                  $links = json_decode($menus, true);
                @endphp
                <div class="collapse navbar-collapse">
                  <ul id="mainMenu" class="navbar-nav mobile-item">
                    @foreach ($links as $link)
                      @php
                        $href = getHref($link, $currentLanguageInfo->id);
                      @endphp

                      @if (!array_key_exists('children', $link))
                        {{-- - Level1 links which doesn't have dropdown menus - --}}
                        <li class="nav-item"><a href="{{ $href }}" target="{{ $link['target'] }}"
                            class="nav-link">{{ $link['text'] }}</a></li>
                      @else
                        <li class="nav-item">
                          {{-- - Level1 links which has dropdown menus - --}}
                          <a href="{{ $href }}" target="{{ $link['target'] }}"
                            class="nav-link toggle">{{ $link['text'] }}</a>

                          <ul class="menu-dropdown">
                            {{-- START: 2nd level links --}}
                            @foreach ($link['children'] as $level2)
                              @php
                                $l2Href = getHref($level2, $currentLanguageInfo->id);
                              @endphp

                              <li @if (array_key_exists('children', $level2)) class="nav-item" @endif>
                                <a href="{{ $l2Href }}" target="{{ $level2['target'] }}"
                                  class="nav-link">{{ $level2['text'] }}</a>

                                @if (array_key_exists('children', $level2))
                                  <ul class="menu-dropdown">
                                    @foreach ($level2['children'] as $level3)
                                      @php
                                        $l3Href = getHref($level3, $currentLanguageInfo->id);
                                      @endphp
                                      <li class="nav-item"><a href="{{ $l3Href }}"
                                          target="{{ $level3['target'] }}" class="nav-link">{{ $level3['text'] }}</a>
                                      </li>
                                    @endforeach
                                  </ul>
                                @endif
                              </li>
                            @endforeach
                            {{-- END: 2nd level links --}}
                          </ul>

                        </li>
                      @endif
                    @endforeach
                  </ul>
                </div>
                <div class="more-option mobile-item">
                  <div class="item">
                    <form action="{{ route('change_language') }}" method="GET">
                      <div class="language">
                        <select class="header-select" name="lang_code" onchange="this.form.submit()">
                          @foreach ($allLanguageInfos as $languageInfo)
                            <option value="{{ $languageInfo->code }}"
                              {{ $languageInfo->code == $currentLanguageInfo->code ? 'selected' : '' }}>
                              {{ $languageInfo->name }}
                            </option>
                          @endforeach
                        </select>
                      </div>
                    </form>
                  </div>
                  <div class="item">
                    <div class="dropdown">
                      <button type="button" class="btn btn-sm btn-primary dropdown-toggle"
                        data-bs-toggle="dropdown">{{ __('Customer') }}</button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        @guest('web')
                          <a class="dropdown-item" href="{{ route('user.login') }}">{{ __('Login') }}</a>
                          <a class="dropdown-item" href="{{ route('user.signup') }}">{{ __('Signup') }}</a>
                        @endguest
                        @auth('web')
                          <a class="dropdown-item" href="{{ route('user.dashboard') }}">{{ __('Dashboard') }}</a>
                          <a class="dropdown-item" href="{{ route('user.logout') }}">{{ __('Logout') }}</a>
                        @endauth
                      </div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="dropdown">
                      <button type="button"
                        class="btn btn-sm btn-primary dropdown-toggle {{ $currentLanguageInfo->direction == 0 ? 'mr-1' : 'ml-1' }}"
                        data-bs-toggle="dropdown">{{ __('Vendor') }}</button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        @guest('vendor')
                          <a class="dropdown-item" href="{{ route('vendor.login') }}">{{ __('Login') }}</a>
                          <a class="dropdown-item" href="{{ route('vendor.signup') }}">{{ __('Signup') }}</a>
                        @endguest
                        @auth('vendor')
                          <a class="dropdown-item" href="{{ route('vendor.dashboard') }}">{{ __('Dashboard') }}</a>
                          <a class="dropdown-item" href="{{ route('vendor.logout') }}">{{ __('Logout') }}</a>
                        @endauth
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
