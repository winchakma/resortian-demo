export interface Hotel {
  id: string;
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
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Destination {
  id: string;
  name: string;
  propertyCount: number;
  image: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SearchFormData {
  location: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}
