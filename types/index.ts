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
}

export interface Room {
  id: string;
  hotel_id: number;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
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
  date: string;
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
  price: number;       // price per night
  currency: string;
  view: string;
  size: string;
  capacity: number;
  checkIn?: string;    // "YYYY-MM-DD"
  checkOut?: string;   // "YYYY-MM-DD"
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
}

export type BookingStatus = "upcoming" | "completed" | "cancelled";

export interface Booking {
  id: string;
  reference: string;
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
