import type { Hotel, Destination, FooterColumn, NavLink, SearchFormData } from "@/types";

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
      location: "Sylhet, Bangladesh",
      price: 5500,
      currency: "BDT",
      rating: 4.8,
      reviewCount: 234,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      tags: ["Luxury", "Spa"],
    },
    {
      id: "2",
      name: "Cox's Bazar Ocean Paradise",
      location: "Cox's Bazar, Bangladesh",
      price: 4200,
      currency: "BDT",
      rating: 4.6,
      reviewCount: 189,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
      tags: ["Beachfront"],
    },
    {
      id: "3",
      name: "Dhaka Grand Hotel",
      location: "Dhaka, Bangladesh",
      price: 3800,
      currency: "BDT",
      rating: 4.5,
      reviewCount: 312,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      tags: ["Business"],
    },
    {
      id: "4",
      name: "Sundarbans Eco Resort",
      location: "Khulna, Bangladesh",
      price: 3200,
      currency: "BDT",
      rating: 4.7,
      reviewCount: 156,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      tags: ["Eco", "Nature"],
    },
    {
      id: "5",
      name: "Bandarban Hill Resort",
      location: "Bandarban, Bangladesh",
      price: 2800,
      currency: "BDT",
      rating: 4.4,
      reviewCount: 98,
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
      tags: ["Hill View"],
    },
    {
      id: "6",
      name: "Rangamati Lake View Hotel",
      location: "Rangamati, Bangladesh",
      price: 3500,
      currency: "BDT",
      rating: 4.3,
      reviewCount: 145,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
      tags: ["Lake View"],
    },
    {
      id: "7",
      name: "Chittagong Harbour Inn",
      location: "Chittagong, Bangladesh",
      price: 2500,
      currency: "BDT",
      rating: 4.2,
      reviewCount: 203,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
      tags: ["City"],
    },
    {
      id: "8",
      name: "Saint Martin Island Resort",
      location: "Saint Martin, Bangladesh",
      price: 6000,
      currency: "BDT",
      rating: 4.9,
      reviewCount: 87,
      image: "https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=600&h=400&fit=crop",
      tags: ["Island", "Premium"],
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
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    },
    {
      id: "2",
      name: "Sylhet",
      propertyCount: 85,
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    },
    {
      id: "3",
      name: "Bandarban",
      propertyCount: 45,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    },
    {
      id: "4",
      name: "Sundarbans",
      propertyCount: 30,
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    },
    {
      id: "5",
      name: "Dhaka",
      propertyCount: 200,
      image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop",
    },
    {
      id: "6",
      name: "Rangamati",
      propertyCount: 38,
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&h=400&fit=crop",
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
    hotel.location.toLowerCase().includes(query.location.toLowerCase())
  );
}
