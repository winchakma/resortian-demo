import type {
  Hotel,
  Destination,
  FooterColumn,
  NavLink,
  SearchFormData,
  Review,
} from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  await delay(200);
  return [
    {
      id: "1",
      name: "The Royal Sylhet Resort & Spa",
      slug: "the-royal-sylhet-resort-spa",
      location: "Sylhet, Bangladesh",
      price: 5500,
      currency: "BDT",
      rating: 4.8,
      reviewCount: 234,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      tags: ["Luxury", "Spa"],
      description:
        "Nestled in the lush tea gardens of Sylhet, The Royal Resort & Spa offers an unmatched sanctuary of luxury and tranquility. Guests enjoy world-class spa treatments, an infinity pool overlooking the hills, and farm-to-table dining that celebrates the flavors of Bangladesh.",
      amenities: ["Pool", "WiFi", "Spa", "Restaurant", "AC", "Parking"],
      rooms: [
        {
          id: "1",
          hotel_id: 1,
          name: "Standard Room",
          description: "Comfortable room with garden view and modern furnishings.",
          price: 3600,
          capacity: 2,
          view: "Garden View",
          size: "28 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: 1,
          name: "Deluxe Room",
          description: "Spacious room with upgraded furnishings and tea garden view.",
          price: 5500,
          capacity: 2,
          view: "Tea Garden View",
          size: "38 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony"],
          image:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
        },
        {
          id: "3",
          hotel_id: 1,
          name: "Executive Suite",
          description: "Luxurious suite with separate living area and panoramic views.",
          price: 8800,
          capacity: 4,
          view: "Panoramic View",
          size: "65 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          badge: "Most Popular",
        },
      ],
    },
    {
      id: "2",
      name: "Cox's Bazar Ocean Paradise",
      slug: "coxs-bazar-ocean-paradise",
      location: "Cox's Bazar, Bangladesh",
      price: 4200,
      currency: "BDT",
      rating: 4.6,
      reviewCount: 189,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
      tags: ["Beachfront"],
      description:
        "Wake up to the sound of waves at Cox's Bazar Ocean Paradise, set right on the world's longest natural sea beach. Every room offers breathtaking ocean views, while our beachside restaurant serves the freshest seafood catch of the day.",
      amenities: ["Pool", "WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: 2,
          name: "Standard Room",
          description: "Cozy room with partial sea view and all essential comforts.",
          price: 3600,
          capacity: 2,
          view: "Partial Sea View",
          size: "26 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: 2,
          name: "Ocean View Suite",
          description: "Stunning suite with full ocean view and private balcony.",
          price: 7200,
          capacity: 3,
          view: "Full Ocean View",
          size: "55 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          image:
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
          badge: "Sea Front",
        },
      ],
    },
    {
      id: "3",
      name: "Dhaka Grand Hotel",
      slug: "dhaka-grand-hotel",
      location: "Dhaka, Bangladesh",
      price: 3800,
      currency: "BDT",
      rating: 4.5,
      reviewCount: 312,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      tags: ["Business"],
      description:
        "The Dhaka Grand Hotel stands at the heart of the city, offering premium business facilities and elegant accommodation. With state-of-the-art conference rooms, high-speed connectivity, and a rooftop restaurant with panoramic city views, it is the preferred choice for business travelers.",
      amenities: ["WiFi", "Gym", "Restaurant", "AC", "Parking", "Spa"],
      rooms: [
        {
          id: "1",
          hotel_id: 3,
          name: "Standard Room",
          description: "Modern room with city view and high-speed WiFi.",
          price: 2800,
          capacity: 2,
          view: "City View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
        },
        {
          id: "2",
          hotel_id: 3,
          name: "Business Suite",
          description: "Spacious suite with dedicated work desk and premium amenities.",
          price: 5500,
          capacity: 2,
          view: "Skyline View",
          size: "48 m²",
          amenities: ["WiFi", "TV", "AC", "Work Desk", "Mini-bar"],
          image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          badge: "Business Pick",
        },
        {
          id: "3",
          hotel_id: 3,
          name: "Executive Suite",
          description: "Luxurious suite with panoramic city skyline views.",
          price: 8800,
          capacity: 4,
          view: "Panoramic City View",
          size: "70 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar", "Jacuzzi"],
          image:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          badge: "Most Popular",
        },
      ],
    },
    {
      id: "4",
      name: "Sundarbans Eco Resort",
      slug: "sundarbans-eco-resort",
      location: "Khulna, Bangladesh",
      price: 3200,
      currency: "BDT",
      rating: 4.7,
      reviewCount: 156,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      tags: ["Eco", "Nature"],
      description:
        "Immerse yourself in the raw beauty of the Sundarbans mangrove forest at our award-winning eco resort. Built using sustainable materials with minimal environmental impact, we offer guided forest treks, boat safaris for Royal Bengal Tiger spotting, and birdwatching experiences.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Pool"],
      rooms: [
        {
          id: "1",
          hotel_id: 4,
          name: "Forest Cabin",
          description: "Rustic cabin nestled in the mangroves with forest views.",
          price: 2800,
          capacity: 2,
          view: "Forest View",
          size: "32 m²",
          amenities: ["WiFi", "AC", "Nature Deck"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Eco Pick",
        },
        {
          id: "2",
          hotel_id: 4,
          name: "Deluxe Bungalow",
          description: "Spacious bungalow with private deck overlooking the river.",
          price: 4500,
          capacity: 3,
          view: "River View",
          size: "50 m²",
          amenities: ["WiFi", "TV", "AC", "Private Deck"],
          image:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          badge: "Most Popular",
        },
      ],
    },
    {
      id: "5",
      name: "Bandarban Hill Resort",
      slug: "bandarban-hill-resort",
      location: "Bandarban, Bangladesh",
      price: 2800,
      currency: "BDT",
      rating: 4.4,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
      tags: ["Hill View"],
      description:
        "Perched high in the Chittagong Hill Tracts, Bandarban Hill Resort offers spectacular views of mist-covered mountains and lush green valleys. A perfect base for trekking to Boga Lake or exploring the indigenous hill tribe villages nearby.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: 5,
          name: "Hill View Room",
          description: "Cozy room with panoramic hill and valley views.",
          price: 2200,
          capacity: 2,
          view: "Hill View",
          size: "28 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: 5,
          name: "Mountain Suite",
          description: "Elevated suite with wrap-around balcony and sunrise views.",
          price: 4200,
          capacity: 3,
          view: "Mountain View",
          size: "45 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony"],
          image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          badge: "Scenic Best",
        },
      ],
    },
    {
      id: "6",
      name: "Rangamati Lake View Hotel",
      slug: "rangamati-lake-view-hotel",
      location: "Rangamati, Bangladesh",
      price: 3500,
      currency: "BDT",
      rating: 4.3,
      reviewCount: 145,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
      tags: ["Lake View"],
      description:
        "Situated on the serene banks of Kaptai Lake, Rangamati Lake View Hotel is your gateway to the tranquil beauty of the Chittagong Hill Tracts. Enjoy boat rides on the shimmering lake, explore the Hanging Bridge, and savor traditional Chakma cuisine.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Pool"],
      rooms: [
        {
          id: "1",
          hotel_id: 6,
          name: "Lake View Room",
          description: "Bright room with direct lake view and wooden interiors.",
          price: 2500,
          capacity: 2,
          view: "Lake View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: 6,
          name: "Lakeside Suite",
          description: "Premium suite with private jetty access and lake panorama.",
          price: 5000,
          capacity: 4,
          view: "Full Lake View",
          size: "58 m²",
          amenities: ["WiFi", "TV", "AC", "Balcony", "Mini-bar"],
          image:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          badge: "Most Popular",
        },
      ],
    },
    {
      id: "7",
      name: "Chittagong Harbour Inn",
      slug: "chittagong-harbour-inn",
      location: "Chittagong, Bangladesh",
      price: 2500,
      currency: "BDT",
      rating: 4.2,
      reviewCount: 203,
      image:
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
      tags: ["City"],
      description:
        "Conveniently located in the heart of Chittagong, Harbour Inn offers comfortable accommodation with easy access to the port city's attractions. From the historic Patenga Beach to the vibrant Keranihat market, everything is within reach.",
      amenities: ["WiFi", "Restaurant", "AC", "Parking", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: 7,
          name: "Standard Room",
          description: "Well-appointed room with city view and modern amenities.",
          price: 1800,
          capacity: 2,
          view: "City View",
          size: "25 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
        },
        {
          id: "2",
          hotel_id: 7,
          name: "Deluxe Room",
          description: "Spacious room with upgraded furnishings and harbour view.",
          price: 2800,
          capacity: 2,
          view: "Harbour View",
          size: "35 m²",
          amenities: ["WiFi", "TV", "AC", "Mini-bar"],
          image:
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
          badge: "Harbour View",
        },
      ],
    },
    {
      id: "8",
      name: "Saint Martin Island Resort",
      slug: "saint-martin-island-resort",
      location: "Saint Martin, Bangladesh",
      price: 6000,
      currency: "BDT",
      rating: 4.9,
      reviewCount: 87,
      image:
        "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=600&h=400&fit=crop",
      tags: ["Island", "Premium"],
      description:
        "Bangladesh's only coral island, Saint Martin is a paradise of crystal-clear waters and pristine beaches. Our premium island resort offers an intimate escape with snorkeling, diving, and sunset cruises — all set against a backdrop of coconut palms and turquoise sea.",
      amenities: ["Pool", "WiFi", "Spa", "Restaurant", "AC", "Gym"],
      rooms: [
        {
          id: "1",
          hotel_id: 8,
          name: "Island Cottage",
          description: "Charming cottage steps from the beach with ocean breeze.",
          price: 4500,
          capacity: 2,
          view: "Ocean View",
          size: "30 m²",
          amenities: ["WiFi", "TV", "AC"],
          image:
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
          badge: "Best Value",
        },
        {
          id: "2",
          hotel_id: 8,
          name: "Beachfront Villa",
          description: "Private villa with direct beach access and outdoor shower.",
          price: 8500,
          capacity: 4,
          view: "Beachfront",
          size: "75 m²",
          amenities: ["WiFi", "TV", "AC", "Private Pool", "Butler Service"],
          image:
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop",
          badge: "Premium Pick",
        },
      ],
    },
  ];
}

