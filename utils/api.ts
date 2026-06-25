import type {
  Hotel,
  Room,
  Destination,
  FooterColumn,
  NavLink,
  SearchFormData,
  Review,
  UserProfile,
  Booking,
  BlogListItem,
  BlogPost,
} from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const API_BASE =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function imageUrl(path: string): string {
  if (!path || path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

// Raw shapes returned by the real API ─────────────────────────────────────────

interface ApiRoom {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  view: string;
  size: string;
  amenities: string[];
  images: string[];
  badge?: string;
  isActive: boolean;
}

interface ApiHotel {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  amenities: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  destination?: { id: string; name: string; region: string };
  rooms?: ApiRoom[];
  checkinTime?: string;
  checkoutTime?: string;
  bookingConditions?: string;
}

interface ApiReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ApiDestination {
  id: string;
  name: string;
  region: string;
  description: string;
  image: string;
  highlights: string[];
  propertyCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

function normalizeRoom(r: ApiRoom): Room {
  return {
    id: r.id,
    hotel_id: r.hotelId,
    name: r.name,
    description: r.description,
    price: r.price,
    capacity: r.capacity,
    view: r.view,
    size: r.size,
    amenities: r.amenities,
    images: r.images.map(imageUrl),
    badge: r.badge,
  };
}

function normalizeHotel(h: ApiHotel): Hotel {
  return {
    id: h.id,
    destination_id: h.destination?.id ?? "",
    name: h.name,
    slug: h.slug,
    location: h.location,
    description: h.description,
    image: imageUrl(h.image),
    price: h.price,
    currency: h.currency,
    rating: h.rating,
    reviewCount: h.reviewCount,
    tags: h.tags,
    amenities: h.amenities,
    rooms: h.rooms ? h.rooms.map(normalizeRoom) : [],
    checkinTime: h.checkinTime,
    checkoutTime: h.checkoutTime,
    bookingConditions: h.bookingConditions,
  };
}

function normalizeDestination(d: ApiDestination): Destination {
  return {
    id: d.id,
    name: d.name,
    region: d.region,
    description: d.description,
    image: imageUrl(d.image),
    highlights: d.highlights,
    propertyCount: d.propertyCount,
  };
}

export async function getNavLinks(): Promise<NavLink[]> {
  await delay(100);
  return [
    { label: "Home", href: "/" },
    { label: "Hotels", href: "/hotels" },
    { label: "Destinations", href: "/destinations" },
    { label: "Deals & Offers", href: "/deals" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];
}

export async function getFeaturedStays(): Promise<Hotel[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);
    const res = await fetch(
      `${API_BASE}/hotels/featured?limit=8&isActive=true`,
      {
        next: { revalidate: 300 },
        signal: controller.signal,
      },
    );
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ApiHotel[] = await res.json();
    return data.map(normalizeHotel);
  } catch {
    return getMockHotels();
  }
}

// ─── Mock data kept for pages not yet connected to the real API ───────────────

async function getMockHotels(): Promise<Hotel[]> {
  await delay(200);
  return [
    {
      id: "1",
      destination_id: "1",
      name: "Chuti Resort Cox's Bazar",
      slug: "chuti-resort-coxs-bazar",
      location: "Marine Drive, Teknaf, Cox's Bazar",
      price: 3000,
      currency: "BDT",
      rating: 4.8,
      reviewCount: 234,
      image: "/images/hotels/hotel1.jpg",
      tags: ["Luxury", "Spa"],
      description:
        "Nestled in the lush tea gardens of Sylhet, The Royal Resort & Spa offers an unmatched sanctuary of luxury and tranquility. Guests enjoy world-class spa treatments, an infinity pool overlooking the hills, and farm-to-table dining that celebrates the flavors of Bangladesh.",
      amenities: ["Pool", "WiFi", "Spa", "Restaurant", "AC", "Parking"],
      rooms: [
        {
          id: "1",
          hotel_id: "1",
          name: "Standard Room",
          description:
            "Comfortable room with garden view and modern furnishings.",
          price: 3600,
          capacity: 2,
          view: "Garden View",
          size: "28 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Best Value",
          booked_dates: ["2026-04-11", "2026-04-12"],
        },
        {
          id: "2",
          hotel_id: "1",
          name: "Deluxe Room",
          description:
            "Spacious room with upgraded furnishings and tea garden view.",
          price: 5500,
          capacity: 2,
          view: "Tea Garden View",
          size: "38 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony"],
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          ],
          booked_dates: ["2026-04-16", "2026-04-19"],
        },
        {
          id: "3",
          hotel_id: "1",
          name: "Executive Suite",
          description:
            "Luxurious suite with separate living area and panoramic views.",
          price: 8800,
          capacity: 4,
          view: "Panoramic View",
          size: "65 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          ],
          badge: "Most Popular",
          booked_dates: ["2026-04-17", "2026-04-18"],
        },
      ],
    },
    {
      id: "2",
      destination_id: "2",
      name: "Queen Island Resort",
      slug: "queen-island-resort",
      location: "Char Fasson, Bhola",
      price: 2000,
      currency: "BDT",
      rating: 4.6,
      reviewCount: 189,
      image: "/images/hotels/hotel2.jpg",
      tags: ["Beachfront"],
      description:
        "Wake up to the sound of waves at Cox's Bazar Ocean Paradise, set right on the world's longest natural sea beach. Every room offers breathtaking ocean views, while our beachside restaurant serves the freshest seafood catch of the day.",
      amenities: ["Pool", "WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: "2",
          name: "Standard Room",
          description:
            "Cozy room with partial sea view and all essential comforts.",
          price: 3600,
          capacity: 2,
          view: "Partial Sea View",
          size: "26 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: "2",
          name: "Ocean View Suite",
          description:
            "Stunning suite with full ocean view and private balcony.",
          price: 7200,
          capacity: 3,
          view: "Full Ocean View",
          size: "55 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          images: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
          ],
          badge: "Sea Front",
          booked_dates: ["2026-04-25", "2026-04-27"],
        },
      ],
    },
    {
      id: "3",
      destination_id: "3",
      name: "Kazi Resort",
      slug: "kazi-resort",
      location: "Suryanarayanpur, Kapasia, Pabur Daibari Road, Gazipur",
      price: 10000,
      currency: "BDT",
      rating: 4.5,
      reviewCount: 312,
      image: "/images/hotels/hotel3.jpg",
      tags: ["Business"],
      description:
        "The Dhaka Grand Hotel stands at the heart of the city, offering premium business facilities and elegant accommodation. With state-of-the-art conference rooms, high-speed connectivity, and a rooftop restaurant with panoramic city views, it is the preferred choice for business travelers.",
      amenities: ["WiFi", "Gym", "Restaurant", "AC", "Parking", "Spa"],
      rooms: [
        {
          id: "1",
          hotel_id: "3",
          name: "Standard Room",
          description: "Modern room with city view and high-speed WiFi.",
          price: 2800,
          capacity: 2,
          view: "City View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          booked_dates: ["2026-04-22", "2026-04-23"],
        },
        {
          id: "2",
          hotel_id: "3",
          name: "Business Suite",
          description:
            "Spacious suite with dedicated work desk and premium amenities.",
          price: 5500,
          capacity: 2,
          view: "Skyline View",
          size: "48 m²",
          amenities: ["WiFi", "TV", "AC", "Work Desk", "Mini-bar"],
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          ],
          badge: "Business Pick",
          booked_dates: [
            "2026-04-25",
            "2026-04-26",
            "2026-04-27",
            "2026-04-28",
          ],
        },
        {
          id: "3",
          hotel_id: "3",
          name: "Executive Suite",
          description: "Luxurious suite with panoramic city skyline views.",
          price: 8800,
          capacity: 4,
          view: "Panoramic City View",
          size: "70 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar", "Jacuzzi"],
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          ],
          badge: "Most Popular",
          booked_dates: ["2026-04-21", "2026-04-22"],
        },
      ],
    },
    {
      id: "4",
      destination_id: "4",
      name: "Hotel Mount Inn",
      slug: "hotel-mount-inn",
      location: "Khagrachari",
      price: 3000,
      currency: "BDT",
      rating: 4.7,
      reviewCount: 156,
      image: "/images/hotels/hotel4.jpg",
      tags: ["Eco", "Nature"],
      description:
        "Immerse yourself in the raw beauty of the Sundarbans mangrove forest at our award-winning eco resort. Built using sustainable materials with minimal environmental impact, we offer guided forest treks, boat safaris for Royal Bengal Tiger spotting, and birdwatching experiences.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Pool"],
      rooms: [
        {
          id: "1",
          hotel_id: "4",
          name: "Forest Cabin",
          description:
            "Rustic cabin nestled in the mangroves with forest views.",
          price: 2800,
          capacity: 2,
          view: "Forest View",
          size: "32 m²",
          amenities: ["WiFi", "AC", "Nature Deck"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Eco Pick",
        },
        {
          id: "2",
          hotel_id: "4",
          name: "Deluxe Bungalow",
          description:
            "Spacious bungalow with private deck overlooking the river.",
          price: 4500,
          capacity: 3,
          view: "River View",
          size: "50 m²",
          amenities: ["WiFi", "TV", "AC", "Private Deck"],
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          ],
          badge: "Most Popular",
          booked_dates: ["2026-04-26", "2026-04-27", "2026-04-28"],
        },
      ],
    },
    {
      id: "5",
      destination_id: "1",
      name: "Lakeshore Resort",
      slug: "lakeshore-resort",
      location: "Kaptai, Rangamati",
      price: 8000,
      currency: "BDT",
      rating: 4.4,
      reviewCount: 98,
      image: "/images/hotels/hotel5.jpg",
      tags: ["Hill View"],
      description:
        "Perched high in the Chittagong Hill Tracts, Bandarban Hill Resort offers spectacular views of mist-covered mountains and lush green valleys. A perfect base for trekking to Boga Lake or exploring the indigenous hill tribe villages nearby.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: "5",
          name: "Hill View Room",
          description: "Cozy room with panoramic hill and valley views.",
          price: 2200,
          capacity: 2,
          view: "Hill View",
          size: "28 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Best Value",
          booked_dates: ["2026-04-26", "2026-04-27", "2026-04-28"],
        },
        {
          id: "2",
          hotel_id: "5",
          name: "Mountain Suite",
          description:
            "Elevated suite with wrap-around balcony and sunrise views.",
          price: 4200,
          capacity: 3,
          view: "Mountain View",
          size: "45 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony"],
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          ],
          badge: "Scenic Best",
        },
      ],
    },
    {
      id: "6",
      destination_id: "5",
      name: "Grand Sylhet Hotel and Resort",
      slug: "grand-sylhet-hotel-resort",
      location: "Boroshala, Khadimnagar, Airport Road, Sylhet",
      price: 10000,
      currency: "BDT",
      rating: 4.3,
      reviewCount: 145,
      image: "/images/hotels/hotel3.jpg",
      tags: ["Lake View"],
      description:
        "Situated on the serene banks of Kaptai Lake, Rangamati Lake View Hotel is your gateway to the tranquil beauty of the Chittagong Hill Tracts. Enjoy boat rides on the shimmering lake, explore the Hanging Bridge, and savor traditional Chakma cuisine.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Pool"],
      rooms: [
        {
          id: "1",
          hotel_id: "6",
          name: "Lake View Room",
          description:
            "Bright room with direct lake view and wooden interiors.",
          price: 2500,
          capacity: 2,
          view: "Lake View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Best Value",
          booked_dates: ["2026-04-28", "2026-04-29"],
        },
        {
          id: "2",
          hotel_id: "6",
          name: "Lakeside Suite",
          description:
            "Premium suite with private jetty access and lake panorama.",
          price: 5000,
          capacity: 4,
          view: "Full Lake View",
          size: "58 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          ],
          badge: "Most Popular",
          booked_dates: ["2026-04-29", "2026-04-30"],
        },
      ],
    },
    {
      id: "7",
      destination_id: "6",
      name: "Cloudy Inn Resort",
      slug: "cloudy-inn-resort",
      location: "Golden Buddha Temple Area, Kana Para Road, Bandarban",
      price: 4000,
      currency: "BDT",
      rating: 4.2,
      reviewCount: 203,
      image: "/images/hotels/hotel4.jpg",
      tags: ["City"],
      description:
        "Conveniently located in the heart of Chittagong, Harbour Inn offers comfortable accommodation with easy access to the port city's attractions. From the historic Patenga Beach to the vibrant Keranihat market, everything is within reach.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: "7",
          name: "Standard Room",
          description:
            "Well-appointed room with city view and modern amenities.",
          price: 1800,
          capacity: 2,
          view: "City View",
          size: "25 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          booked_dates: ["2026-04-29", "2026-04-30"],
        },
        {
          id: "2",
          hotel_id: "7",
          name: "Deluxe Room",
          description:
            "Spacious room with upgraded furnishings and harbour view.",
          price: 2800,
          capacity: 2,
          view: "Harbour View",
          size: "35 m²",
          amenities: ["WiFi", "TV", "AC", "Mini-bar"],
          images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          ],
          badge: "Harbour View",
        },
      ],
    },
    {
      id: "8",
      destination_id: "7",
      name: "Chuti Resort Purbachal",
      slug: "chuti-resort-purbachal",
      location: "Rathura, Nagori, Purbachal, Dhaka",
      price: 4000,
      currency: "BDT",
      rating: 4.9,
      reviewCount: 87,
      image: "/images/hotels/hotel1.jpg",
      tags: ["Island", "Premium"],
      description:
        "Bangladesh's only coral island, Saint Martin is a paradise of crystal-clear waters and pristine beaches. Our premium island resort offers an intimate escape with snorkeling, diving, and sunset cruises — all set against a backdrop of coconut palms and turquoise sea.",
      amenities: ["Pool", "WiFi", "Spa", "Restaurant", "AC", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: "8",
          name: "Island Cottage",
          description:
            "Charming cottage steps from the beach with ocean breeze.",
          price: 4500,
          capacity: 2,
          view: "Ocean View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          ],
          badge: "Best Value",
          booked_dates: ["2026-04-23", "2026-04-24"],
        },
        {
          id: "2",
          hotel_id: "8",
          name: "Beachfront Villa",
          description:
            "Private villa with direct beach access and outdoor shower.",
          price: 8500,
          capacity: 4,
          view: "Beachfront",
          size: "75 m²",
          amenities: ["WiFi", "TV", "AC", "Private Pool", "Butler Service"],
          images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          ],
          badge: "Premium Pick",
          booked_dates: ["2026-04-23", "2026-04-24", "2026-04-25"],
        },
      ],
    },
  ];
}

