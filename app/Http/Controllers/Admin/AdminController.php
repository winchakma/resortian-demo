<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function showLogin(): View|RedirectResponse
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.auth.login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'Invalid email or password.',
        ])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    public function dashboard(): View
    {
        $stats = [
            'total_users' => User::count(),
            'total_hotels' => Hotel::count(),
            'total_admins' => Admin::count(),
        ];

        return view('admin.dashboard', compact('stats'));
    }

    public function projects(): View
    {
        return view('admin.projects.index');
    }

    public function users(): View
    {
        $users = User::with('details')->latest()->paginate(10);

        return view('admin.users.index', compact('users'));
    }

    public function profile(): View
    {
        $admin = Auth::guard('admin')->user();

        return view('admin.profile', compact('admin'));
    }
}
