<?php

use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('/admin')->middleware(['auth:admin', 'lfm.path'])->group(function () {
  Route::get('/rtlcheck/{langid}', 'Admin\LanguageController@rtlcheck')->name('admin.rtlcheck');

  // admin redirect to dashboard route
  Route::get('/change-theme', 'Admin\AdminController@changeTheme')->name('admin.theme.change');

  Route::get('/monthly-profit', 'Admin\AdminController@monthly_profit')->name('admin.monthly_profit');
  Route::get('/monthly-earning', 'Admin\AdminController@monthly_earning')->name('admin.monthly_earning');

  // admin redirect to dashboard route
  Route::get('/dashboard', 'Admin\AdminController@redirectToDashboard')->name('admin.dashboard');

  // Summernote image upload
  Route::post('/summernote/upload', 'Admin\SummernoteController@upload')->name('admin.summernote.upload');

  // admin profile settings route start
  Route::get('/edit_profile', 'Admin\AdminController@editProfile')->name('admin.edit_profile');

  Route::post('/update_profile', 'Admin\AdminController@updateProfile')->name('admin.update_profile');

  Route::get('/change_password', 'Admin\AdminController@changePassword')->name('admin.change_password');

  Route::post('/update_password', 'Admin\AdminController@updatePassword')->name('admin.update_password');
  // admin profile settings route end


  // admin logout attempt route
  Route::get('/logout', 'Admin\AdminController@logout')->name('admin.logout');


  // theme version route
  Route::group(['middleware' => 'checkpermission:Theme & Home'], function () {
    Route::get('/theme/version', 'Admin\BasicSettings\BasicSettingsController@themeVersion')->name('admin.theme.version');

    Route::post('/theme/update_version', 'Admin\BasicSettings\BasicSettingsController@updateThemeVersion')->name('admin.theme.update_version');
  });


  Route::group(['middleware' => 'checkpermission:Menu Builder'], function () {
    // Menus Builder Management Routes
    Route::get('/menu-builder', 'App\Http\Controllers\Admin\MenuBuilderController@index')->name('admin.menu_builder.index');
    Route::post('/menu-builder/update', 'App\Http\Controllers\Admin\MenuBuilderController@update')->name('admin.menu_builder.update');
  });


  // language management route start
  Route::group(['middleware' => 'checkpermission:Language Management'], function () {
    Route::get('/language_management', 'Admin\LanguageController@index')->name('admin.languages');

    Route::post('/language_management/store_language', 'Admin\LanguageController@store')->name('admin.languages.store_language');

    Route::post('/language_management/make_default_language/{id}', 'Admin\LanguageController@makeDefault')->name('admin.languages.make_default_language');

    Route::post('/language_management/update_language', 'Admin\LanguageController@update')->name('admin.languages.update_language');

    Route::get('/language_management/edit_keyword/{id}', 'Admin\LanguageController@editKeyword')->name('admin.languages.edit_keyword');

    Route::post('/language_management/update_keyword/{id}', 'Admin\LanguageController@updateKeyword')->name('admin.languages.update_keyword');

    Route::post('/language_management/delete_language/{id}', 'Admin\LanguageController@destroy')->name('admin.languages.delete_language');

    Route::post('add-keyword', 'Admin\LanguageController@addKeyword')->name('admin.language_management.add_keyword');
  });
  // language management route end


  // payment gateways management route start
  Route::prefix('payment_gateways')->group(function () {
    Route::get('/online_gateways', 'Admin\PaymentGateway\OnlineGatewayController@onlineGateways')->name('admin.payment_gateways.online_gateways');

    Route::post('/update_paypal_info', 'Admin\PaymentGateway\OnlineGatewayController@updatePayPalInfo')->name('admin.payment_gateways.update_paypal_info');

    Route::post('/update_stripe_info', 'Admin\PaymentGateway\OnlineGatewayController@updateStripeInfo')->name('admin.payment_gateways.update_stripe_info');

    Route::post('/update_instamojo_info', 'Admin\PaymentGateway\OnlineGatewayController@updateInstamojoInfo')->name('admin.payment_gateways.update_instamojo_info');

    Route::post('/update_paystack_info', 'Admin\PaymentGateway\OnlineGatewayController@updatePaystackInfo')->name('admin.payment_gateways.update_paystack_info');

    Route::post('/update_flutterwave_info', 'Admin\PaymentGateway\OnlineGatewayController@updateFlutterwaveInfo')->name('admin.payment_gateways.update_flutterwave_info');

    Route::post('/update_razorpay_info', 'Admin\PaymentGateway\OnlineGatewayController@updateRazorpayInfo')->name('admin.payment_gateways.update_razorpay_info');

    Route::post('/update_mercadopago_info', 'Admin\PaymentGateway\OnlineGatewayController@updateMercadoPagoInfo')->name('admin.payment_gateways.update_mercadopago_info');

    Route::post('/update_mollie_info', 'Admin\PaymentGateway\OnlineGatewayController@updateMollieInfo')->name('admin.payment_gateways.update_mollie_info');

    Route::post('/update_paytm_info', 'Admin\PaymentGateway\OnlineGatewayController@updatePaytmInfo')->name('admin.payment_gateways.update_paytm_info');

    Route::post('/update-authorizenet-info', 'Admin\PaymentGateway\OnlineGatewayController@updateAuthorizeNetInfo')->name('admin.payment_gateways.update_authorizenet_info');

    Route::post('/update-midtrans-info', 'Admin\PaymentGateway\OnlineGatewayController@updateMidtransInfo')->name('admin.payment_gateways.update_midtrans_info');

    Route::post('/update-iyzico-info', 'Admin\PaymentGateway\OnlineGatewayController@updateIyzicoInfo')->name('admin.payment_gateways.update_iyzico_info');

    Route::post('/update-paytabs-info', 'Admin\PaymentGateway\OnlineGatewayController@updatePaytabsInfo')->name('admin.payment_gateways.update_paytabs_info');

    Route::post('/update-toyyibpay-info', 'Admin\PaymentGateway\OnlineGatewayController@updateToyyibpayInfo')->name('admin.payment_gateways.update_toyyibpay_info');

    Route::post('/update-phonepe-info', 'Admin\PaymentGateway\OnlineGatewayController@updatePhonepeInfo')->name('admin.payment_gateways.update_phonepe_info');
    Route::post('/update-yoco-info', 'Admin\PaymentGateway\OnlineGatewayController@updateYocoInfo')->name('admin.payment_gateways.update_yoco_info');

    Route::post('/update-myfatoorah-info', 'Admin\PaymentGateway\OnlineGatewayController@updateMyFatoorahInfo')->name('admin.payment_gateways.update_myfatoorah_info');

    Route::post('/update-zendit-info', 'Admin\PaymentGateway\OnlineGatewayController@updateXenditInfo')->name('admin.payment_gateways.update_xendit_info');
    Route::post('/update-perfect_money-info', 'Admin\PaymentGateway\OnlineGatewayController@updatePerfectMoneyInfo')->name('admin.payment_gateways.update_perfect_money_info');


    Route::get('/offline_gateways', 'Admin\PaymentGateway\OfflineGatewayController@index')->name('admin.payment_gateways.offline_gateways');

    Route::post('/store_offline_gateway', 'Admin\PaymentGateway\OfflineGatewayController@store')->name('admin.payment_gateways.store_offline_gateway');

    Route::post('/update_room_booking_status', 'Admin\PaymentGateway\OfflineGatewayController@updateRoomBookingStatus')->name('admin.payment_gateways.update_room_booking_status');

    Route::post('/update_offline_gateway', 'Admin\PaymentGateway\OfflineGatewayController@update')->name('admin.payment_gateways.update_offline_gateway');

    Route::post('/delete_offline_gateway', 'Admin\PaymentGateway\OfflineGatewayController@delete')->name('admin.payment_gateways.delete_offline_gateway');
  })->middleware(['middleware' => 'checkpermission:Payment Gateways']);
  // payment gateways management route end


  Route::group(['middleware' => 'checkpermission:Settings'], function () {

    //general settings routes are goes here
    Route::get('/general-settings', 'Admin\BasicSettings\BasicSettingsController@general_settings')->name('admin.basic_settings.general_settings');

    Route::post('/update-general-settings', 'Admin\BasicSettings\BasicSettingsController@update_general_setting')->name('admin.basic_settings.general_settings.update');


    // basic settings mail route start
    Route::get('/basic_settings/mail_from_admin', 'Admin\BasicSettings\BasicSettingsController@mailFromAdmin')->name('admin.basic_settings.mail_from_admin');

    Route::post('/basic_settings/update_mail_from_admin', 'Admin\BasicSettings\BasicSettingsController@updateMailFromAdmin')->name('admin.basic_settings.update_mail_from_admin');

    Route::get('/basic_settings/mail_to_admin', 'Admin\BasicSettings\BasicSettingsController@mailToAdmin')->name('admin.basic_settings.mail_to_admin');

    Route::post('/basic_settings/update_mail_to_admin', 'Admin\BasicSettings\BasicSettingsController@updateMailToAdmin')->name('admin.basic_settings.update_mail_to_admin');

    // Admin File Manager Routes
    Route::get('/file-manager', 'Admin\BasicSettings\BasicSettingsController@fileManager')->name('admin.file-manager');

    Route::get('/basic_settings/mail_templates', 'Admin\BasicSettings\MailTemplateController@mailTemplates')->name('admin.basic_settings.mail_templates');

    Route::get('/basic_settings/edit_mail_template/{id}', 'Admin\BasicSettings\MailTemplateController@editMailTemplate')->name('admin.basic_settings.edit_mail_template');

    Route::post('/basic_settings/update_mail_template/{id}', 'Admin\BasicSettings\MailTemplateController@updateMailTemplate')->name('admin.basic_settings.update_mail_template');
    // basic settings mail route end

    // basic settings social-links route start
    Route::get('/basic_settings/social_links', 'Admin\BasicSettings\SocialLinkController@socialLinks')->name('admin.basic_settings.social_links');

    Route::post('/basic_settings/store_social_link', 'Admin\BasicSettings\SocialLinkController@storeSocialLink')->name('admin.basic_settings.store_social_link');

    Route::get('/basic_settings/edit_social_link/{id}', 'Admin\BasicSettings\SocialLinkController@editSocialLink')->name('admin.basic_settings.edit_social_link');

    Route::post('/basic_settings/update_social_link', 'Admin\BasicSettings\SocialLinkController@updateSocialLink')->name('admin.basic_settings.update_social_link');

    Route::post('/basic_settings/delete_social_link', 'Admin\BasicSettings\SocialLinkController@deleteSocialLink')->name('admin.basic_settings.delete_social_link');
    // basic settings social-links route end

    // basic settings breadcrumb route
    Route::get('/basic_settings/breadcrumb', 'Admin\BasicSettings\BasicSettingsController@breadcrumb')->name('admin.basic_settings.breadcrumb');

    Route::post('/basic_settings/update_breadcrumb', 'Admin\BasicSettings\BasicSettingsController@updateBreadcrumb')->name('admin.basic_settings.update_breadcrumb');

    // basic settings page-headings route
    Route::get('/basic_settings/page_headings', 'Admin\BasicSettings\PageHeadingController@pageHeadings')->name('admin.basic_settings.page_headings');

    Route::post('/basic_settings/update_page_headings', 'Admin\BasicSettings\PageHeadingController@updatePageHeadings')->name('admin.basic_settings.update_page_headings');

    // basic settings scripts route
    Route::get('/basic_settings/scripts', 'Admin\BasicSettings\BasicSettingsController@scripts')->name('admin.basic_settings.scripts');

    Route::post('/basic_settings/update_script', 'Admin\BasicSettings\BasicSettingsController@updateScript')->name('admin.basic_settings.update_script');

    // basic settings seo route
    Route::get('/basic_settings/seo', 'Admin\BasicSettings\SEOController@seo')->name('admin.basic_settings.seo');

    Route::post('/basic_settings/update_seo_informations', 'Admin\BasicSettings\SEOController@updateSEO')->name('admin.basic_settings.update_seo_informations');

    // basic settings maintenance-mode route
    Route::get('/basic_settings/maintenance_mode', 'Admin\BasicSettings\BasicSettingsController@maintenanceMode')->name('admin.basic_settings.maintenance_mode');

    Route::post('/basic_settings/update_maintenance', 'Admin\BasicSettings\BasicSettingsController@updateMaintenance')->name('admin.basic_settings.update_maintenance');

    // basic settings cookie-alert route
    Route::get('/basic_settings/cookie_alert', 'Admin\BasicSettings\CookieAlertController@cookieAlert')->name('admin.basic_settings.cookie_alert');

    Route::post('/basic_settings/update_cookie_alert/{language}', 'Admin\BasicSettings\CookieAlertController@updateCookieAlert')->name('admin.basic_settings.update_cookie_alert');

    // basic settings footer-logo route
    Route::get('/basic_settings/footer_logo', 'Admin\BasicSettings\BasicSettingsController@footerLogo')->name('admin.basic_settings.footer_logo');

    Route::post('/basic_settings/update_footer_logo', 'Admin\BasicSettings\BasicSettingsController@updateFooterLogo')->name('admin.basic_settings.update_footer_logo');
  });


  Route::group(['middleware' => 'checkpermission:Home Page Sections'], function () {
    // home page hero-section static-version route
    Route::get('/home_page/hero/static_version', 'Admin\HomePage\HeroStaticController@staticVersion')->name('admin.home_page.hero.static_version');

    Route::post('/home_page/hero/static_version/update_static_info/{language}', 'Admin\HomePage\HeroStaticController@updateStaticInfo')->name('admin.home_page.hero.update_static_info');

    // home page hero-section slider-version route start
    Route::get('/home_page/hero/slider_version', 'Admin\HomePage\HeroSliderController@sliderVersion')->name('admin.home_page.hero.slider_version');

    Route::get('/home_page/hero/slider_version/create_slider', 'Admin\HomePage\HeroSliderController@createSlider')->name('admin.home_page.hero.create_slider');

    Route::post('/home_page/hero/slider_version/store_slider_info', 'Admin\HomePage\HeroSliderController@storeSliderInfo')->name('admin.home_page.hero.store_slider_info');

    Route::get('/home_page/hero/slider_version/edit_slider/{id}', 'Admin\HomePage\HeroSliderController@editSlider')->name('admin.home_page.hero.edit_slider');

    Route::put('/home_page/hero/slider_version/update_slider_info/{id}', 'Admin\HomePage\HeroSliderController@updateSliderInfo')->name('admin.home_page.hero.update_slider_info');

    Route::post('/home_page/hero/slider_version/delete_slider', 'Admin\HomePage\HeroSliderController@deleteSlider')->name('admin.home_page.hero.delete_slider');
    // home page hero-section slider-version route end

    // home page hero-section video-version route
    Route::get('/home_page/hero/video_version', 'Admin\HomePage\HeroVideoController@videoVersion')->name('admin.home_page.hero.video_version');

    Route::post('/home_page/hero/video_version/update_video_info', 'Admin\HomePage\HeroVideoController@updateVideoInfo')->name('admin.home_page.hero.update_video_info');

    // home page intro-section route start
    Route::get('/home_page/intro_section', 'Admin\HomePage\IntroSectionController@introSection')->name('admin.home_page.intro_section');

    Route::post('/home_page/update_intro_section/{language}', 'Admin\HomePage\IntroSectionController@updateIntroInfo')->name('admin.home_page.update_intro_section');

    Route::get('/home_page/intro_section/create_count_info', 'Admin\HomePage\IntroSectionController@createCountInfo')->name('admin.home_page.intro_section.create_count_info');

    Route::post('/home_page/intro_section/store_count_info', 'Admin\HomePage\IntroSectionController@storeCountInfo')->name('admin.home_page.intro_section.store_count_info');

    Route::get('/home_page/intro_section/edit_count_info/{id}', 'Admin\HomePage\IntroSectionController@editCountInfo')->name('admin.home_page.intro_section.edit_count_info');

    Route::put('/home_page/intro_section/update_count_info/{id}', 'Admin\HomePage\IntroSectionController@updateCountInfo')->name('admin.home_page.intro_section.update_count_info');

    Route::post('/home_page/intro_section/delete_count_info', 'Admin\HomePage\IntroSectionController@deleteCountInfo')->name('admin.home_page.intro_section.delete_count_info');
    // home page intro-section route end

    // room category section
    Route::get('/home_page/room_category_section', 'Admin\HomePage\SectionHeadingController@roomCategorySection')->name('admin.home_page.room_category_section');

    Route::post('/home_page/update/room_category_section/{language}', 'Admin\HomePage\SectionHeadingController@updateRoomCategorySection')->name('admin.home_page.update_room_category_section');

    // home page section-heading route start
    Route::get('/home_page/room_section', 'Admin\HomePage\SectionHeadingController@roomSection')->name('admin.home_page.room_section');

    Route::post('/home_page/update_room_section/{language}', 'Admin\HomePage\SectionHeadingController@updateRoomSection')->name('admin.home_page.update_room_section');

    Route::get('/home_page/service_section', 'Admin\HomePage\SectionHeadingController@serviceSection')->name('admin.home_page.service_section');

    Route::post('/home_page/update_service_section/{language}', 'Admin\HomePage\SectionHeadingController@updateServiceSection')->name('admin.home_page.update_service_section');

    Route::get('/home_page/booking_section', 'Admin\HomePage\SectionHeadingController@bookingSection')->name('admin.home_page.booking_section');

    Route::post('/home_page/update_booking_section/{language}', 'Admin\HomePage\SectionHeadingController@updateBookingSection')->name('admin.home_page.update_booking_section');

    Route::get('/home_page/package_section', 'Admin\HomePage\SectionHeadingController@packageSection')->name('admin.home_page.package_section');

    Route::post('/home_page/update_package_section/{language}', 'Admin\HomePage\SectionHeadingController@updatePackageSection')->name('admin.home_page.update_package_section');

    Route::get('/home_page/facility_section', 'Admin\HomePage\SectionHeadingController@facilitySection')->name('admin.home_page.facility_section');

    Route::post('/home_page/update_facility_section/{language}', 'Admin\HomePage\SectionHeadingController@updateFacilitySection')->name('admin.home_page.update_facility_section');
    // home page section-heading route end

    // home page facility-section->facilities route start
    Route::get('/home_page/facility_section/create_facility', 'Admin\HomePage\FacilityController@createFacility')->name('admin.home_page.facility_section.create_facility');

    Route::post('/home_page/facility_section/store_facility/{language}', 'Admin\HomePage\FacilityController@storeFacility')->name('admin.home_page.facility_section.store_facility');

    Route::get('/home_page/facility_section/edit_facility/{id}', 'Admin\HomePage\FacilityController@editFacility')->name('admin.home_page.facility_section.edit_facility');

    Route::post('/home_page/facility_section/update_facility/{id}', 'Admin\HomePage\FacilityController@updateFacility')->name('admin.home_page.facility_section.update_facility');

    Route::post('/home_page/facility_section/delete_facility', 'Admin\HomePage\FacilityController@deleteFacility')->name('admin.home_page.facility_section.delete_facility');
    // home page facility-section->facilities route end

    // home page section-heading route start
    Route::get('/home_page/testimonial_section', 'Admin\HomePage\SectionHeadingController@testimonialSection')->name('admin.home_page.testimonial_section');

    Route::post('/home_page/update_testimonial_section/{language}', 'Admin\HomePage\SectionHeadingController@updateTestimonialSection')->name('admin.home_page.update_testimonial_section');
    // home page section-heading route end

    // home page testimonial-section->testimonials route start
    Route::get('/home_page/testimonial_section/create_testimonial', 'Admin\HomePage\TestimonialController@createTestimonial')->name('admin.home_page.testimonial_section.create_testimonial');

    Route::post('/home_page/testimonial_section/store_testimonial', 'Admin\HomePage\TestimonialController@storeTestimonial')->name('admin.home_page.testimonial_section.store_testimonial');

    Route::get('/home_page/testimonial_section/edit_testimonial/{id}', 'Admin\HomePage\TestimonialController@editTestimonial')->name('admin.home_page.testimonial_section.edit_testimonial');

    Route::post('/home_page/testimonial_section/update_testimonial/{id}', 'Admin\HomePage\TestimonialController@updateTestimonial')->name('admin.home_page.testimonial_section.update_testimonial');

    Route::post('/home_page/testimonial_section/delete_testimonial', 'Admin\HomePage\TestimonialController@deleteTestimonial')->name('admin.home_page.testimonial_section.delete_testimonial');
    // home page testimonial-section->testimonials route end

    // home page brand-section route start
    Route::get('/home_page/brand_section', 'Admin\HomePage\BrandSectionController@brandSection')->name('admin.home_page.brand_section');

    Route::post('/home_page/brand_section/store_brand/{language}', 'Admin\HomePage\BrandSectionController@storeBrand')->name('admin.home_page.brand_section.store_brand');

    Route::post('/home_page/brand_section/update_brand', 'Admin\HomePage\BrandSectionController@updateBrand')->name('admin.home_page.brand_section.update_brand');

    Route::post('/home_page/brand_section/delete_brand', 'Admin\HomePage\BrandSectionController@deleteBrand')->name('admin.home_page.brand_section.delete_brand');
    // home page brand-section route end

    // home page section-heading route start
    Route::get('/home_page/faq_section', 'Admin\HomePage\SectionHeadingController@faqSection')->name('admin.home_page.faq_section');

    Route::post('/home_page/update_faq_section/{language}', 'Admin\HomePage\SectionHeadingController@updateFAQSection')->name('admin.home_page.update_faq_section');

    Route::get('/home_page/blog_section', 'Admin\HomePage\SectionHeadingController@blogSection')->name('admin.home_page.blog_section');

    Route::post('/home_page/update_blog_section/{language}', 'Admin\HomePage\SectionHeadingController@updateBlogSection')->name('admin.home_page.update_blog_section');


    // Admin Section Customization Routes
    Route::get('/sections', 'Admin\HomePage\SectionsController@sections')->name('admin.sections.index');
    Route::post('/sections/update', 'Admin\HomePage\SectionsController@updatesections')->name('admin.sections.update');
  });

  // rooms management route start
  Route::group(['prefix' => 'rooms-management', 'middleware' => 'checkpermission:Rooms Management'], function () {

    Route::prefix('settings')->group(function () {
      //ROOM SETTINGS
      Route::get('/preference', 'Admin\RoomController@preference')->name('admin.rooms_management.settings.preference');
      Route::post('/update-preference', 'Admin\RoomController@updatePreference')->name('admin.rooms_management.settings.update_preference');

      //COUPONS
      Route::prefix('coupons')->group(function () {
        Route::get('/', 'Admin\RoomController@coupons')->name('admin.rooms_management.coupons');
        Route::post('/store', 'Admin\RoomController@storeCoupon')->name('admin.rooms_management.store_coupon');
        Route::post('/update', 'Admin\RoomController@updateCoupon')->name('admin.rooms_management.update_coupon');
        Route::post('/delete/{id}', 'Admin\RoomController@destroyCoupon')->name('admin.rooms_management.delete_coupon');
      });
      //AMENITIES
      Route::prefix('amenities')->group(function () {
        Route::get('/', 'Admin\RoomController@amenities')->name('admin.rooms_management.amenities');

        Route::post('/store', 'Admin\RoomController@storeAmenity')->name('admin.rooms_management.store_amenity');

        Route::post('/update', 'Admin\RoomController@updateAmenity')->name('admin.rooms_management.update_amenity');

        Route::post('/delete', 'Admin\RoomController@deleteAmenity')->name('admin.rooms_management.delete_amenity');

        Route::post('/bulk_delete', 'Admin\RoomController@bulkDeleteAmenity')->name('admin.rooms_management.bulk_delete_amenity');
      });

      Route::prefix('paid-services')->group(function () {
        Route::get('/', 'Admin\RoomController@paidServices')->name('admin.rooms_management.paid_services');

        Route::post('/store', 'Admin\RoomController@storePaidServices')->name('admin.rooms_management.paid_service.store');

        Route::post('/update', 'Admin\RoomController@updatePaidServices')->name('admin.rooms_management.paid_service.update');

        Route::post('/delete', 'Admin\RoomController@deletePaidServices')->name('admin.rooms_management.paid_service.delete');

        Route::post('/bulk-delete', 'Admin\RoomController@bulkDeletePaidServices')->name('admin.rooms_management.paid_service.bulk_delete');
      });
    });



    Route::get('/categories', 'Admin\RoomController@categories')->name('admin.rooms_management.categories');
    Route::prefix('category')->group(function () {
      //sliders images
      Route::post('/images-store', 'Admin\RoomController@gallerystore')->name('admin.rooms_management.imagesstore');
      Route::post('/room-imagermv', 'Admin\RoomController@imagermv')->name('admin.rooms_management.imagermv');

      Route::post('/room-img-dbrmv', 'Admin\RoomController@imagedbrmv')->name('admin.rooms_management.imgdbrmv');
      Route::get('/room-images/{id}', 'Admin\RoomController@images')->name('admin.rooms_management.images');
      //sliders images end

      Route::get('/create', 'Admin\RoomController@createCategory')->name('admin.rooms_management.room_category.create');
      Route::post('/store', 'Admin\RoomController@storeCategory')->name('admin.rooms_management.room_category.store');

      Route::post('/update_featured_room', 'Admin\RoomController@updateFeaturedRoom')->name('admin.rooms_management.update_featured_room');

      Route::get('/edit/{id}', 'Admin\RoomController@editCategory')->name('admin.rooms_management.room_category.edit');
      Route::get('/slider_images/{id}', 'Admin\RoomController@getSliderImages');
      Route::post('/update_room/{id}', 'Admin\RoomController@updateCategory')->name('admin.rooms_management.room_category.update');

      Route::post('/delete_room', 'Admin\RoomController@deleteCategory')->name('admin.rooms_management.delete_room');
      Route::post('/bulk_delete_room', 'Admin\RoomController@bulkDeleteCategory')->name('admin.rooms_management.bulk_delete_room');
    });

    Route::prefix('rooms')->group(function () {

      Route::get('/', 'Admin\RoomController@rooms')->name('admin.rooms_management.rooms');

      Route::post('/store', 'Admin\RoomController@storeRoom')->name('admin.rooms_management.room.store');

      Route::post('/update', 'Admin\RoomController@updateRoom')->name('admin.rooms_management.room.update');

      Route::post('/delete', 'Admin\RoomController@deleteRoom')->name('admin.rooms_management.room.delete');

      Route::post('/bulk_delete', 'Admin\RoomController@bulkDeleteRoom')->name('admin.rooms_management.room.bulk_delete');
    });
  });
  // rooms management route end


  // Room Bookings Routes
  Route::prefix('admin-room-bookings')->middleware("checkpermission:Admin's Room Bookings")->group(function () {

    Route::get('/total-rooms', 'Admin\AdminRoomBookingController@totalRooms')
      ->name('admin.rooms_management.bookings.total_rooms');

    Route::get('/all', 'Admin\AdminRoomBookingController@index')->name('admin.room_bookings.all_bookings');
    Route::get('/approved', 'Admin\AdminRoomBookingController@index')->name('admin.room_bookings.approved_bookings');
    Route::get('/pending', 'Admin\AdminRoomBookingController@index')->name('admin.room_bookings.pending_bookings');
    Route::get('/rejected', 'Admin\AdminRoomBookingController@index')->name('admin.room_bookings.canceled_bookings');
    Route::get('/active', 'Admin\AdminRoomBookingController@index')->name('admin.room_bookings.active_bookings');
    Route::get('/todays-booked', 'Admin\AdminRoomBookingController@todaysBooked')->name('admin.room_bookings.todays_booked');

    Route::post('/update-payment-status', 'Admin\AdminRoomBookingController@updatePaymentStatus')->name('admin.room_bookings.update_payment_status');
    Route::post('/update-partial-amount', 'Admin\AdminRoomBookingController@updatePartialAmount')->name('admin.room_bookings.update_partial_amount');

    Route::post('/update-stay-status', 'Admin\AdminRoomBookingController@updateStayStatus')->name('admin.room_bookings.update_stay_status');

    Route::post('/update-booking-status', 'Admin\AdminRoomBookingController@updateBookingStatus')->name('admin.room_bookings.update_booking_status');
    Route::post('/booking-cancel-refund', 'Admin\AdminRoomBookingController@makeRefund')->name('admin.room_bookings.update_booking_cancel_refund');

    Route::prefix('refunds')->group(function () {
      Route::get('/', 'Admin\AdminRoomBookingController@refunds')->name('admin.room_bookings.refunds');
      Route::post('/update-refund-status', 'Admin\AdminRoomBookingController@updateRefundStatus')->name('admin.room_bookings.update_refund_status');
      Route::post('/delete-refund', 'Admin\AdminRoomBookingController@deleteRefund')->name('admin.room_bookings.refund.delete');
    });

    Route::get('/disputes', 'Admin\AdminRoomBookingController@disputes')->name('admin.room_bookings.disputes');
    Route::post('/update-refund-status', 'Admin\AdminRoomBookingController@updateRefundStatus')->name('admin.room_bookings.update_refund_status');

    Route::get('/edit/{id}', 'Admin\AdminRoomBookingController@editBooking')->name('admin.room_bookings.booking_edit');
    Route::post('/update', 'Admin\AdminRoomBookingController@updateBooking')->name('admin.room_bookings.update_booking');

    Route::get('/details/{id}', 'Admin\AdminRoomBookingController@bookingDetails')->name('admin.room_bookings.booking_details');

    Route::get('/paid-services/{id}', 'Admin\AdminRoomBookingController@paidServices')->name('admin.room_bookings.booking_paid_services');
    Route::post('/update-paid-service', 'Admin\AdminRoomBookingController@updatePaidServices')->name('admin.room_bookings.update_paid_service');
    Route::post('/update-paid-service-payment-status', 'Admin\AdminRoomBookingController@updatePaidServicesPaymentStatus')->name('admin.room_bookings.paid_service.update_payment_status');

    Route::post('/send-mail', 'Admin\AdminRoomBookingController@sendMail')->name('admin.room_bookings.send_mail');

    Route::post('/delete/{id}', 'Admin\AdminRoomBookingController@deleteBooking')->name('admin.room_bookings.delete_booking');

    Route::post('/bulk-delete', 'Admin\AdminRoomBookingController@bulkDeleteBooking')->name('admin.room_bookings.bulk_delete_booking');

    Route::get('/get-booked-dates', 'Admin\AdminRoomBookingController@bookedDates')->name('admin.room_bookings.get_booked_dates');

    Route::get('/booking-form', 'Admin\AdminRoomBookingController@bookingForm')->name('admin.room_bookings.booking_form');

    Route::post('/make-booking', 'Admin\AdminRoomBookingController@makeBooking')->name('admin.room_bookings.make_booking');


    // Check-ins Routes
    Route::prefix('check-ins')->group(function () {
      Route::get('/delayed', 'Admin\AdminRoomBookingController@checkIn')->name('admin.check_ins.delayed');
      Route::get('/upcoming', 'Admin\AdminRoomBookingController@checkIn')->name('admin.check_ins.upcoming');
    });

    // Check-ins Routes
    Route::prefix('check-outs')->group(function () {

      Route::get('/delayed', 'Admin\AdminRoomBookingController@checkOut')->name('admin.check_outs.delayed');
      Route::get('/upcoming', 'Admin\AdminRoomBookingController@checkOut')->name('admin.check_outs.upcoming');
    });
  });

  // Vendor's Room Bookings Routes
  Route::prefix('vendor-room-bookings')->middleware("checkpermission:Vendor's Room Bookings")->group(function () {

    Route::get('/total-rooms', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@totalRooms')
      ->name('admin.vendor_room_bookings.total_rooms');

    Route::get('/all', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@index')->name('admin.vendor_room_bookings.all_bookings');
    Route::get('/approved', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@index')->name('admin.vendor_room_bookings.approved_bookings');
    Route::get('/pending', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@index')->name('admin.vendor_room_bookings.pending_bookings');
    Route::get('/rejected', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@index')->name('admin.vendor_room_bookings.canceled_bookings');

    Route::post('/update-payment-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updatePaymentStatus')->name('admin.vendor_room_bookings.update_payment_status');
    Route::post('/update-partial-amount', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updatePartialAmount')->name('admin.vendor_room_bookings.update_partial_amount');

    Route::post('/update-stay-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updateStayStatus')->name('admin.vendor_room_bookings.update_stay_status');

    Route::post('/update-booking-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updateBookingStatus')->name('admin.vendor_room_bookings.update_booking_status');
    Route::post('/booking-cancel-refund', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@makeRefund')->name('admin.vendor_room_bookings.update_booking_cancel_refund');

    Route::prefix('refunds')->group(function () {
      Route::get('/', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@refunds')->name('admin.vendor_room_bookings.refunds');
      Route::post('/update-refund-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updateRefundStatus')->name('admin.vendor_room_bookings.update_refund_status');
      Route::post('/delete-refund', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@deleteRefund')->name('admin.vendor_room_bookings.refund.delete');
    });

    Route::get('/disputes', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@disputes')->name('admin.vendor_room_bookings.disputes');
    Route::post('/update-refund-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updateRefundStatus')->name('admin.vendor_room_bookings.update_refund_status');

    Route::get('/edit/{id}', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@editBooking')->name('admin.vendor_room_bookings.booking_edit');
    Route::get('/details-and-edit/{id}', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@editBooking')->name('admin.vendor_room_bookings.booking_details_and_edit');
    Route::post('/update', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updateBooking')->name('admin.vendor_room_bookings.update_booking');

    Route::get('/details/{id}', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@bookingDetails')->name('admin.vendor_room_bookings.booking_details');

    Route::get('/paid-services/{id}', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@paidServices')->name('admin.vendor_room_bookings.booking_paid_services');
    Route::post('/update-paid-service', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updatePaidServices')->name('admin.vendor_room_bookings.update_paid_service');
    Route::post('/update-paid-service-payment-status', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@updatePaidServicesPaymentStatus')->name('admin.vendor_room_bookings.paid_service.update_payment_status');

    Route::post('/send-mail', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@sendMail')->name('admin.vendor_room_bookings.send_mail');

    Route::post('/delete/{id}', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@deleteBooking')->name('admin.vendor_room_bookings.delete_booking');

    Route::post('/bulk-delete', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@bulkDeleteBooking')->name('admin.vendor_room_bookings.bulk_delete_booking');

    Route::get('/get-booked-dates', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@bookedDates')->name('admin.vendor_room_bookings.get_booked_dates');

    Route::get('/booking-form', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@bookingForm')->name('admin.vendor_room_bookings.booking_form');

    Route::post('/make-booking', 'Admin\VendorRoomBooking\AdminVendorRoomBookingController@makeBooking')->name('admin.vendor_room_bookings.make_booking');
  });


  // services management route start
  Route::group(['middleware' => 'checkpermission:Services Management'], function () {
    Route::get('/services_management', 'Admin\ServiceController@services')->name('admin.services_management');

    Route::get('/services_management/create_service', 'Admin\ServiceController@createService')->name('admin.services_management.create_service');

    Route::post('/services_management/store_service', 'Admin\ServiceController@storeService')->name('admin.services_management.store_service');

    Route::post('/services_management/update_featured_service', 'Admin\ServiceController@updateFeaturedService')->name('admin.services_management.update_featured_service');

    Route::get('/services_management/edit_service/{id}', 'Admin\ServiceController@editService')->name('admin.services_management.edit_service');

    Route::post('/services_management/update_service/{id}', 'Admin\ServiceController@updateService')->name('admin.services_management.update_service');

    Route::post('/services_management/delete_service', 'Admin\ServiceController@deleteService')->name('admin.services_management.delete_service');

    Route::post('/services_management/bulk_delete_service', 'Admin\ServiceController@bulkDeleteService')->name('admin.services_management.bulk_delete_service');
  });
  // services management route end


  // custom pages route start
  Route::group(['middleware' => 'checkpermission:Custom Pages'], function () {
    Route::get('/pages', 'App\Http\Controllers\Admin\PageController@index')->name('admin.page.index');
    Route::get('/page/create', 'App\Http\Controllers\Admin\PageController@create')->name('admin.page.create');
    Route::post('/page/store', 'App\Http\Controllers\Admin\PageController@store')->name('admin.page.store');
    Route::get('/page/{menuID}/edit', 'App\Http\Controllers\Admin\PageController@edit')->name('admin.page.edit');
    Route::post('/page/update', 'App\Http\Controllers\Admin\PageController@update')->name('admin.page.update');
    Route::post('/page/delete', 'App\Http\Controllers\Admin\PageController@delete')->name('admin.page.delete');
    Route::post('/page/bulk-delete', 'App\Http\Controllers\Admin\PageController@bulkDelete')->name('admin.page.bulk.delete');
  });
  // custom pages route end


  // blogs management route start
  Route::group(['middleware' => 'checkpermission:Blogs Management'], function () {
    Route::get('/blogs_management/categories', 'Admin\BlogController@blogCategories')->name('admin.blogs_management.categories');

    Route::post('/blogs_management/store_category', 'Admin\BlogController@storeCategory')->name('admin.blogs_management.store_category');

    Route::post('/blogs_management/update_category', 'Admin\BlogController@updateCategory')->name('admin.blogs_management.update_category');

    Route::post('/blogs_management/delete_category', 'Admin\BlogController@deleteCategory')->name('admin.blogs_management.delete_category');

    Route::post('/blogs_management/bulk_delete_category', 'Admin\BlogController@bulkDeleteCategory')->name('admin.blogs_management.bulk_delete_category');

    Route::get('/blogs_management/blogs', 'Admin\BlogController@blogs')->name('admin.blogs_management.blogs');

    Route::get('/blogs_management/create_blog', 'Admin\BlogController@createBlog')->name('admin.blogs_management.create_blog');

    Route::post('/blogs_management/store_blog', 'Admin\BlogController@storeBlog')->name('admin.blogs_management.store_blog');

    Route::get('/blogs_management/edit_blog/{id}', 'Admin\BlogController@editBlog')->name('admin.blogs_management.edit_blog');

    Route::post('/blogs_management/update_blog/{id}', 'Admin\BlogController@updateBlog')->name('admin.blogs_management.update_blog');

    Route::post('/blogs_management/delete_blog', 'Admin\BlogController@deleteBlog')->name('admin.blogs_management.delete_blog');

    Route::post('/blogs_management/bulk_delete_blog', 'Admin\BlogController@bulkDeleteBlog')->name('admin.blogs_management.bulk_delete_blog');
  });
  // blogs management route end


  // gallery management route start
  Route::group(['middleware' => 'checkpermission:Gallery Management'], function () {
    Route::get('/gallery_management/categories', 'Admin\GalleryController@categories')->name('admin.gallery_management.categories');

    Route::post('/gallery_management/store_category', 'Admin\GalleryController@storeCategory')->name('admin.gallery_management.store_category');

    Route::post('/gallery_management/update_category', 'Admin\GalleryController@updateCategory')->name('admin.gallery_management.update_category');

    Route::post('/gallery_management/delete_category', 'Admin\GalleryController@deleteCategory')->name('admin.gallery_management.delete_category');

    Route::post('/gallery_management/bulk_delete_category', 'Admin\GalleryController@bulkDeleteCategory')->name('admin.gallery_management.bulk_delete_category');

    Route::get('/gallery_management/images', 'Admin\GalleryController@index')->name('admin.gallery_management.images');

    Route::post('/gallery_management/store_gallery_info/{language}', 'Admin\GalleryController@storeInfo')->name('admin.gallery_management.store_gallery_info');

    Route::post('/gallery_management/update_gallery_info', 'Admin\GalleryController@updateInfo')->name('admin.gallery_management.update_gallery_info');

    Route::post('/gallery_management/delete_gallery_info', 'Admin\GalleryController@deleteInfo')->name('admin.gallery_management.delete_gallery_info');

    Route::post('/gallery_management/bulk_delete_gallery_info', 'Admin\GalleryController@bulkDeleteInfo')->name('admin.gallery_management.bulk_delete_gallery_info');
  });
  // gallery management route end


  // faq management route start
  Route::group(['middleware' => 'checkpermission:FAQ Management'], function () {
    Route::get('/faq_management', 'Admin\FAQController@index')->name('admin.faq_management');

    Route::post('/faq_management/store_faq', 'Admin\FAQController@store')->name('admin.faq_management.store_faq');

    Route::post('/faq_management/update_faq', 'Admin\FAQController@update')->name('admin.faq_management.update_faq');

    Route::post('/faq_management/delete_faq', 'Admin\FAQController@delete')->name('admin.faq_management.delete_faq');

    Route::post('/faq_management/bulk_delete_faq', 'Admin\FAQController@bulkDelete')->name('admin.faq_management.bulk_delete_faq');
  });
  // faq management route end


  // packages management route start
  Route::group(['middleware' => 'checkpermission:Packages Management'], function () {
    Route::get('/packages_management/settings', 'Admin\PackageController@settings')->name('admin.packages_management.settings');

    Route::post('/packages_management/update_settings', 'Admin\PackageController@updateSettings')->name('admin.packages_management.update_settings');

    Route::get('/packages_management/coupons', 'Admin\PackageController@coupons')->name('admin.packages_management.coupons');

    Route::post('/packages_management/store-coupon', 'Admin\PackageController@storeCoupon')->name('admin.packages_management.store_coupon');

    Route::post('/packages_management/update-coupon', 'Admin\PackageController@updateCoupon')->name('admin.packages_management.update_coupon');

    Route::post('/packages_management/delete-coupon/{id}', 'Admin\PackageController@destroyCoupon')->name('admin.packages_management.delete_coupon');

    Route::get('/packages_management/categories', 'Admin\PackageController@categories')->name('admin.packages_management.categories');

    Route::post('/packages_management/store_category', 'Admin\PackageController@storeCategory')->name('admin.packages_management.store_category');

    Route::post('/packages_management/update_category', 'Admin\PackageController@updateCategory')->name('admin.packages_management.update_category');

    Route::post('/packages_management/delete_category', 'Admin\PackageController@deleteCategory')->name('admin.packages_management.delete_category');

    Route::post('/packages_management/bulk_delete_category', 'Admin\PackageController@bulkDeleteCategory')->name('admin.packages_management.bulk_delete_category');

    Route::get('/packages_management/packages', 'Admin\PackageController@packages')->name('admin.packages_management.packages');

    Route::get('/packages_management/create_package', 'Admin\PackageController@createPackage')->name('admin.packages_management.create_package');

    //sliders images
    Route::post('/packages_management/images-store', 'Admin\PackageController@gallerystore')->name('admin.packages_management.imagesstore');
    Route::post('room-imagermv', 'Admin\PackageController@imagermv')->name('admin.packages_management.imagermv');

    Route::post('room-img-dbrmv', 'Admin\PackageController@imagedbrmv')->name('admin.packages_management.imgdbrmv');
    Route::get('room-images/{id}', 'Admin\PackageController@images')->name('admin.packages_management.images');
    //sliders images end

    Route::post('/packages_management/store_package', 'Admin\PackageController@storePackage')->name('admin.packages_management.store_package');

    Route::post('/packages_management/update_featured_package', 'Admin\PackageController@updateFeaturedPackage')->name('admin.packages_management.update_featured_package');

    Route::get('/packages_management/edit_package/{id}', 'Admin\PackageController@editPackage')->name('admin.packages_management.edit_package');

    Route::get('/packages_management/slider_images/{id}', 'Admin\PackageController@getSliderImages');

    Route::post('/packages_management/update_package/{id}', 'Admin\PackageController@updatePackage')->name('admin.packages_management.update_package');

    Route::post('/packages_management/delete_package', 'Admin\PackageController@deletePackage')->name('admin.packages_management.delete_package');

    Route::post('/packages_management/bulk_delete_package', 'Admin\PackageController@bulkDeletePackage')->name('admin.packages_management.bulk_delete_package');

    Route::post('/packages_management/store_location', 'Admin\PackageController@storeLocation')->name('admin.packages_management.store_location');

    Route::get('/packages_management/view_locations/{package_id}', 'Admin\PackageController@viewLocations')->name('admin.packages_management.view_locations');

    Route::post('/packages_management/update_location', 'Admin\PackageController@updateLocation')->name('admin.packages_management.update_location');

    Route::post('/packages_management/delete_location', 'Admin\PackageController@deleteLocation')->name('admin.packages_management.delete_location');

    Route::post('/packages_management/bulk_delete_location', 'Admin\PackageController@bulkDeleteLocation')->name('admin.packages_management.bulk_delete_location');

    Route::post('/packages_management/store_daywise_plan', 'Admin\PackageController@storeDaywisePlan')->name('admin.packages_management.store_daywise_plan');

    Route::post('/packages_management/store_timewise_plan', 'Admin\PackageController@storeTimewisePlan')->name('admin.packages_management.store_timewise_plan');

    Route::get('/packages_management/view_plans/{package_id}', 'Admin\PackageController@viewPlans')->name('admin.packages_management.view_plans');

    Route::post('/packages_management/update_daywise_plan', 'Admin\PackageController@updateDaywisePlan')->name('admin.packages_management.update_daywise_plan');

    Route::post('/packages_management/update_timewise_plan', 'Admin\PackageController@updateTimewisePlan')->name('admin.packages_management.update_timewise_plan');

    Route::post('/packages_management/delete_plan', 'Admin\PackageController@deletePlan')->name('admin.packages_management.delete_plan');

    Route::post('/packages_management/bulk_delete_plan', 'Admin\PackageController@bulkDeletePlan')->name('admin.packages_management.bulk_delete_plan');
  });
  // packages management route end


  // Package Bookings Routes
  Route::group(['middleware' => 'checkpermission:Package Bookings'], function () {
    Route::get('/package_bookings/all_bookings', 'Admin\PackageController@bookings')->name('admin.package_bookings.all_bookings');

    Route::get('/package_bookings/paid_bookings', 'Admin\PackageController@bookings')->name('admin.package_bookings.paid_bookings');

    Route::get('/package_bookings/unpaid_bookings', 'Admin\PackageController@bookings')->name('admin.package_bookings.unpaid_bookings');

    Route::post('/package_bookings/update_payment_status', 'Admin\PackageController@updatePaymentStatus')->name('admin.package_bookings.update_payment_status');

    Route::get('/package_bookings/booking_details/{id}', 'Admin\PackageController@bookingDetails')->name('admin.package_bookings.booking_details');

    Route::post('/package_bookings/send_mail', 'Admin\PackageController@sendMail')->name('admin.package_bookings.send_mail');

    Route::post('/package_bookings/delete_booking/{id}', 'Admin\PackageController@deleteBooking')->name('admin.package_bookings.delete_booking');

    Route::post('/package_bookings/bulk_delete_booking', 'Admin\PackageController@bulkDeleteBooking')->name('admin.package_bookings.bulk_delete_booking');
  });


  // footer route start
  Route::group(['middleware' => 'checkpermission:Footer'], function () {
    Route::get('/footer/text', 'Admin\FooterController@footerText')->name('admin.footer.text');

    Route::post('/footer/update_footer_info/{language}', 'Admin\FooterController@updateFooterInfo')->name('admin.footer.update_footer_info');

    Route::get('/footer/quick_links', 'Admin\FooterController@quickLinks')->name('admin.footer.quick_links');

    Route::post('/footer/store_quick_link/{language}', 'Admin\FooterController@storeQuickLink')->name('admin.footer.store_quick_link');

    Route::post('/footer/update_quick_link', 'Admin\FooterController@updateQuickLink')->name('admin.footer.update_quick_link');

    Route::post('/footer/delete_quick_link', 'Admin\FooterController@deleteQuickLink')->name('admin.footer.delete_quick_link');
  });
  // footer route end


  // Announcement Popup Routes
  Route::group(['middleware' => 'checkpermission:Announcement Popup'], function () {
    Route::get('popups', 'App\Http\Controllers\Admin\PopupController@index')->name('admin.popup.index');
    Route::get('popup/types', 'App\Http\Controllers\Admin\PopupController@types')->name('admin.popup.types');
    Route::get('popup/{id}/edit', 'App\Http\Controllers\Admin\PopupController@edit')->name('admin.popup.edit');
    Route::get('popup/create', 'App\Http\Controllers\Admin\PopupController@create')->name('admin.popup.create');
    Route::post('popup/store', 'App\Http\Controllers\Admin\PopupController@store')->name('admin.popup.store');;
    Route::post('popup/delete', 'App\Http\Controllers\Admin\PopupController@delete')->name('admin.popup.delete');
    Route::post('popup/bulk-delete', 'App\Http\Controllers\Admin\PopupController@bulkDelete')->name('admin.popup.bulk.delete');
    Route::post('popup/status', 'App\Http\Controllers\Admin\PopupController@status')->name('admin.popup.status');
    Route::post('popup/update', 'App\Http\Controllers\Admin\PopupController@update')->name('admin.popup.update');;
  });


  Route::group(['middleware' => 'checkpermission:Users Management'], function () {
    // Admin Subscriber Routes
    Route::get('/subscribers', 'App\Http\Controllers\Admin\SubscriberController@index')->name('admin.subscriber.index');
    Route::get('/mailsubscriber', 'App\Http\Controllers\Admin\SubscriberController@mailsubscriber')->name('admin.mailsubscriber');
    Route::post('/subscribers/sendmail', 'App\Http\Controllers\Admin\SubscriberController@subscsendmail')->name('admin.subscribers.sendmail');
    Route::post('/subscriber/delete', 'App\Http\Controllers\Admin\SubscriberController@delete')->name('admin.subscriber.delete');
    Route::post('/subscriber/bulk-delete', 'App\Http\Controllers\Admin\SubscriberController@bulkDelete')->name('admin.subscriber.bulk.delete');


    // Register User start
    Route::get('register/users', 'App\Http\Controllers\Admin\RegisterUserController@index')->name('admin.register.user');

    Route::get('register/users/create', 'App\Http\Controllers\Admin\RegisterUserController@create')->name('admin.register.create');
    Route::post('register/users/store', 'App\Http\Controllers\Admin\RegisterUserController@store')->name('admin.register.user.store');
    Route::get('register/users/edit/{id}', 'App\Http\Controllers\Admin\RegisterUserController@edit')->name('admin.register.user.edit');
    Route::post('register/users/update/{id}', 'App\Http\Controllers\Admin\RegisterUserController@update')->name('admin.register.user.update');

    Route::post('register/users/ban', 'App\Http\Controllers\Admin\RegisterUserController@userban')->name('register.user.ban');
    Route::post('register/users/email', 'App\Http\Controllers\Admin\RegisterUserController@emailStatus')->name('register.user.email');
    Route::get('register/user/details/{id}', 'App\Http\Controllers\Admin\RegisterUserController@view')->name('register.user.view');
    Route::post('register/user/delete', 'App\Http\Controllers\Admin\RegisterUserController@delete')->name('register.user.delete');
    Route::post('register/user/bulk-delete', 'App\Http\Controllers\Admin\RegisterUserController@bulkDelete')->name('register.user.bulk.delete');
    Route::get('register/user/{id}/changePassword', 'App\Http\Controllers\Admin\RegisterUserController@changePass')->name('register.user.changePass');
    Route::post('register/user/updatePassword', 'App\Http\Controllers\Admin\RegisterUserController@updatePassword')->name('register.user.updatePassword');

    Route::get('register/user/secret-login/{id}', 'App\Http\Controllers\Admin\RegisterUserController@secret_login')->name('register.user.secret_login');
    //Register User end


    // push notification route
    Route::prefix('/push-notification')->group(function () {
      Route::get('/settings', 'Admin\PushNotificationController@settings')->name('admin.user_management.push_notification.settings');

      Route::post('/update-settings', 'Admin\PushNotificationController@updateSettings')->name('admin.user_management.push_notification.update_settings');

      Route::get('/notification-for-visitors', 'Admin\PushNotificationController@writeNotification')->name('admin.user_management.push_notification.notification_for_visitors');

      Route::post('/send', 'Admin\PushNotificationController@sendNotification')->name('admin.user_management.push_notification.send');
    });
  });

  // vendor management route start
  Route::prefix('/vendor-management')->middleware('checkpermission:Vendors Management')->group(function () {
    Route::get('/settings', 'Admin\VendorManagementController@settings')->name('admin.vendor_management.settings');
    Route::post('/settings/update', 'Admin\VendorManagementController@update_setting')->name('admin.vendor_management.setting.update');

    Route::get('/add-vendor', 'Admin\VendorManagementController@add')->name('admin.vendor_management.add_vendor');
    Route::post('/save-vendor', 'Admin\VendorManagementController@create')->name('admin.vendor_management.save-vendor');

    Route::get('/registered-vendors', 'Admin\VendorManagementController@index')->name('admin.vendor_management.registered_vendor');

    Route::prefix('/vendor/{id}')->group(function () {

      Route::post('/update-account-status', 'Admin\VendorManagementController@updateAccountStatus')->name('admin.vendor_management.vendor.update_account_status');

      Route::post('/update-email-status', 'Admin\VendorManagementController@updateEmailStatus')->name('admin.vendor_management.vendor.update_email_status');

      Route::get('/details', 'Admin\VendorManagementController@show')->name('admin.vendor_management.vendor_details');

      Route::get('/edit', 'Admin\VendorManagementController@edit')->name('admin.edit_management.vendor_edit');

      Route::post('/update', 'Admin\VendorManagementController@update')->name('admin.vendor_management.vendor.update_vendor');

      Route::post('/update/vendor/balance', 'Admin\VendorManagementController@update_vendor_balance')->name('admin.vendor_management.vendor.update_vendor_balance');

      Route::get('/change-password', 'Admin\VendorManagementController@changePassword')->name('admin.vendor_management.vendor.change_password');

      Route::post('/update-password', 'Admin\VendorManagementController@updatePassword')->name('admin.vendor_management.vendor.update_password');

      Route::post('/delete', 'Admin\VendorManagementController@destroy')->name('admin.vendor_management.vendor.delete');
    });

    Route::post('/bulk-delete-vendor', 'Admin\VendorManagementController@bulkDestroy')->name('admin.vendor_management.bulk_delete_vendor');

    Route::get('secret-login/{id}', 'Admin\VendorManagementController@secret_login')->name('admin.vendor_management.secret_login');
  });
  // vendor management route start

  Route::prefix('withdraw')->middleware('checkpermission:Withdraw')->group(function () {
    Route::get('/payment-methods', 'Admin\WithdrawPaymentMethodController@index')->name('admin.withdraw.payment_method');
    Route::post('/payment-methods/store', 'Admin\WithdrawPaymentMethodController@store')->name('admin.withdraw_payment_method.store');
    Route::put('/payment-methods/update', 'Admin\WithdrawPaymentMethodController@update')->name('admin.withdraw_payment_method.update');
    Route::post('/payment-methods/delete/{id}', 'Admin\WithdrawPaymentMethodController@destroy')->name('admin.withdraw_payment_method.delete');

    Route::get('/payment-method/input', 'Admin\WithdrawPaymentMethodInputController@index')->name('admin.withdraw_payment_method.mange_input');
    Route::post('/payment-method/input-store', 'Admin\WithdrawPaymentMethodInputController@store')->name('admin.withdraw_payment_method.store_input');
    Route::get('/payment-method/input-edit/{id}', 'Admin\WithdrawPaymentMethodInputController@edit')->name('admin.withdraw_payment_method.edit_input');
    Route::get('/payment-method/input-edit/{id}', 'Admin\WithdrawPaymentMethodInputController@edit')->name('admin.withdraw_payment_method.edit_input');
    Route::post('/payment-method/input-update', 'Admin\WithdrawPaymentMethodInputController@update')->name('admin.withdraw_payment_method.update_input');
    Route::post('/payment-method/order-update', 'Admin\WithdrawPaymentMethodInputController@order_update')->name('admin.withdraw_payment_method.order_update');
    Route::get('/payment-method/input-option/{id}', 'Admin\WithdrawPaymentMethodInputController@get_options')->name('admin.withdraw_payment_method.options');
    Route::post('/payment-method/input-delete', 'Admin\WithdrawPaymentMethodInputController@delete')->name('admin.withdraw_payment_method.options_delete');

    Route::get('/withdraw-request', 'Admin\WithdrawController@index')->name('admin.withdraw.withdraw_request');
    Route::post('/withdraw-request/delete', 'Admin\WithdrawController@delete')->name('admin.witdraw.delete_withdraw');
    Route::get('/withdraw-request/approve/{id}', 'Admin\WithdrawController@approve')->name('admin.witdraw.approve_withdraw');


    Route::get('/withdraw-request/decline/{id}', 'Admin\WithdrawController@decline')->name('admin.witdraw.decline_withdraw');
  });

  Route::get('/transcation', 'Admin\AdminController@transcation')->name('admin.transcation')->middleware('checkpermission:Transaction');




  Route::group(['middleware' => 'checkpermission:Admins Management'], function () {
    // Admin Users Routes
    Route::get('/users', 'App\Http\Controllers\Admin\UserController@index')->name('admin.user.index');
    Route::post('/user/upload', 'App\Http\Controllers\Admin\UserController@upload')->name('admin.user.upload');
    Route::post('/user/store', 'App\Http\Controllers\Admin\UserController@store')->name('admin.user.store');
    Route::get('/user/{id}/edit', 'App\Http\Controllers\Admin\UserController@edit')->name('admin.user.edit');
    Route::post('/user/update', 'App\Http\Controllers\Admin\UserController@update')->name('admin.user.update');
    Route::post('/user/{id}/uploadUpdate', 'App\Http\Controllers\Admin\UserController@uploadUpdate')->name('admin.user.uploadUpdate');
    Route::post('/user/delete', 'App\Http\Controllers\Admin\UserController@delete')->name('admin.user.delete');

    // Admin Roles Routes
    Route::get('/roles', 'App\Http\Controllers\Admin\RoleController@index')->name('admin.role.index');
    Route::post('/role/store', 'App\Http\Controllers\Admin\RoleController@store')->name('admin.role.store');
    Route::post('/role/update', 'App\Http\Controllers\Admin\RoleController@update')->name('admin.role.update');
    Route::post('/role/delete', 'App\Http\Controllers\Admin\RoleController@delete')->name('admin.role.delete');
    Route::get('role/{id}/permissions/manage', 'App\Http\Controllers\Admin\RoleController@managePermissions')->name('admin.role.permissions.manage');
    Route::post('role/permissions/update', 'App\Http\Controllers\Admin\RoleController@updatePermissions')->name('admin.role.permissions.update');
  });

  #====support tickets ============

  Route::prefix('support/ticket')->middleware('checkpermission:Support Tickets')->group(function () {
    Route::get('/setting', 'Admin\SupportTicketController@setting')->name('admin.support_ticket.setting');
    Route::post('/setting/update', 'Admin\SupportTicketController@update_setting')->name('admin.support_ticket.update_setting');
    Route::get('/', 'Admin\SupportTicketController@index')->name('admin.support_tickets');
    Route::get('/message/{id}', 'Admin\SupportTicketController@message')->name('admin.support_tickets.message');
    Route::post('/zip-upload', 'Admin\SupportTicketController@zip_file_upload')->name('admin.support_ticket.zip_file.upload');
    Route::post('/reply/{id}', 'Admin\SupportTicketController@ticketreply')->name('admin.support_ticket.reply');
    Route::post('/closed/{id}', 'Admin\SupportTicketController@ticket_closed')->name('admin.support_ticket.close');
    Route::post('/assign-stuff/{id}', 'Admin\SupportTicketController@assign_stuff')->name('assign_stuff.supoort.ticket');

    Route::get('support-ticket/unassign-stuff/{id}', 'Admin\SupportTicketController@unassign_stuff')->name('admin.support_tickets.unassign');

    Route::post('/delete/{id}', 'Admin\SupportTicketController@delete')->name('admin.support_tickets.delete');

    Route::post('support-ticket/bulk/delete/', 'Admin\SupportTicketController@bulk_delete')->name('admin.support_tickets.bulk_delete');
  });



  // Sitemap Routes start
  Route::group(['middleware' => 'checkpermission:Sitemap'], function () {
    Route::get('/sitemap', 'App\Http\Controllers\Admin\SitemapController@index')->name('admin.sitemap.index');
    Route::post('/sitemap/store', 'App\Http\Controllers\Admin\SitemapController@store')->name('admin.sitemap.store');
    Route::get('/sitemap/{id}/update', 'App\Http\Controllers\Admin\SitemapController@update')->name('admin.sitemap.update');
    Route::post('/sitemap/{id}/delete', 'App\Http\Controllers\Admin\SitemapController@delete')->name('admin.sitemap.delete');
    Route::post('/sitemap/download', 'App\Http\Controllers\Admin\SitemapController@download')->name('admin.sitemap.download');
  });
  // Sitemap Routes end


  // Admin Cache Clear Routes
  Route::get('/cache-clear', 'App\Http\Controllers\Admin\CacheController@clear')->name('admin.cache.clear');


  // QR Code Builder Routes
  Route::group(['middleware' => 'checkpermission:QR Builder'], function () {
    Route::get('/saved/qrs', 'App\Http\Controllers\Admin\QrController@index')->name('admin.qrcode.index');
    Route::post('/saved/qr/delete', 'App\Http\Controllers\Admin\QrController@delete')->name('admin.qrcode.delete');
    Route::post('/saved/qr/bulk-delete', 'App\Http\Controllers\Admin\QrController@bulkDelete')->name('admin.qrcode.bulk.delete');
    Route::get('/qr-code', 'App\Http\Controllers\Admin\QrController@qrCode')->name('admin.qrcode');
    Route::post('/qr-code/generate', 'App\Http\Controllers\Admin\QrController@generate')->name('admin.qrcode.generate');
    Route::get('/qr-code/clear', 'App\Http\Controllers\Admin\QrController@clear')->name('admin.qrcode.clear');
    Route::post('/qr-code/save', 'App\Http\Controllers\Admin\QrController@save')->name('admin.qrcode.save');
  });
});