const ALL_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Cox's Bazar",
    region: "Chittagong Division",
    propertyCount: 120,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    description:
      "Home to the world's longest natural sea beach stretching 120 km, Cox's Bazar is Bangladesh's premier coastal destination. Crystal-clear waters, golden sands, and vibrant local markets make it an unmissable getaway.",
    highlights: ["Sea Beach", "Seafood", "Sunset Views", "Water Sports"],
  },
  {
    id: "2",
    name: "Sylhet",
    region: "Sylhet Division",
    propertyCount: 85,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop",
    description:
      "Blanketed by emerald tea gardens, Sylhet enchants with its rolling hills, gushing waterfalls, and centuries-old shrines. The spiritual aura of Hazrat Shah Jalal's shrine and the serene beauty of Ratargul Swamp Forest await.",
    highlights: ["Tea Gardens", "Waterfalls", "Hakaluki Haor", "Heritage"],
  },
  {
    id: "3",
    name: "Bandarban",
    region: "Chittagong Hill Tracts",
    propertyCount: 45,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
    description:
      "Perched among Bangladesh's highest peaks, Bandarban is a trekker's paradise. Mist-draped mountains, indigenous hill tribe cultures, Boga Lake, and the Nilgiri hills offer a raw, adventurous escape far from city life.",
    highlights: ["Trekking", "Boga Lake", "Nilgiri Hills", "Hill Tribes"],
  },
  {
    id: "4",
    name: "Sundarbans",
    region: "Khulna Division",
    propertyCount: 30,
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=500&fit=crop",
    description:
      "The world's largest mangrove forest and a UNESCO World Heritage Site. Home to the majestic Royal Bengal Tiger, saltwater crocodiles, and thousands of bird species — the Sundarbans is nature at its most untamed.",
    highlights: [
      "Royal Bengal Tiger",
      "Mangroves",
      "UNESCO Site",
      "Boat Safari",
    ],
  },
  {
    id: "5",
    name: "Dhaka",
    region: "Dhaka Division",
    propertyCount: 200,
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop",
    description:
      "Bangladesh's vibrant capital pulses with energy, history, and culture. From the Mughal grandeur of Lalbagh Fort and the old lanes of Puran Dhaka to cutting-edge restaurants and rooftop bars, Dhaka never sleeps.",
    highlights: ["Lalbagh Fort", "Old Dhaka", "Fine Dining", "Shopping"],
  },
  {
    id: "6",
    name: "Rangamati",
    region: "Chittagong Hill Tracts",
    propertyCount: 38,
    image:
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop",
    description:
      "Cradled by the shimmering Kaptai Lake and lush green hills, Rangamati is a tranquil hill district known for its hanging bridge, indigenous Chakma culture, handicrafts, and peaceful boat rides through emerald-green waters.",
    highlights: [
      "Kaptai Lake",
      "Hanging Bridge",
      "Chakma Culture",
      "Handicrafts",
    ],
  },
  {
    id: "7",
    name: "Saint Martin",
    region: "Cox's Bazar District",
    propertyCount: 22,
    image:
      "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800&h=500&fit=crop",
    description:
      "Bangladesh's only coral island is a slice of paradise — turquoise waters, pristine beaches, coconut palms, and vibrant marine life. Saint Martin is perfect for snorkeling, diving, and watching breathtaking sunsets over the Bay of Bengal.",
    highlights: ["Coral Island", "Snorkeling", "Diving", "Sunset Cruises"],
  },
  {
    id: "8",
    name: "Chittagong",
    region: "Chittagong Division",
    propertyCount: 95,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop",
    description:
      "Bangladesh's port city and second-largest metropolis blends natural beauty with commercial energy. Patenga beach, the iconic ship-breaking yards, Foy's Lake, and the lush hills of Sitakunda make Chittagong a city of contrasts.",
    highlights: [
      "Patenga Beach",
      "Ship Breaking",
      "Foy's Lake",
      "Sitakunda Hills",
    ],
  },
  {
    id: "9",
    name: "Kuakata",
    region: "Barisal Division",
    propertyCount: 28,
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=500&fit=crop",
    description:
      'Known as the "Daughter of the Sea", Kuakata is one of the few beaches in the world where you can witness both sunrise and sunset over the ocean. The Rakhain tribal villages and mangrove forest add cultural depth to this serene coastline.',
    highlights: [
      "Sunrise & Sunset",
      "Rakhain Culture",
      "Mangroves",
      "Fishing Villages",
    ],
  },
  {
    id: "10",
    name: "Mymensingh",
    region: "Mymensingh Division",
    propertyCount: 18,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop",
    description:
      "Where the Brahmaputra River meets lush green plains, Mymensingh is the cultural and agricultural heartland of Bangladesh. The historic Mymensingh Rajbari palace, Birishiri's colourful earth and clear rivers offer a serene authentic experience.",
    highlights: [
      "Brahmaputra River",
      "Rajbari Palace",
      "Birishiri",
      "River Cruises",
    ],
  },
];

