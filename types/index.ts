export interface Hotel {
  id: string;
  destination_id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  description: string;
  amenities: string[];
  rooms: Room[];
  checkinTime?: string;
  checkoutTime?: string;
  bookingConditions?: string;
}

export interface Room {
  id: string;
  hotel_id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  view: string;
  size: string;
  amenities: string[];
  badge?: string;
  booked_dates?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  cartId: string;
  hotelId: string;
  hotelName: string;
  hotelSlug: string;
  hotelLocation: string;
  roomId: string;
  roomName: string;
  roomImage: string;
  price: number; // price per night
  currency: string;
  view: string;
  size: string;
  capacity: number;
  checkIn?: string; // "YYYY-MM-DD"
  checkOut?: string; // "YYYY-MM-DD"
  nights?: number;
  totalPrice?: number; // nights × price
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  propertyCount: number;
  image: string;
  description: string;
  highlights: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  avatar?: string;
  role: "USER" | "ADMIN" | "HOTEL_OWNER" | "SUPER_ADMIN";
  isAffiliateMember?: boolean;
}

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface Booking {
  id: string;
  reference: string;
  hotelId: string;
  hotelName: string;
  hotelSlug: string;
  hotelImage: string;
  hotelLocation: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  advancePaid: number;
  balanceDue: number;
  status: BookingStatus;
  bookedOn: string;
  paymentMethod: "stripe" | "uddoktapay";
  currency: string;
}

export interface SearchFormData {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export type Tab = "profile" | "bookings" | "hotels" | "settings" | "affiliates";
export type VendorView = "overview" | "hotels" | "destinations" | "bookings" | "calendar";

export interface CalendarBooking {
  id: string;
  reference: string;
  checkIn: string;
  checkOut: string;
  status: VendorBookingStatus;
  guestName: string;
  guestPhone: string;
}

export interface CalendarUnit {
  id: string;
  unitIndex: number;
  unitName: string;
  floorNumber: number | null;
  bookings: CalendarBooking[];
}

export interface CalendarRoom {
  id: string;
  name: string;
  units: CalendarUnit[];
}

export interface CalendarData {
  hotel: { id: string; name: string };
  startDate: string;
  endDate: string;
  rooms: CalendarRoom[];
}

export interface VendorDashboardStats {
  hotels: { total: number; approved: number; pending: number };
  rooms: { total: number; active: number; pending: number };
  bookings: {
    total: number;
    thisMonth: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  cashouts: {
    pending: number;
    approved: number;
    paid: number;
    eligibleBookings: number;
  };
  revenue: {
    totalRequestedPayout: number;
    thisMonthRequestedPayout: number;
    pendingPayoutAmount: number;
    totalPaidOut: number;
  };
  recentBookings: {
    id: string;
    reference: string;
    status: VendorBookingStatus;
    totalPrice: number;
    advancePaid: number;
    nights: number;
    bookedOn: string;
    checkIn: string;
    checkOut: string;
    cashoutRequest: {
      id: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
      amount: number;
      createdAt: string;
    } | null;
    user: { id: string; name: string; phone: string } | null;
    room: {
      id: string;
      name: string;
      commissionRate: number;
      hotel: { id: string; name: string; slug: string };
    };
  }[];
}
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type VendorBookingStatusFilter = "all" | VendorBookingStatus;

export type HotelFormValues = {
  destinationId: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  price: number;
  tags?: string;
  amenities?: string;
  checkinTime: string;
  checkoutTime: string;
  bookingConditions?: string;
};

export interface VendorRoom {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string[];
  images: string[];
  badge: string | null;
  isActive: boolean;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface VendorHotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  tags: string[];
  amenities: string[];
  checkinTime?: string | null;
  checkoutTime?: string | null;
  bookingConditions?: string | null;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  isActive: boolean;
  destination: { id: string; name: string; region: string };
  rooms: VendorRoom[];
  _count: { rooms: number; reviews: number };
}

export type VendorBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export interface VendorBooking {
  id: string;
  reference: string;
  userId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  roomId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  advancePaid: number;
  balanceDue: number;
  status: VendorBookingStatus;
  paymentMethod: "STRIPE" | "UDDOKTAPAY";
  bookedOn: string;
  cancelledAt: string | null;
  cancelReason: string | null;
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    avatar: string | null;
  } | null;
  room: {
    id: string;
    name: string;
    images: string[];
    price: number;
    hotel: {
      id: string;
      name: string;
      slug: string;
      location: string;
    };
  };
  commissionRate: number;
  commissionAmount: number;
  payoutAmount: number;
  payments: {
    id: string;
    amount: number;
    status: string;
    method: string;
    isAdvance: boolean;
    transactionId: string | null;
    paidAt: string | null;
  }[];
  cashoutRequest: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
    amount: number;
    createdAt: string;
  } | null;
}

export interface BankInfo {
  id: string;
  userId: string;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  bkashNumber: string | null;
  nagadNumber: string | null;
  rocketNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileContentProps {
  user: UserProfile;
  bookings: Booking[];
  onProfileUpdate: (updated: UserProfile) => void;
}

export interface BlogListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: number;
  tags: string[];
  authorName: string;
  authorTitle: string | null;
  authorAvatar: string | null;
  publishedAt: string;
}

export interface BlogPost extends BlogListItem {
  content: string;
  youtubeUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliateBooking {
  id: string;
  reference: string;
  totalPrice: number;
  discountAmount: number;
  bookedOn: string;
  status: string;
  earned: number;
}

export interface AffiliatePromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscountAmount: number | null;
  minBookingAmount: number | null;
  affiliateCommission: number | null;
  usedCount: number;
  isActive: boolean;
  validFrom: string | null;
  validTo: string | null;
}

export interface AffiliateStats {
  promoCode: AffiliatePromoCode | null;
  bookings: AffiliateBooking[];
  totalEarnings: number;
}

export interface VendorDestination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  isFeatured: boolean;
  approvalStatus: ApprovalStatus;
  rejectionReason: string | null;
  _count: { hotels: number };
  createdAt: string;
}
