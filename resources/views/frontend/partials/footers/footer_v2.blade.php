<footer class="footer-area bg-img z-1 lazyloaded" data-bg-image="assets/images/footer-bg-2.jpg"
  style="background-image: url(&quot;assets/images/footer-bg-2.jpg&quot;); background-size: cover; background-position: center center; display: block;">
  <div class="overlay opacity-85"></div>
  @if ($sections?->top_footer_section == 1)
    <div class="footer-top pt-100 pb-70">
      <div class="container">
        <div class="row">
          <div class="col-lg-4 col-md-4 col-sm-12">
            <div class="footer-widget aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
              <div class="navbar-brand">
                @if (!is_null($websiteInfo->footer_logo))
                  <a href="{{ route('index') }}">
                    <img src="{{ asset('assets/img/' . $websiteInfo->footer_logo) }}" alt=" footer Logo">
                  </a>
                @endif
              </div>
              @if (!is_null($footerInfo))
                <p>{{ $footerInfo->about_company }}</p>
              @endif


            </div>
          </div>

          <div class="col-lg-4 col-md-4 col-sm-6">
            <div class="footer-widget aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
              <h5>{{ __('Quick Links') }}</h5>
              @if (count($quickLinkInfos) == 0)
                <h5 class="text-white">{{ __('No Quick Link Found!') }}</h5>
              @else
                <ul class="footer-links">
                  @foreach ($quickLinkInfos as $quickLinkInfo)
                    <li><a href="{{ $quickLinkInfo->url }}">{{ $quickLinkInfo->title }}</a></li>
                  @endforeach
                </ul>
              @endif
            </div>
          </div>


          <div class="col-lg-4 col-md-4 col-sm-6">
            <div class="footer-widget aos-init aos-animate" data-aos="fade-up" data-aos-delay="400">
              <h5>{{ __('Recent Blogs') }}</h5>
              @if (count($footerBlogInfos) == 0)
                <h5 class="text-white">{{ __('No Recent Blog Found!') }}</h5>
              @else
                <ul class="footer-links">
                  @foreach ($footerBlogInfos as $footerBlogInfo)
                    <li>
                      <h5 class="mb-1 ">
                        <a class="text-white"
                          href="{{ route('blog_details', ['id' => $footerBlogInfo->blog_id, 'slug' => $footerBlogInfo->slug]) }}">
                          {{ strlen($footerBlogInfo->title) > 40 ? mb_substr($footerBlogInfo->title, 0, 40, 'UTF-8') . '...' : $footerBlogInfo->title }}
                        </a>
                      </h5>
                      <span>{{ date_format($footerBlogInfo->blog->created_at, 'F d, Y') }}</span>
                    </li>
                  @endforeach
                </ul>
              @endif
            </div>
          </div>

        </div>
      </div>
    </div>
  @endif
  @if ($sections?->copyright_section == 1)
    <div class="copy-right-area border-top">
      <div class="container">
        <div class="copy-right-content">
          <div class="social-link mb-20">
            @if ($socialLinkInfos->count() > 0)
              @foreach ($socialLinkInfos as $socialLinkInfo)
                <a class="rounded-pill" href="{{ $socialLinkInfo->url }}"><i
                    class="{{ $socialLinkInfo->icon }}"></i></a>
              @endforeach
            @else
              <h5 class="text-white">{{ __('No Social Link Found!') }}</h5>
            @endif

          </div>
          @if ($sections?->copyright_section == 1)
            <div>
              @if (!is_null($footerInfo))
                {!! replaceBaseUrl($footerInfo->copyright_text, 'summernote') !!}
              @endif
            </div>
          @endif
        </div>
      </div>
    </div>
  @endif
  </div>
</footer>
