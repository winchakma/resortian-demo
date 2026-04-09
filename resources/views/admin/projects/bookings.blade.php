@extends('admin.layouts.app')

@section('title', 'Project Bookings')
@section('page-title', 'Project Bookings')

@section('content')
    <!-- Header with Back Button and Project Image -->
    <div class="mb-8 flex flex-col gap-5">
        <!-- Back Button Row -->
        <div>
            <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Back to Projects
            </a>
        </div>

        <!-- Main Header Card -->
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="flex flex-col gap-5">
                <!-- Top Section: Project Info -->
                <div class="flex items-center gap-4">
                    <!-- Project Image -->
                    <div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800 sm:h-16 sm:w-16">
                        @if($project->image)
                            <img src="{{ Storage::url($project->image) }}" alt="{{ $project->title }}" class="h-full w-full object-cover">
                        @else
                            <div class="flex h-full w-full items-center justify-center text-gray-400">
                                <svg class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                        @endif
                    </div>
                    <div class="flex-1 min-w-0">
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl truncate">{{ $project->title }}</h1>
                        <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                            <span>Bookings Management</span>
                            <span class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span>Project #{{ $project->id }}</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid - Responsive Grid Layout -->
                <div class="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:gap-4 sm:rounded-xl sm:border sm:border-gray-100 sm:bg-gray-50/50 sm:px-4 sm:py-2 dark:sm:border-gray-800 dark:sm:bg-gray-800/30">
                    <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30 sm:border-0 sm:bg-transparent sm:p-0 dark:sm:bg-transparent">
                        <span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Unit Price</span>
                        <span class="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">৳{{ number_format($project->unit_price) }}</span>
                    </div>
                    
                    <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30 sm:border-0 sm:bg-transparent sm:p-0 dark:sm:bg-transparent">
                        <span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Bookings</span>
                        <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 sm:text-base">{{ $totalBookingUnits }}</span>
                    </div>
                    
                    <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30 sm:border-0 sm:bg-transparent sm:p-0 dark:sm:bg-transparent">
                        <span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Amount</span>
                        <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 sm:text-base">৳{{ number_format($totalBookingMoney) }}</span>
                    </div>
                    
                    <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30 sm:border-0 sm:bg-transparent sm:p-0 dark:sm:bg-transparent">
                        <span class="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Available</span>
                        <span class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 sm:text-base">{{ $project->available_units ?? $project->total_units }} / {{ $project->total_units }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bookings Table Section -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Booking ID</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Invoice No</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">User</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Quantity</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Booking Date</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Payment Info</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                        <th class="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    @forelse($bookings as $booking)
                        <tr class="group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors">
                            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">#{{ $booking->id }}</td>
                            <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">#{{ $booking->booking_no }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2.5">
                                    {{-- <div class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold">
                                        {{ $booking->user->name[0] }}
                                    </div> --}}
                                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ $booking->user->name }} ({{ $booking->user->phone }})</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {{ $booking->units }} {{ Str::plural('Unit', $booking->units) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-gray-700 dark:text-gray-300 font-medium">
                                    {{ $booking->payment_date ? \Carbon\Carbon::parse($booking->payment_date)->format('M d, Y') : 'N/A' }}
                                </div>
                                <div class="text-xs text-gray-400 mt-0.5">{{ \Carbon\Carbon::parse($booking->created_at)->format('g:i A') }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1.5">
                                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $booking->payment_method ?? 'Unknown Method' }}</span>
                                    @if($booking->payment_status == '1')
                                        <span class="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30">
                                            PAID
                                        </span>
                                    @else
                                        <span class="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30">
                                            UNPAID
                                        </span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                                <div class="flex items-center gap-1.5">
                                    @if($booking->status == 'BOOKED')
                                        <span class="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30 uppercase">
                                            {{ $booking->status }}
                                        </span>
                                    @else
                                        <span class="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-600 ring-1 ring-inset ring-gray-600/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/30 uppercase">
                                            {{ $booking->status ?? 'PENDING' }}
                                        </span>
                                    @endif
                                    @if($booking->is_returned)
                                        <span class="text-gray-400 dark:text-gray-500">/</span>
                                        <span class="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30 uppercase">
                                            Returned
                                        </span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right whitespace-nowrap">
                                <div class="inline-flex items-center gap-2">
                                    {{-- Details Button --}}
                                    <button onclick="openUserDetailModal({{ $booking->id }})" class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-600 hover:text-white dark:bg-gray-800 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-all">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                        Details
                                    </button>

                                    {{-- Receipt Button --}}
                                    @if($booking->payment_receipt)
                                        <a href="{{ Storage::url($booking->payment_receipt) }}" target="_blank" class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-gray-800 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white transition-all">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            Receipt
                                        </a>
                                    @else
                                        <span class="text-gray-400 text-[11px] font-medium tracking-wide">NO RECEIPT</span>
                                    @endif

                                    {{-- Invoice Button --}}
                                    @if($booking->status === 'BOOKED')
                                        <button onclick="openInvoiceModal({{ $booking->id }})" class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-600 hover:text-white dark:bg-gray-800 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white transition-all">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                            Invoice
                                        </button>
                                    @endif
                                </div>
                                <div class="relative inline-block text-left">
                                    <button onclick="toggleActionDropdown({{ $booking->id }})" class="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-all">
                                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                        </svg>
                                        Actions
                                    </button>
                                    <div id="actionDropdown-{{ $booking->id }}" class="hidden fixed z-[9999] w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                        {{-- Mark as Returned / Booked --}}
                                        @if($booking->is_returned)
                                            <form action="{{ url('admin/project/booking/' . $booking->id . '/mark-unmark') }}" method="POST" onsubmit="return confirm('Are you sure you want to mark this booking as Booked?')">
                                                @csrf
                                                <input type="hidden" name="is_returned" value="0">
                                                <input type="hidden" name="return_percent" value="0">
                                                <button type="submit" class="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-indigo-600 hover:bg-gray-50 dark:text-indigo-400 dark:hover:bg-gray-700/50 transition-colors">
                                                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                    Mark as Booked
                                                </button>
                                            </form>
                                        @else
                                            <button type="button" onclick="openReturnPercentModal({{ $booking->id }})" class="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-amber-600 hover:bg-gray-50 dark:text-amber-400 dark:hover:bg-gray-700/50 transition-colors">
                                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 12 12m0 0 3-3m-3 3-3-3m3 3 3 3m3-12.038A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751Z" />
                                                </svg>
                                                Mark as Returned
                                            </button>
                                        @endif

                                        <div class="my-1 border-t border-gray-100 dark:border-gray-700"></div>

                                        {{-- Delete Booking --}}
                                        <form action="{{ url('admin/project/booking/' . $booking->id . '/delete') }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this booking? This action cannot be undone.')">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="flex w-full items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors">
                                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                                Delete Booking
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {{-- User Details Modal for Booking #{{ $booking->id }} --}}
                        <div id="userDetailModal-{{ $booking->id }}" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity" onclick="if(event.target===this) closeUserDetailModal({{ $booking->id }})">
                            <div class="relative mx-4 w-full max-w-lg transform rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:mx-0">
                                {{-- Modal Header --}}
                                <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">User Details</h3>
                                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ $booking->user->name }} &middot; {{ $booking->user->phone }}</p>
                                    </div>
                                    <button onclick="closeUserDetailModal({{ $booking->id }})" class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {{-- Modal Body --}}
                                <div class="mt-4 max-h-[60vh] space-y-5 overflow-y-auto pr-1">
                                    @php $details = $booking->user->details; @endphp

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
                                                @if($details->photo)
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
                                                @if($details->nominee_photo)
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
                                    <button onclick="closeUserDetailModal({{ $booking->id }})" class="rounded-lg bg-gray-100 px-4 py-2 mt-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>

                        {{-- Invoice Modal for Booking #{{ $booking->id }} --}}
                        @if($booking->status === 'BOOKED')
                        <div id="invoiceModal-{{ $booking->id }}" class="fixed inset-0 z-50 hidden items-center justify-center" style="background-color:rgba(0,0,0,0.6);backdrop-filter:blur(4px)" onclick="if(event.target===this) closeInvoiceModal({{ $booking->id }})">
                            <div class="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl" style="max-height:90vh;overflow:auto;margin:1rem">
                                {{-- Modal Header --}}
                                <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 rounded-t-2xl">
                                    <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <svg class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                                        Invoice
                                    </h2>
                                    <div class="flex items-center gap-2">
                                        <button onclick="downloadInvoicePdf({{ $booking->id }})" id="downloadBtn-{{ $booking->id }}" class="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60">
                                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                            <span>Download PDF</span>
                                        </button>
                                        <button onclick="closeInvoiceModal({{ $booking->id }})" class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {{-- Invoice Content (captured for PDF) --}}
                                @php
                                    $invoiceNo = $booking->booking_no ?? 'AGV-' . str_pad($booking->id, 5, '0', STR_PAD_LEFT);
                                    $unitPrice = $project->unit_price ?? 0;
                                    $totalAmount = $booking->units * $unitPrice;
                                    $invoiceDate = \Carbon\Carbon::parse($booking->created_at)->format('d M Y');
                                    $pDate = $booking->payment_date ? \Carbon\Carbon::parse($booking->payment_date)->format('d M Y') : 'N/A';
                                @endphp
                                <div id="invoiceContent-{{ $booking->id }}" style="background-color:#ffffff;padding:32px;font-family:'Inter','Segoe UI',system-ui,-apple-system,sans-serif">
                                    {{-- Top accent bar --}}
                                    <div style="height:4px;background:linear-gradient(90deg,#059669,#10b981,#34d399);border-radius:2px;margin-bottom:28px"></div>

                                    {{-- Company Header --}}
                                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px">
                                        <div>
                                            <img 
                                                src="{{ asset('images/logo.png') }}" 
                                                alt="Logo" style="height:100px;object-fit:cover; margin-top:-30px"
                                            />
                                        </div>
                                        <div style="text-align:right">
                                            <div style="font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:1.5px">Invoice</div>
                                            <div style="font-size:20px;font-weight:800;color:#111827;margin-top:2px">{{ $invoiceNo }}</div>
                                        </div>
                                    </div>

                                    {{-- Dates & Investor info --}}
                                    <div style="display:flex;gap:16px;margin-bottom:24px">
                                        <div style="flex:1;background:#f9fafb;border-radius:10px;padding:14px 16px">
                                            <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px">Billed To</div>
                                            <div style="font-size:14px;font-weight:700;color:#111827">{{ $booking->user->name ?? 'N/A' }}</div>
                                            <div style="font-size:12px;color:#6b7280;margin-top:2px">{{ $booking->user->phone ?? 'N/A' }}</div>
                                        </div>
                                        <div style="flex:1;background:#f9fafb;border-radius:10px;padding:14px 16px">
                                            <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px">Invoice Date</div>
                                            <div style="font-size:14px;font-weight:700;color:#111827">{{ $invoiceDate }}</div>
                                            <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-top:10px;margin-bottom:6px">Payment Date</div>
                                            <div style="font-size:14px;font-weight:700;color:#111827">{{ $pDate }}</div>
                                        </div>
                                    </div>

                                    {{-- Table --}}
                                    <div style="border-radius:10px;border:1px solid #e5e7eb;margin-bottom:20px">
                                        <div style="display:flex;background:#f3f4f6;padding:10px 16px;font-size:10px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;border-top-left-radius:10px;border-top-right-radius:10px">
                                            <div style="flex:3">Description</div>
                                            <div style="flex:1;text-align:center">Qty</div>
                                            <div style="flex:1.2;text-align:right">Unit Price</div>
                                            <div style="flex:1.2;text-align:right">Amount</div>
                                        </div>
                                        <div style="display:flex;padding:14px 16px;align-items:center;border-top:1px solid #e5e7eb">
                                            <div style="flex:3">
                                                <div style="font-size:13px;font-weight:600;color:#111827">{{ $project->title }}</div>
                                                <div style="font-size:11px;color:#9ca3af;margin-top:2px">Project ID: #{{ $project->id }}</div>
                                            </div>
                                            <div style="flex:1;text-align:center;font-size:13px;font-weight:600;color:#111827">{{ $booking->units }}</div>
                                            <div style="flex:1.2;text-align:right;font-size:13px;font-weight:600;color:#111827">৳{{ number_format($unitPrice) }}</div>
                                            <div style="flex:1.2;text-align:right;font-size:13px;font-weight:600;color:#111827">৳{{ number_format($totalAmount) }}</div>
                                        </div>
                                        <div style="display:flex;padding:12px 16px;align-items:center;border-top:2px solid #e5e7eb;background:#f9fafb;border-bottom-left-radius:10px;border-bottom-right-radius:10px">
                                            <div style="flex:3;font-size:13px;font-weight:700;color:#111827">Total</div>
                                            <div style="flex:1"></div>
                                            <div style="flex:1.2"></div>
                                            <div style="flex:1.2;text-align:right;font-size:15px;font-weight:800;color:#059669">৳{{ number_format($totalAmount) }}</div>
                                        </div>
                                    </div>

                                    {{-- Payment Details --}}
                                    <div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:20px">
                                        <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px">Payment Information</div>
                                        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                                            <span style="font-size:12px;color:#6b7280">Payment Method</span>
                                            <span style="font-size:12px;font-weight:600;color:#111827">{{ $booking->payment_method ?? 'N/A' }}</span>
                                        </div>
                                        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                                            <span style="font-size:12px;color:#6b7280">Payment Status</span>
                                            <span style="font-size:12px;font-weight:600;color:{{ $booking->payment_status == '1' ? '#059669' : '#d97706' }}">{{ $booking->payment_status == '1' ? '✓ Verified' : 'Pending' }}</span>
                                        </div>
                                        <div style="display:flex;justify-content:space-between">
                                            <span style="font-size:12px;color:#6b7280">Booking ID</span>
                                            <span style="font-size:12px;font-weight:600;color:#111827">#{{ $booking->id }}</span>
                                        </div>
                                    </div>

                                    {{-- Divider --}}
                                    <div style="height:1px;background:#e5e7eb;margin:20px 0"></div>

                                    {{-- Footer --}}
                                    <div style="text-align:center">
                                        <div style="font-size:11px;color:#9ca3af;line-height:1.6">
                                            Thank you for investing with AgroVenture<br>
                                            This is a system-generated invoice and does not require a signature.
                                        </div>
                                        <div style="font-size:10px;color:#d1d5db;margin-top:8px">
                                            Generated on {{ now()->format('d M Y') }}
                                        </div>
                                    </div>

                                    {{-- Bottom accent bar --}}
                                    <div style="height:4px;background:linear-gradient(90deg,#059669,#10b981,#34d399);border-radius:2px;margin-top:24px"></div>
                                </div>
                            </div>
                        </div>
                        @endif

                        {{-- Return Percent Modal for Booking #{{ $booking->id }} --}}
                        @if(!$booking->is_returned)
                        @php
                            $returnStr = $project->return ?? '0%';
                            if (str_contains($returnStr, '-')) {
                                $parts = explode('-', $returnStr);
                                $returnMin = (float) trim(str_replace('%', '', $parts[0]));
                                $returnMax = (float) trim(str_replace('%', '', $parts[1]));
                            } else {
                                $returnMin = (float) trim(str_replace('%', '', $returnStr));
                                $returnMax = $returnMin;
                            }
                        @endphp
                        <div id="returnPercentModal-{{ $booking->id }}" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity" onclick="if(event.target===this) closeReturnPercentModal({{ $booking->id }})">
                            <div class="relative mx-4 w-full max-w-md transform rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl transition-all dark:border-gray-700 dark:bg-gray-900 sm:mx-0">
                                {{-- Modal Header --}}
                                <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">Set Return Percentage</h3>
                                        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Booking #{{ $booking->id }} &middot; {{ $booking->user->name }}</p>
                                    </div>
                                    <button onclick="closeReturnPercentModal({{ $booking->id }})" class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors">
                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {{-- Modal Body --}}
                                <form id="returnPercentForm-{{ $booking->id }}" action="{{ url('admin/project/booking/' . $booking->id . '/mark-unmark') }}" method="POST">
                                    @csrf
                                    <input type="hidden" name="is_returned" value="1">
                                    <div class="mt-4 space-y-4">
                                        {{-- Info Card --}}
                                        <div class="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                                            <div class="flex items-start gap-3">
                                                <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-800/40">
                                                    <svg class="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">Project Return Range</p>
                                                    <p class="mt-0.5 text-2xl font-bold text-amber-700 dark:text-amber-400">{{ $project->return }}</p>
                                                    <p class="mt-1 text-xs text-amber-600/80 dark:text-amber-400/70">Enter a return percentage within this range</p>
                                                </div>
                                            </div>
                                        </div>

                                        {{-- Input --}}
                                        <div>
                                            <label for="return_percent_input_{{ $booking->id }}" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Return Percentage (%)</label>
                                            <div class="relative">
                                                <input
                                                    type="number"
                                                    id="return_percent_input_{{ $booking->id }}"
                                                    name="return_percent"
                                                    step="0.01"
                                                    min="{{ $returnMin }}"
                                                    max="{{ $returnMax }}"
                                                    placeholder="e.g. {{ number_format(($returnMin + $returnMax) / 2, 1) }}"
                                                    required
                                                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
                                                    oninput="validateReturnPercent({{ $booking->id }}, {{ $returnMin }}, {{ $returnMax }})"
                                                />
                                                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400"> %</span>
                                            </div>
                                            <p id="returnPercentError-{{ $booking->id }}" class="mt-1.5 hidden text-xs font-medium text-red-500 dark:text-red-400"></p>
                                            <p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">Must be between {{ number_format($returnMin, 1) }}% and {{ number_format($returnMax, 1) }}%</p>
                                        </div>
                                    </div>

                                    {{-- Modal Footer --}}
                                    <div class="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800" style="margin-top: 10px;">
                                        <button type="button" onclick="closeReturnPercentModal({{ $booking->id }})" class="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit" id="returnPercentSubmitBtn-{{ $booking->id }}" disabled class="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
                                            Confirm Return
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        @endif

                    @empty
                        <tr>
                            <td colspan="8" class="px-6 py-24 text-center">
                                <div class="mx-auto flex max-w-[320px] flex-col items-center py-4">
                                    <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50 text-gray-400 dark:bg-gray-800/50">
                                        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">No Bookings Found</h3>
                                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">There are no booking records for this project yet. Please check back later or verify your search criteria.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($bookings->hasPages())
            <div class="border-t border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                {{ $bookings->links() }}
            </div>
        @endif
    </div>

    {{-- Inter Font --}}
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">

    {{-- Modal & Dropdown Toggle Script --}}
    <script>
        function openUserDetailModal(bookingId) {
            const modal = document.getElementById('userDetailModal-' + bookingId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeUserDetailModal(bookingId) {
            const modal = document.getElementById('userDetailModal-' + bookingId);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        }

        function toggleActionDropdown(bookingId) {
            // Close all other open dropdowns and reset their parent z-index
            document.querySelectorAll('[id^="actionDropdown-"]').forEach(function(dropdown) {
                if (dropdown.id !== 'actionDropdown-' + bookingId) {
                    dropdown.classList.add('hidden');
                    const parentTd = dropdown.closest('td');
                    if (parentTd) {
                        parentTd.style.position = '';
                        parentTd.style.zIndex = '';
                    }
                }
            });
            const dropdown = document.getElementById('actionDropdown-' + bookingId);
            if (dropdown) {
                const isHidden = dropdown.classList.contains('hidden');
                const parentTd = dropdown.closest('td');
                if (isHidden) {
                    // Find the trigger button (parent of dropdown)
                    const button = dropdown.previousElementSibling || dropdown.parentElement.querySelector('button');
                    const rect = button.getBoundingClientRect();
                    const dropdownHeight = 120; // approximate height of dropdown
                    const viewportHeight = window.innerHeight;

                    // Position horizontally: align right edge with button right edge
                    dropdown.style.left = (rect.right - 192) + 'px'; // 192px = w-48 = 12rem

                    // If not enough space below, open upward
                    if (rect.bottom + dropdownHeight > viewportHeight) {
                        dropdown.style.top = (rect.top - dropdownHeight) + 'px';
                    } else {
                        dropdown.style.top = (rect.bottom + 4) + 'px';
                    }

                    // Elevate parent td so dropdown stacks above other rows
                    if (parentTd) {
                        parentTd.style.position = 'relative';
                        parentTd.style.zIndex = '9999';
                    }

                    dropdown.classList.remove('hidden');
                } else {
                    dropdown.classList.add('hidden');
                    if (parentTd) {
                        parentTd.style.position = '';
                        parentTd.style.zIndex = '';
                    }
                }
            }
        }

        // Close dropdowns and modals on click outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('[id^="actionDropdown-"]') && !e.target.closest('button[onclick^="toggleActionDropdown"]')) {
                document.querySelectorAll('[id^="actionDropdown-"]').forEach(function(dropdown) {
                    dropdown.classList.add('hidden');
                    const parentTd = dropdown.closest('td');
                    if (parentTd) {
                        parentTd.style.position = '';
                        parentTd.style.zIndex = '';
                    }
                });
            }
        });

        // Invoice modal functions
        function openInvoiceModal(bookingId) {
            const modal = document.getElementById('invoiceModal-' + bookingId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
            }
        }

        function closeInvoiceModal(bookingId) {
            const modal = document.getElementById('invoiceModal-' + bookingId);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }
        }

        function downloadInvoicePdf(bookingId) {
            const content = document.getElementById('invoiceContent-' + bookingId);
            if (!content) return;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invoice</title>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; }
                        @media print {
                            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>${content.outerHTML}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.onload = function() {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            };
        }

        // Return Percent modal functions
        function openReturnPercentModal(bookingId) {
            // Close the action dropdown first
            const dropdown = document.getElementById('actionDropdown-' + bookingId);
            if (dropdown) {
                dropdown.classList.add('hidden');
                const parentTd = dropdown.closest('td');
                if (parentTd) {
                    parentTd.style.position = '';
                    parentTd.style.zIndex = '';
                }
            }

            const modal = document.getElementById('returnPercentModal-' + bookingId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                document.body.style.overflow = 'hidden';
                // Focus the input
                const input = document.getElementById('return_percent_input_' + bookingId);
                if (input) {
                    setTimeout(() => input.focus(), 100);
                }
            }
        }

        function closeReturnPercentModal(bookingId) {
            const modal = document.getElementById('returnPercentModal-' + bookingId);
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
                // Reset the form
                const input = document.getElementById('return_percent_input_' + bookingId);
                if (input) input.value = '';
                const error = document.getElementById('returnPercentError-' + bookingId);
                if (error) { error.classList.add('hidden'); error.textContent = ''; }
                const btn = document.getElementById('returnPercentSubmitBtn-' + bookingId);
                if (btn) btn.disabled = true;
            }
        }

        function validateReturnPercent(bookingId, min, max) {
            const input = document.getElementById('return_percent_input_' + bookingId);
            const error = document.getElementById('returnPercentError-' + bookingId);
            const btn = document.getElementById('returnPercentSubmitBtn-' + bookingId);
            const value = parseFloat(input.value);

            if (input.value === '' || isNaN(value)) {
                error.classList.add('hidden');
                error.textContent = '';
                btn.disabled = true;
                return;
            }

            if (value < min || value > max) {
                error.textContent = 'Value must be between ' + min.toFixed(1) + '% and ' + max.toFixed(1) + '%';
                error.classList.remove('hidden');
                btn.disabled = true;
            } else {
                error.classList.add('hidden');
                error.textContent = '';
                btn.disabled = false;
            }
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('[id^="userDetailModal-"]').forEach(function(modal) {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }
                });
                document.querySelectorAll('[id^="invoiceModal-"]').forEach(function(modal) {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }
                });
                document.querySelectorAll('[id^="returnPercentModal-"]').forEach(function(modal) {
                    if (!modal.classList.contains('hidden')) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }
                });
                document.querySelectorAll('[id^="actionDropdown-"]').forEach(function(dropdown) {
                    dropdown.classList.add('hidden');
                    const parentTd = dropdown.closest('td');
                    if (parentTd) {
                        parentTd.style.position = '';
                        parentTd.style.zIndex = '';
                    }
                });
            }
        });
    </script>
@endsection