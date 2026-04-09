@extends('admin.layouts.app')

@section('title', 'Profile')
@section('page-title', 'Profile')

@section('content')
    <div class="max-w-2xl">
        {{-- Profile Card --}}
        <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div class="h-32 bg-gradient-to-r from-indigo-600 to-purple-700"></div>
            <div class="px-6 pb-6">
                <div class="-mt-14 mb-6 flex items-center gap-4">
                    <div class="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white dark:border-gray-900 bg-indigo-100 dark:bg-indigo-900 text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                        {{ strtoupper(substr($admin->name, 0, 1)) }}
                    </div>
                    <div class="mb-2">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ $admin->name }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ $admin->name }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ $admin->email }}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Member Since</p>
                            <p class="font-medium text-gray-900 dark:text-white">{{ $admin->created_at->format('F d, Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
