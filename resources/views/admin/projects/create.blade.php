@extends('admin.layouts.app')

@php
    $isEdit = isset($project);
    if ($isEdit) {
        $returnParts = array_map('trim', explode('-', str_replace('%', '', $project->return ?? '')));
        $editReturnMin = isset($returnParts[0]) && is_numeric($returnParts[0]) ? $returnParts[0] : '';
        $editReturnMax = isset($returnParts[1]) && is_numeric($returnParts[1]) ? $returnParts[1] : $editReturnMin;
    }
@endphp

@section('title', $isEdit ? 'Edit Project' : 'Create Project')
@section('page-title', $isEdit ? 'Edit Project' : 'Create Project')

@section('content')
    {{-- Breadcrumbs --}}
    <nav class="flex items-center gap-2 text-sm mb-6">
        <a href="{{ route('admin.dashboard') }}" class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</a>
        <svg class="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <a href="{{ route('admin.projects.index') }}" class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Projects</a>
        <svg class="h-4 w-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span class="text-gray-700 dark:text-gray-300 font-medium">{{ $isEdit ? 'Edit' : 'Create New' }}</span>
    </nav>

    {{-- Page Header --}}
    @include('admin.partials.listPageHeader', [
        'title' => $isEdit ? 'Edit Project' : 'Create New Project',
        'subTitle' => $isEdit ? 'Update the project details below.' : 'Fill in the details to publish a new investment project on the platform.',
        'formId' => 'projectForm',
        'saveBtnText' => $isEdit ? 'Update Project' : 'Publish Project',
        'cancelBtnText' => $isEdit ? 'Discard' : 'Discard',
    ])

    @if($errors->any())
        <div class="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800/60 dark:bg-red-900/20">
            <svg class="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <div>
                <p class="text-sm font-semibold text-red-700 dark:text-red-400">Please fix the following errors:</p>
                <ul class="mt-1 space-y-0.5">
                    @foreach ($errors->all() as $error)
                        <li class="text-sm text-red-600 dark:text-red-400">&bull; {{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endif

    <form id="projectForm" action="{{ $isEdit ? route('admin.projects.update', $project) : route('admin.projects.store') }}" method="POST" enctype="multipart/form-data" onsubmit="document.getElementById('description').value = quill.root.innerHTML">
        @csrf
        @if($isEdit)
            @method('PUT')
        @endif

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {{-- ── Left / Main Column ─────────────────────────────────── --}}
            <div class="lg:col-span-2 space-y-6">

                {{-- Basic Info --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/40">
                            <svg class="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                            </svg>
                        </span>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500">Project name, location and duration</p>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Project Title <span class="text-red-500">*</span>
                                </label>
                                <input type="text" name="title" value="{{ old('title', $isEdit ? $project->title : '') }}" required
                                    placeholder="e.g. Tomato Harvesting Project"
                                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Project Type <span class="text-red-500">*</span>
                                </label>
                                <select name="type" required class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition">
                                    @foreach(['NORMAL', 'SHARIAH', 'LONG TERM', 'SHORT TERM', 'MONTHLY PROFIT RETURN'] as $type)
                                        <option value="{{ $type }}" {{ old('type', $isEdit ? $project->type : '') === $type ? 'selected' : '' }}>{{ $type }}</option>
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Location <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                    </span>
                                    <input type="text" name="location" value="{{ old('location', $isEdit ? $project->location : '') }}" required
                                        placeholder="e.g. Shibganj, Nondigram"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Duration <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </span>
                                    <input type="text" name="duration" value="{{ old('duration', $isEdit ? $project->duration : '') }}" required
                                        placeholder="e.g. 4 months"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                                </div>
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Num of Units <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </span>
                                    <input type="number" name="total_units" value="{{ old('total_units', $isEdit ? $project->total_units : '') }}" required
                                        placeholder="e.g. 100"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Financial Details --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/40">
                            <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </span>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Financial Details</h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500">Enter unit price &amp; return percentages &mdash; other fields calculate automatically</p>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        {{-- Unit Price --}}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit Price (Tk) <span class="text-red-500">*</span></label>
                            <div class="relative">
                                <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm font-medium">৳</span>
                                <input type="number" step="0.01" name="unit_price" id="unit_price" value="{{ old('unit_price', $isEdit ? $project->unit_price : '') }}" required
                                    placeholder="40000"
                                    oninput="calculateReturns()"
                                    class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-8 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                            </div>
                        </div>

                        {{-- Return Percentage Inputs --}}
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Return Min (%) <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <input type="number" step="0.1" name="return_min" id="return_min" value="{{ old('return_min', $isEdit ? $editReturnMin : '') }}" required
                                        placeholder="7.5" min="0" max="100"
                                        oninput="calculateReturns()"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                                    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm font-medium">%</span>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Return Max (%) <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <input type="number" step="0.1" name="return_max" id="return_max" value="{{ old('return_max', $isEdit ? $editReturnMax : '') }}" required
                                        placeholder="9.0" min="0" max="100"
                                        oninput="calculateReturns()"
                                        class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 transition">
                                    <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm font-medium">%</span>
                                </div>
                            </div>
                        </div>

                        {{-- Validation Warning --}}
                        <div id="returnWarning" class="hidden rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10 px-4 py-3 flex items-center gap-2">
                            <svg class="h-4 w-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                            </svg>
                            <p class="text-sm text-amber-700 dark:text-amber-400">Return Max must be greater than or equal to Return Min.</p>
                        </div>

                        {{-- Calculated Returns Preview --}}
                        <div id="calculatedReturns" class="hidden rounded-xl border border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/10 p-5">
                            <div class="flex items-center gap-2 mb-4">
                                <svg class="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <h4 class="text-sm font-semibold text-green-800 dark:text-green-300">Calculated Returns</h4>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="rounded-lg bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 p-3 text-center">
                                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Return %</p>
                                    <p id="calcReturn" class="text-sm font-bold text-green-700 dark:text-green-400">&mdash;</p>
                                </div>
                                <div class="rounded-lg bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 p-3 text-center">
                                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Net Profit</p>
                                    <p id="calcNetProfit" class="text-sm font-bold text-green-700 dark:text-green-400">&mdash;</p>
                                </div>
                                <div class="rounded-lg bg-white dark:bg-gray-800 border border-green-100 dark:border-gray-700 p-3 text-center">
                                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Return</p>
                                    <p id="calcTotalReturn" class="text-sm font-bold text-green-700 dark:text-green-400">&mdash;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Description --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/40">
                            <svg class="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                            </svg>
                        </span>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Description</h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500">Detailed overview shown to investors</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <div id="quill-editor" style="height: 300px;" class="rounded-lg bg-white dark:bg-gray-800"></div>
                        <input type="hidden" name="description" id="description" value="{{ old('description', $isEdit ? $project->description : '') }}">
                    </div>
                </div>

            </div>

            {{-- ── Right / Sidebar Column ─────────────────────────────── --}}
            <div class="space-y-6">

                {{-- Image Upload --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
                        <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/40">
                            <svg class="h-4 w-4 text-orange-500 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </span>
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Cover Image</h3>
                            <p class="text-xs text-gray-400 dark:text-gray-500">Shown as thumbnail &amp; header</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <label for="image" id="imageLabel"
                            class="group relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-all bg-gray-50 dark:bg-gray-800/50 overflow-hidden"
                            style="min-height: 220px;">

                            <div id="imagePlaceholder" class="flex flex-col items-center py-10 px-4 text-center {{ $isEdit && $project->image ? 'hidden' : '' }}">
                                <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 group-hover:border-indigo-200 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
                                    <svg class="h-6 w-6 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Click to upload</p>
                                <p class="mt-1 text-xs text-gray-400 dark:text-gray-500">PNG, JPG, GIF &mdash; max 2MB</p>
                            </div>

                            <img id="imagePreview" class="absolute inset-0 h-full w-full object-cover {{ $isEdit && $project->image ? '' : 'hidden' }}"
                                src="{{ $isEdit && $project->image ? Storage::url($project->image) : '' }}" alt="Preview">
                        </label>
                        <input type="file" name="image" id="image" accept="image/*" class="hidden" onchange="previewImage(this)">

                        <div id="imageFileName" class="mt-3 {{ $isEdit && $project->image ? 'flex' : 'hidden' }} items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                            <svg class="h-4 w-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span id="fileNameText" class="text-xs text-gray-600 dark:text-gray-400 truncate">{{ $isEdit && $project->image ? basename($project->image) : '' }}</span>
                            <button type="button" onclick="clearImage()" class="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        @if($isEdit)
                            <p class="mt-2 text-xs text-gray-400 dark:text-gray-500">Leave blank to keep the current image.</p>
                        @endif
                    </div>
                </div>

                {{-- Featured Toggle --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/40">
                                <svg class="h-4 w-4 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                </svg>
                            </span>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Featured Project</h3>
                                <p class="text-xs text-gray-400 dark:text-gray-500">Highlight on the homepage</p>
                            </div>
                        </div>
                        <label class="relative inline-flex cursor-pointer items-center">
                            <input type="hidden" name="isFeatured" value="0">
                            <input type="checkbox" name="isFeatured" value="1" class="peer sr-only"
                                {{ old('isFeatured', $isEdit ? $project->isFeatured : false) ? 'checked' : '' }}>
                            <div class="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-amber-500/20 dark:bg-gray-700 dark:after:border-gray-600"></div>
                        </label>
                    </div>
                </div>

                {{-- Publish Actions --}}
                <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 p-6">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
                    <div class="flex flex-col gap-3">
                        <button form="projectForm" type="submit"
                            class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors">
                            @if($isEdit)
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                Update Project
                            @else
                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Publish Project
                            @endif
                        </button>
                        <a href="{{ route('admin.projects.index') }}"
                            class="w-full inline-flex items-center justify-center rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors">
                            Discard Changes
                        </a>
                    </div>
                    <p class="mt-4 text-xs text-gray-400 dark:text-gray-500">All fields marked with <span class="text-red-500">*</span> are required.</p>
                </div>

                @if($isEdit)
                    {{-- Danger Zone --}}
                    <div class="rounded-xl border border-red-200 bg-white dark:border-red-900/40 dark:bg-gray-900 p-6">
                        <h3 class="text-sm font-semibold text-red-700 dark:text-red-400 mb-3">Danger Zone</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">Permanently remove this project and all associated data. This action cannot be undone.</p>
                        <button type="button"
                            onclick="if(confirm('Permanently delete this project? This cannot be undone.')) document.getElementById('deleteForm').submit()"
                            class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete Project
                        </button>
                    </div>
                @else
                    {{-- Tips Card --}}
                    <div class="rounded-xl border border-indigo-100 bg-indigo-50 dark:border-indigo-900/50 dark:bg-indigo-900/20 p-5">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                            </svg>
                            <p class="text-xs font-semibold text-indigo-700 dark:text-indigo-400">Tips for a great listing</p>
                        </div>
                        <ul class="space-y-1.5">
                            <li class="text-xs text-indigo-600 dark:text-indigo-400">&bull; Use a high-quality cover image</li>
                            <li class="text-xs text-indigo-600 dark:text-indigo-400">&bull; Clearly state return percentages</li>
                            <li class="text-xs text-indigo-600 dark:text-indigo-400">&bull; Add a detailed description for investors</li>
                            <li class="text-xs text-indigo-600 dark:text-indigo-400">&bull; Include the exact farming location</li>
                        </ul>
                    </div>
                @endif

            </div>
        </div>
    </form>

    @if($isEdit)
        <form id="deleteForm" action="{{ route('admin.projects.destroy', $project) }}" method="POST" class="hidden">
            @csrf
            @method('DELETE')
        </form>
    @endif

    {{-- Quill Rich Text Editor --}}
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    <script>
        const quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Write a detailed description about this project for potential investors...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'blockquote'],
                    ['clean']
                ]
            }
        });

        const oldDescription = document.getElementById('description').value;
        if (oldDescription) quill.root.innerHTML = oldDescription;

        function formatNumber(num) {
            return num.toLocaleString('en-IN');
        }

        function calculateReturns() {
            const unitPrice = parseFloat(document.getElementById('unit_price').value) || 0;
            const returnMin = parseFloat(document.getElementById('return_min').value) || 0;
            const returnMax = parseFloat(document.getElementById('return_max').value) || 0;
            const container = document.getElementById('calculatedReturns');
            const warning = document.getElementById('returnWarning');

            if (returnMax > 0 && returnMax < returnMin) {
                warning.classList.remove('hidden');
                container.classList.add('hidden');
                return;
            } else {
                warning.classList.add('hidden');
            }

            if (unitPrice > 0 && returnMin > 0) {
                container.classList.remove('hidden');

                const netProfitMin = Math.round(unitPrice * returnMin / 100);
                const netProfitMax = returnMax > 0 ? Math.round(unitPrice * returnMax / 100) : netProfitMin;
                const totalReturnMin = unitPrice + netProfitMin;
                const totalReturnMax = unitPrice + netProfitMax;

                const effectiveMax = returnMax > 0 ? returnMax : returnMin;

                document.getElementById('calcReturn').textContent =
                    returnMin === effectiveMax
                        ? returnMin.toFixed(1) + '%'
                        : returnMin.toFixed(1) + '% \u2013 ' + effectiveMax.toFixed(1) + '%';

                document.getElementById('calcNetProfit').textContent =
                    netProfitMin === netProfitMax
                        ? '\u09F3' + formatNumber(netProfitMin)
                        : '\u09F3' + formatNumber(netProfitMin) + ' \u2013 \u09F3' + formatNumber(netProfitMax);

                document.getElementById('calcTotalReturn').textContent =
                    totalReturnMin === totalReturnMax
                        ? '\u09F3' + formatNumber(totalReturnMin)
                        : '\u09F3' + formatNumber(totalReturnMin) + ' \u2013 \u09F3' + formatNumber(totalReturnMax);
            } else {
                container.classList.add('hidden');
            }
        }

        function previewImage(input) {
            const preview = document.getElementById('imagePreview');
            const placeholder = document.getElementById('imagePlaceholder');
            const fileNameDiv = document.getElementById('imageFileName');
            const fileNameText = document.getElementById('fileNameText');

            if (input.files && input.files[0]) {
                const file = input.files[0];
                const reader = new FileReader();
                reader.onload = e => {
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                    fileNameDiv.classList.remove('hidden');
                    fileNameDiv.classList.add('flex');
                    fileNameText.textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        }

        function clearImage() {
            const preview = document.getElementById('imagePreview');
            const placeholder = document.getElementById('imagePlaceholder');
            const fileNameDiv = document.getElementById('imageFileName');
            const input = document.getElementById('image');

            preview.classList.add('hidden');
            preview.src = '';
            placeholder.classList.remove('hidden');
            fileNameDiv.classList.add('hidden');
            fileNameDiv.classList.remove('flex');
            input.value = '';
        }

        calculateReturns();
    </script>
    <style>
        .dark .ql-toolbar { border-color: #374151; background-color: #1f2937; }
        .dark .ql-container { border-color: #374151; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
        .ql-container { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
        .ql-toolbar { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
        .dark .ql-editor { color: #f9fafb; }
        .dark .ql-editor.ql-blank::before { color: #6b7280; }
        .dark .ql-picker-label, .dark .ql-stroke { color: #d1d5db; stroke: #d1d5db; }
        .dark .ql-fill { fill: #d1d5db; }
        .dark .ql-picker-options { background-color: #1f2937; border-color: #374151; }
        .dark .ql-picker-item { color: #d1d5db; }
    </style>
@endsection