export async function getPopularDestinations(): Promise<Destination[]> {
  await delay(150);
  return [
    {
      id: "1",
      name: "Cox's Bazar",
      propertyCount: 120,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    },
    {
      id: "2",
      name: "Sylhet",
      propertyCount: 85,
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    },
    {
      id: "3",
      name: "Bandarban",
      propertyCount: 45,
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    },
    {
      id: "4",
      name: "Sundarbans",
      propertyCount: 30,
      image:
        "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    },
    {
      id: "5",
      name: "Dhaka",
      propertyCount: 200,
      image:
        "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop",
    },
    {
      id: "6",
      name: "Rangamati",
      propertyCount: 38,
      image:
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop",
    },
  ];
}

export async function getFooterData(): Promise<FooterColumn[]> {
  await delay(100);
  return [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Press", href: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Safety Information", href: "/safety" },
        { label: "Cancellation Options", href: "/cancellation" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "For Partners",
      links: [
        { label: "List Your Property", href: "/list-property" },
        { label: "Partner Hub", href: "/partner-hub" },
        { label: "Advertise", href: "/advertise" },
        { label: "Affiliates", href: "/affiliates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];
}

export async function searchHotels(query: SearchFormData): Promise<Hotel[]> {
  await delay(500);
  const allHotels = await getFeaturedStays();
  if (!query.location) return allHotels;
  return allHotels.filter((hotel) =>
    hotel.location.toLowerCase().includes(query.location.toLowerCase()),
  );
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  await delay(150);
  const allHotels = await getFeaturedStays();
  return allHotels.find((hotel) => hotel.slug === slug) ?? null;
}

export async function getHotelReviews(hotelId: string): Promise<Review[]> {
  await delay(100);
  const reviewsByHotel: Record<string, Review[]> = {
    "1": [
      {
        id: "r1",
        author: "Tanvir Ahmed",
        rating: 5,
        comment:
          "Absolutely stunning resort! The spa treatments were world-class and the views of the tea gardens were breathtaking. Will definitely return.",
        date: "2026-03-15",
      },
      {
        id: "r2",
        author: "Nusrat Jahan",
        rating: 5,
        comment:
          "Perfect getaway from the city. The staff were incredibly warm and the food was delicious. The infinity pool is a highlight.",
        date: "2026-02-28",
      },
    ],
    "2": [
      {
        id: "r3",
        author: "Rahim Chowdhury",
        rating: 4,
        comment:
          "Beautiful beachfront location. Waking up to the sound of waves was magical. The seafood restaurant is a must-try.",
        date: "2026-03-10",
      },
    ],
    "8": [
      {
        id: "r4",
        author: "Mehreen Islam",
        rating: 5,
        comment:
          "A true paradise! The island is stunning and the resort is top-notch. Snorkeling right off the beach was an unforgettable experience.",
        date: "2026-03-20",
      },
      {
        id: "r5",
        author: "Farhan Hossain",
        rating: 5,
        comment:
          "Best hotel experience I've ever had. The beachfront villa was absolutely worth every taka. The butler service was exceptional.",
        date: "2026-02-14",
      },
    ],
  };
  return reviewsByHotel[hotelId] ?? [];
}