export async function getPopularDestinations(): Promise<Destination[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`${API_BASE}/destinations/popular?isActive=true`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ApiDestination[] = await res.json();
    return data.map(normalizeDestination);
  } catch {
    return ALL_DESTINATIONS.slice(0, 6);
  }
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`${API_BASE}/destinations`, {
      next: { revalidate: 300 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data: ApiDestination[] = json.data ?? json;
    return data.map(normalizeDestination);
  } catch {
    return ALL_DESTINATIONS;
  }
}

export async function getFooterData(): Promise<FooterColumn[]> {
  await delay(100);
  return [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        // { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Cancellation Options", href: "/cancellation" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "For Partners",
      links: [
        { label: "List Your Property", href: "/list-property" },
        { label: "Partner Hub", href: "/partner-hub" },
        // { label: "Advertise", href: "/advertise" },
        { label: "Affiliates", href: "/affiliates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];
}

export async function getAllHotels(): Promise<Hotel[]> {
  await delay(300);
  return getMockHotels();
}

export interface HotelSearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  rooms?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface HotelSearchMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HotelSearchResult {
  data: Hotel[];
  meta: HotelSearchMeta;
}

export async function getHotels(
  params?: HotelSearchParams,
): Promise<HotelSearchResult> {
  try {
    const qs = new URLSearchParams();
    if (params?.location) qs.set("location", params.location);
    if (params?.checkIn) qs.set("checkIn", params.checkIn);
    if (params?.checkOut) qs.set("checkOut", params.checkOut);
    if (params?.adults) qs.set("adults", String(params.adults));
    if (params?.rooms) qs.set("rooms", String(params.rooms));
    if (params?.minPrice) qs.set("minPrice", String(params.minPrice));
    if (params?.maxPrice) qs.set("maxPrice", String(params.maxPrice));
    if (params?.minRating) qs.set("minRating", String(params.minRating));
    if (params?.amenities?.length)
      qs.set("amenities", params.amenities.join(","));
    if (params?.tags?.length) qs.set("tags", params.tags.join(","));
    if (params?.sortBy) qs.set("sortBy", params.sortBy);
    if (params?.page) qs.set("page", String(params.page));
    qs.set("limit", String(params?.limit ?? 10));

    const res = await fetch(`${API_BASE}/hotels?${qs.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      data: (json.data as ApiHotel[]).map(normalizeHotel),
      meta: json.meta as HotelSearchMeta,
    };
  } catch {
    // const mock = await getMockHotels();
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  }
}

export async function searchHotels(query: SearchFormData): Promise<Hotel[]> {
  await delay(500);
  const allHotels = await getMockHotels();
  if (!query.location) return allHotels;
  return allHotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(query.location.toLowerCase()),
  );
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`${API_BASE}/hotels/${slug}?isActive=true`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ApiHotel = await res.json();
    return normalizeHotel(data);
  } catch {
    const allHotels = await getMockHotels();
    return allHotels.find((hotel) => hotel.slug === slug) ?? null;
  }
}

export async function getHotelReviews(hotelId: string): Promise<Review[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 500);
    const res = await fetch(`${API_BASE}/hotels/${hotelId}/reviews?limit=20`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return (json.data as ApiReview[]).map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  await delay(100);
  // TODO: Replace with real API call — GET /api/user/me
  return {
    id: "u1",
    name: "Ahmed Rahman",
    email: "ahmed.rahman@example.com",
    phone: "01712345678",
    address: "Gulshan-2, Dhaka, Bangladesh",
    memberSince: "2025-01-15",
    role: "USER" as const,
  };
}

export async function getUserBookings(): Promise<Booking[]> {
  await delay(200);
  // TODO: Replace with real API call — GET /api/user/bookings
  return [
    {
      id: "b1",
      reference: "RST-A4F2E1",
      hotelId: "",
      hotelName: "Saint Martin Island Resort",
      hotelSlug: "saint-martin-island-resort",
      hotelImage:
        "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=400&h=280&fit=crop",
      hotelLocation: "Saint Martin, Bangladesh",
      roomName: "Beachfront Villa",
      checkIn: "2026-04-28",
      checkOut: "2026-05-01",
      nights: 3,
      guests: 2,
      totalPrice: 25500,
      advancePaid: 5100,
      balanceDue: 20400,
      status: "upcoming",
      bookedOn: "2026-04-10",
      paymentMethod: "stripe",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
    {
      id: "b2",
      reference: "RST-B9C3D7",
      hotelId: "",
      hotelName: "The Royal Sylhet Resort & Spa",
      hotelSlug: "the-royal-sylhet-resort-spa",
      hotelImage:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=280&fit=crop",
      hotelLocation: "Sylhet, Bangladesh",
      roomName: "Executive Suite",
      checkIn: "2026-05-10",
      checkOut: "2026-05-14",
      nights: 4,
      guests: 2,
      totalPrice: 35200,
      advancePaid: 7040,
      balanceDue: 28160,
      status: "upcoming",
      bookedOn: "2026-04-08",
      paymentMethod: "uddoktapay",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
    {
      id: "b3",
      reference: "RST-C1E5F8",
      hotelId: "",
      hotelName: "Cox's Bazar Ocean Paradise",
      hotelSlug: "coxs-bazar-ocean-paradise",
      hotelImage:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=280&fit=crop",
      hotelLocation: "Cox's Bazar, Bangladesh",
      roomName: "Ocean View Suite",
      checkIn: "2026-03-20",
      checkOut: "2026-03-23",
      nights: 3,
      guests: 2,
      totalPrice: 21600,
      advancePaid: 4320,
      balanceDue: 0,
      status: "completed",
      bookedOn: "2026-03-05",
      paymentMethod: "stripe",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
    {
      id: "b4",
      reference: "RST-D2G6H9",
      hotelId: "",
      hotelName: "Sundarbans Eco Resort",
      hotelSlug: "sundarbans-eco-resort",
      hotelImage:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=280&fit=crop",
      hotelLocation: "Khulna, Bangladesh",
      roomName: "Deluxe Bungalow",
      checkIn: "2026-02-14",
      checkOut: "2026-02-17",
      nights: 3,
      guests: 2,
      totalPrice: 13500,
      advancePaid: 2700,
      balanceDue: 0,
      status: "completed",
      bookedOn: "2026-01-30",
      paymentMethod: "stripe",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
    {
      id: "b5",
      reference: "RST-E7K2L4",
      hotelId: "",
      hotelName: "Bandarban Hill Resort",
      hotelSlug: "bandarban-hill-resort",
      hotelImage:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=280&fit=crop",
      hotelLocation: "Bandarban, Bangladesh",
      roomName: "Mountain Suite",
      checkIn: "2026-01-25",
      checkOut: "2026-01-27",
      nights: 2,
      guests: 3,
      totalPrice: 8400,
      advancePaid: 1680,
      balanceDue: 0,
      status: "cancelled",
      bookedOn: "2026-01-10",
      paymentMethod: "uddoktapay",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
    {
      id: "b6",
      reference: "RST-F3M8N5",
      hotelId: "",
      hotelName: "Rangamati Lake View Hotel",
      hotelSlug: "rangamati-lake-view-hotel",
      hotelImage:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=280&fit=crop",
      hotelLocation: "Rangamati, Bangladesh",
      roomName: "Lakeside Suite",
      checkIn: "2025-12-22",
      checkOut: "2025-12-25",
      nights: 3,
      guests: 2,
      totalPrice: 15000,
      advancePaid: 3000,
      balanceDue: 0,
      status: "completed",
      bookedOn: "2025-12-08",
      paymentMethod: "stripe",
      currency: "BDT",
      actualCheckinAt: null,
      guestCheckedOutAt: null,
      earlyCheckoutRequestedAt: null,
      earlyCheckoutSavedDays: null,
    },
  ];
}

// ── Blog ──────────────────────────────────────────────────────────────────────

interface ApiBlogListItem {
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

interface ApiBlogPost extends ApiBlogListItem {
  content: string;
  youtubeUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;

  authorDetails: string | null;

  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[] | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  noIndex: boolean | null;
}

function normalizeBlogItem(b: ApiBlogListItem): BlogListItem {
  return {
    ...b,
    coverImage: imageUrl(b.coverImage),
    authorAvatar: b.authorAvatar ? imageUrl(b.authorAvatar) : null,
  };
}

function normalizeBlogPost(b: ApiBlogPost): BlogPost {
  return {
    ...b,
    coverImage: imageUrl(b.coverImage),
    authorAvatar: b.authorAvatar ? imageUrl(b.authorAvatar) : null,
    ogImage: b.ogImage ? imageUrl(b.ogImage) : null,
    metaKeywords: b.metaKeywords ?? [],
    noIndex: b.noIndex ?? false,
  };
}

export async function getBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{
  data: BlogListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.category) qs.set("category", params.category);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.search) qs.set("search", params.search);

  const url = `${API_BASE}/blogs${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
  const json = await res.json();
  return {
    data: (json.data as ApiBlogListItem[]).map(normalizeBlogItem),
    meta: json.meta,
  };
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/blogs/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);
  const json: ApiBlogPost = await res.json();
  return normalizeBlogPost(json);
}
