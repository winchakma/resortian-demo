export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
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
