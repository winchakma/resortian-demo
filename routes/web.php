<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Admin\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Admin Panel Routes (Blade-based)
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login'])->name('login.submit');

    Route::middleware('auth:admin')->group(function () {
        Route::get('/', fn () => redirect()->route('admin.dashboard'));
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        
        Route::resource('projects', ProjectController::class);
        Route::get('project/{id}/bookings', [ProjectController::class, 'bookings'])->name('projects.bookings');
        Route::post('project/booking/{booking}/mark-unmark', [ProjectController::class, 'markUnmark']);
        Route::delete('project/booking/{booking}/delete', [ProjectController::class, 'deleteBooking']);

        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});

/*
|--------------------------------------------------------------------------
| Admin API Routes (for programmatic admin creation)
|--------------------------------------------------------------------------
*/

Route::prefix('admin/api')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/create', [AdminAuthController::class, 'create']);
});

Route::get('/console/clear-cache', function () {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('config:cache');
    return 'Done';
});

Route::get('/console/run-migration', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate');
    return 'Done';
});

Route::get('/console/storage-link', function () {
    \Illuminate\Support\Facades\Artisan::call('storage:link');
    return 'Done';
});

Route::get('/console/db-seed', function () {
    \Illuminate\Support\Facades\Artisan::call('db:seed');
    return 'Done';
});