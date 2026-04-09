@extends('admin.layouts.app')

@section('title', 'Users')
@section('page-title', 'Users')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">All Users</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Showing {{ $users->total() }} registered {{ Str::plural('user', $users->total()) }}</p>
        </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">#</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Verified</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Registered</th>
                        <th class="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Details</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                    @forelse ($users as $user)
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ $user->id }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        {{ strtoupper(substr($user->name, 0, 1)) }}
                                    </div>
                                    <span class="font-medium text-gray-900 dark:text-white">{{ $user->name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">{{ $user->phone }}</td>
                            <td class="px-6 py-4">
                                @if ($user->phone_verified_at)
                                    <span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                        Verified
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                        Unverified
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-gray-500 dark:text-gray-400">{{ $user->created_at->format('M d, Y') }}</td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <button onclick="openUserDetailModal({{ $user->id }})" class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-all">
                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>
                                    Details
                                </button>
                            </td>
                        </tr>

                        {{-- User Details Modal --}}
                        <div id="userDetailModal-{{ $user->id }}" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity" onclick="if(event.target===this) closeUserDetailModal({{ $user->id }})">
                            <div class="relative mx-4 w-full max-w-lg transform rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:mx-0">
                                {{-- Modal Header --}}
                                <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">User Details</h3>
                                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ $user->name }} &middot; {{ $user->phone }}</p>
                                    </div>
                                    <button onclick="closeUserDetailModal({{ $user->id }})" class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {{-- Modal Body --}}
                                <div class="mt-4 max-h-[60vh] space-y-5 overflow-y-auto pr-1">
                                    @php $details = $user->details; @endphp

                                    {{-- Personal Information --}}
                                    <div>
                                        <h4 class="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                                            Personal Information
                                        </h4>
                                        <div class="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3.5 dark:bg-gray-800/50">
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">NID Number</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->nid_number ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Date of Birth</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->date_of_birth ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Gender</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->gender ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Photo</span>
                                                @if($details && $details->photo)
                                                    <a href="{{ Storage::url($details->photo) }}" target="_blank" class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Photo</a>
                                                @else
                                                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">N/A</span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Bank Information --}}
                                    <div>
                                        <h4 class="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" /></svg>
                                            Bank Information
                                        </h4>
                                        <div class="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3.5 dark:bg-gray-800/50">
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Bank Name</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->bank_name ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Account Name</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->account_name ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Account Number</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->account_number ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Branch Name</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->branch_name ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Routing Number</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->routing_number ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Swift Code</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->swift_code ?? 'N/A' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {{-- Nominee Information --}}
                                    <div>
                                        <h4 class="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>
                                            Nominee Information
                                        </h4>
                                        <div class="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3.5 dark:bg-gray-800/50">
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nominee Name</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->nominee_name ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nominee NID</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->nominee_nid ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nominee Number</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->nominee_number ?? 'N/A' }}</span>
                                            </div>
                                            <div>
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Relation</span>
                                                <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $details->nominee_relation ?? 'N/A' }}</span>
                                            </div>
                                            <div class="col-span-2">
                                                <span class="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">Nominee Photo</span>
                                                @if($details && $details->nominee_photo)
                                                    <a href="{{ Storage::url($details->nominee_photo) }}" target="_blank" class="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">View Photo</a>
                                                @else
                                                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">N/A</span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {{-- Modal Footer --}}
                                <div class="mt-5 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
                                    <button onclick="closeUserDetailModal({{ $user->id }})" class="rounded-lg bg-gray-100 px-4 py-2 mt-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-16 text-center">
                                <div class="flex flex-col items-center">
                                    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
                                        <svg class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                    </div>
                                    <p class="text-base font-medium text-gray-900 dark:text-white">No users yet</p>
                                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Users will appear here once they register.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if ($users->hasPages())
            <div class="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                {{ $users->links() }}
            </div>
        @endif
    </div>

    {{-- Modal Script --}}
    <script>
        function openUserDetailModal(userId) {
            const modal = document.getElementById('userDetailModal-' + userId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeUserDetailModal(userId) {
            const modal = document.getElementById('userDetailModal-' + userId);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('[id^="userDetailModal-"]').forEach(function(modal) {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    </script>
@endsection
