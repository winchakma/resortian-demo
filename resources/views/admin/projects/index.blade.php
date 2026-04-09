@extends('admin.layouts.app')

@section('title', 'Projects')
@section('page-title', 'Projects')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Projects</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Manage investment projects on the platform</p>
        </div>
        <a href="{{ route('admin.projects.create') }}" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Project
        </a>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Project</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Unit Price</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Return</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Duration</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Location</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-center">Featured</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                    @forelse($projects as $project)
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    @if($project->image)
                                        <img src="{{ Storage::url($project->image) }}" class="h-10 w-10 rounded-lg object-cover flex-shrink-0" alt="{{ $project->title }}">
                                    @else
                                        <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">
                                            {{ strtoupper(substr($project->title, 0, 1)) }}
                                        </div>
                                    @endif
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ $project->title }}</p>
                                        <span class="mt-1 inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">{{ $project->type }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">৳{{ number_format($project->unit_price) }}</td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ $project->return }}</td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ $project->duration }}</td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ $project->location }}</td>
                            <td class="px-6 py-4 text-center">
                                @if($project->isFeatured)
                                    <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30">
                                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                        Yes
                                    </span>
                                @else
                                    <span class="text-xs text-gray-400 dark:text-gray-500">&mdash;</span>
                                @endif
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <a href="{{ route('admin.projects.bookings', $project->id) }}" class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30 transition-colors">
                                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                        Bookings
                                    </a>
                                    <a href="{{ route('admin.projects.edit', $project) }}" class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 transition-colors">
                                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                                        </svg>
                                        Edit
                                    </a>
                                    <form action="{{ route('admin.projects.destroy', $project) }}" method="POST" onsubmit="return confirm('Delete this project?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
                                            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center">
                                    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                                        <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                                        </svg>
                                    </div>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">No projects yet</p>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first investment project.</p>
                                    <a href="{{ route('admin.projects.create') }}" class="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        New Project
                                    </a>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($projects->hasPages())
            <div class="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-wrap items-center justify-start gap-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span class="font-medium text-gray-700 dark:text-gray-300">{{ $projects->firstItem() }}</span>
                    to <span class="font-medium text-gray-700 dark:text-gray-300">{{ $projects->lastItem() }}</span>
                    of <span class="font-medium text-gray-700 dark:text-gray-300">{{ $projects->total() }}</span> projects
                </p>
                <div class="flex items-center gap-1">
                    @if($projects->onFirstPage())
                        <span class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            Prev
                        </span>
                    @else
                        <a href="{{ $projects->previousPageUrl() }}" class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            Prev
                        </a>
                    @endif

                    @foreach($projects->getUrlRange(1, $projects->lastPage()) as $page => $url)
                        @if($page == $projects->currentPage())
                            <span class="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                                {{ $page }}
                            </span>
                        @else
                            <a href="{{ $url }}" class="inline-flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                {{ $page }}
                            </a>
                        @endif
                    @endforeach

                    @if($projects->hasMorePages())
                        <a href="{{ $projects->nextPageUrl() }}" class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Next
                            <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </a>
                    @else
                        <span class="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed">
                            Next
                            <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </span>
                    @endif
                </div>
            </div>
        @endif
    </div>
@endsection
