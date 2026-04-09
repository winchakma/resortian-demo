<div class="mb-8">
    <!-- Desktop Layout (visible on sm and up) -->
    <div class="hidden sm:flex sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div class="min-w-0">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ $title }}</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ $subTitle }}
            </p>
        </div>
        <div class="flex items-center gap-3 flex-shrink-0">
            <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Discard
            </a>
            <button form="{{ $formId }}" type="submit" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-colors">
                {{ $saveBtnText }}
            </button>
        </div>
    </div>

    <!-- Mobile Layout (visible only on mobile) -->
    <div class="sm:hidden flex flex-col gap-4">
        <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{{ $title }}</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ $subTitle }}
            </p>
        </div>
        <div class="flex items-center gap-3">
            <a onclick="history.back(); return false;" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                {{ isset($cancelBtnText) ? $cancelBtnText : 'Discard' }}
            </a>
            <button form="{{ $formId }}" type="submit" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-colors">
                {{ $saveBtnText }}
            </button>
        </div>
    </div>
</div>