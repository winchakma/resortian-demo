"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Clock, User, Calendar, Tag } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Top 5 Beach Destinations in Bangladesh You Must Visit",
    excerpt:
      "Bangladesh hides some of Southeast Asia's most breathtaking coastline. From the world's longest natural sea beach to a secluded coral island, here are five stretches of sand that deserve a spot on every traveller's bucket list.",
    content: `Bangladesh's coastline is longer and more varied than most visitors expect. While Cox's Bazar steals the headlines, the country harbours quiet coves, river-mouth beaches, and island shores that remain blissfully crowd-free. Here is our definitive guide to the five best beach destinations.

**1. Cox's Bazar — The World's Longest Natural Sea Beach**
Stretching 120 unbroken kilometres from Teknaf to Cox's Bazar town, this golden arc of sand needs little introduction. Sunrise over Inani Beach, where rounded boulders dot the shoreline, is a sight that stays with you long after you leave. The local fish market in the evening is equally unmissable — grilled hilsa with a coconut chutney is a meal you will dream about.

**2. Saint Martin — Bangladesh's Only Coral Island**
A three-hour ferry ride from Teknaf deposits you on this tiny coral island — 8 sq km of coconut palms, cerulean water, and almost no cars. Snorkelling the reef at dawn, before the day-trippers arrive, reveals parrotfish, sea turtles, and brain corals in astonishing clarity. Overnight stays let you witness the bioluminescence that lights up the shallows after dark.

**3. Kuakata — The Daughter of the Sea**
Kuakata is one of the very few beaches in the world where you can watch both sunrise and sunset over the open ocean without moving more than a kilometre. The Rakhain tribal market on the beach sells handwoven cloth and dried fish at prices that feel almost too good to be true. The nearby mangrove forest is home to spotted deer and the elusive fishing cat.

**4. Patenga Beach, Chittagong**
Patenga sits at the mouth of the Karnaphuli River, where ocean liners and fishing trawlers share the same horizon. The beach is narrow but the atmosphere is electric — street food stalls, carnival rides, and the constant drama of shipping traffic make it a uniquely urban beach experience. The adjacent naval zone adds a striking backdrop at sunset.

**5. Mandarbaria Beach, Sundarbans**
Accessible only by boat through the Sundarbans delta, Mandarbaria is the definition of off-the-beaten-path. The beach forms where the Raimangal river meets the Bay of Bengal — behind you is an impenetrable wall of mangrove, ahead is open sea. Spotting a saltwater crocodile sunning itself on the bank as your boat glides past is not unusual.

**When to Go**
October through February is the sweet spot for all five destinations — skies are clear, seas are calm, and temperatures sit comfortably between 18–28 °C. Avoid June to September when the Bay of Bengal cyclone season can bring heavy swells and coastal flooding.`,
    author: "Tasnim Hossain",
    authorRole: "Travel Editor",
    date: "2026-04-18",
    readTime: "6 min read",
    category: "Destination Guide",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
  },
  {
    id: "2",
    title: "A Local's Guide to Cox's Bazar: Beyond the Main Beach",
    excerpt:
      "Most visitors stick to the main beach strip, but Cox's Bazar rewards those who wander. Buddhist temples perched on hilltops, fishing villages at dawn, and a boat journey into Myanmar borderlands — this is the Cox's Bazar the tour buses miss.",
    content: `Cox's Bazar is Bangladesh's most visited destination, yet the vast majority of tourists never venture more than a kilometre from their hotel. Locals know a completely different city — layered, surprising, and far more interesting than the souvenir shops suggest.

**Himchari National Park**
Just 12 km south of Cox's Bazar town, Himchari is a pocket of protected forest climbing the coastal hills. The waterfall here flows year-round; in the post-monsoon months it becomes a roaring curtain of white water visible from the beach below. The forest trail to the hilltop viewpoint takes about 45 minutes and rewards you with a panoramic sweep of the bay.

**Ramu — The Temple Town**
Ramu, 10 km east of Cox's Bazar, feels like another country. The road into town passes through rubber plantations and then opens onto a cluster of Buddhist temples, each decorated with thousands of small brass Buddha figurines brought from Myanmar, Thailand, and Sri Lanka. The main Ramu Rajvihara, built in the 11th century, is one of the oldest temples in Bangladesh.

**Teknaf Wildlife Sanctuary**
The peninsula narrows dramatically as you drive south from Cox's Bazar toward Teknaf, with the Naf River forming the Bangladesh-Myanmar border on your left and the Bay of Bengal on your right. The wildlife sanctuary here protects Asian elephants, leopard cats, and hundreds of bird species. Birdwatchers regularly tick off rare species like the Spoon-billed Sandpiper during winter migration.

**The Fish Landing Quay at Dawn**
Set your alarm for 4:30 am and head to the fishing harbour near the Bakkhali River mouth. By 5 am, hundreds of wooden trawlers are offloading their catch while auctioneers shout bids in a rapid-fire dialect. Crabs the size of dinner plates, king prawns, and barracuda pass through your hands for a fraction of restaurant prices. A local breakfast of fish curry and roti eaten beside the quay costs less than a dollar.

**How to Get Around**
CNG (auto-rickshaws) will take you almost anywhere in and around Cox's Bazar for a negotiated flat fare. For Himchari and Inani, reserve-line vehicles run from the Kolatoli beach end. For Ramu and Teknaf, local buses leave every 30 minutes from the main bus stand near the Bazar Ghat.`,
    author: "Rafiqul Islam",
    authorRole: "Local Correspondent",
    date: "2026-04-10",
    readTime: "7 min read",
    category: "Insider Tips",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop",
  },
  {
    id: "3",
    title: "Sylhet's Tea Gardens: A Complete Travel Guide",
    excerpt:
      "Rolling hills carpeted in fifty shades of green, the smell of rain on freshly picked leaves, and a cup of tea that tastes unlike anything you have had before — Sylhet's tea country is one of Bangladesh's most cinematic landscapes.",
    content: `The Sylhet Division of northeastern Bangladesh produces some of the finest Orthodox tea in South Asia. More than 150 tea gardens — locally called "baagaans" — carpet the hills between Sylhet city and the Indian border, and several now welcome overnight visitors in planters' bungalows.

**Getting to Sylhet**
Overnight sleeper trains from Dhaka's Kamalapur station reach Sylhet in about six hours, arriving at dawn — the best possible time to arrive in tea country. Domestic flights from Hazrat Shahjalal Airport take 45 minutes. From Sylhet city, the main tea-garden belt begins just 15 km to the north.

**The Best Gardens to Visit**

*Malnicherra Tea Estate* is the oldest tea garden in the Indian subcontinent (est. 1857) and still in production. The colonial factory building, with its original gas-fired withering troughs, runs guided tours on weekday mornings. The adjacent bungalow offers basic overnight stays — you wake to the sound of pluckers singing as they move along the rows.

*Lakkatura Tea Garden*, just outside Sylhet city limits, is the easiest to visit independently. The garden manager's office near the entrance usually allows visitors to walk the rows during the flush season (March to November) without prior arrangement.

*Madhabpur Lake*, technically within the Chunarughat tea belt in Habiganj district, rewards visitors with a lake so densely lined with water hyacinths and migratory birds that it reads more as an oil painting than a photograph.

**The Plucking Season**
The first flush (March–April) produces the most delicate leaves; the second flush (June–July) is fuller-bodied with a muscatel character. During monsoon, the gardens are at their most dramatic — low cloud sits in the valleys between the hills and the green deepens to emerald.

**What to Eat**
Sylheti cuisine is distinct from the rest of Bangladesh. Shatkora (a wild citrus unique to Sylhet) beef curry, pitika (smoked fish and mustard mash), and bamboo shoot preparations are all hyperlocal dishes that rarely appear outside the region. Ask your guesthouse to arrange a home-cooked Sylheti meal — it will be the culinary highlight of your trip.`,
    author: "Nusrat Jahan",
    authorRole: "Food & Travel Writer",
    date: "2026-03-29",
    readTime: "8 min read",
    category: "Destination Guide",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop",
  },
  {
    id: "4",
    title: "Trekking the Chittagong Hill Tracts: A First-Timer's Handbook",
    excerpt:
      "The Bandarban–Rangamati–Khagrachhari triangle is Bangladesh's adventure heartland. Mist-covered peaks, indigenous villages, and trails that barely appear on any map — here is everything you need to know before you lace up your boots.",
    content: `The Chittagong Hill Tracts (CHT) cover nearly 13,000 sq km of forested ridges in southeastern Bangladesh, bordering India and Myanmar. This region is home to eleven distinct indigenous communities — Marma, Chakma, Tripura, Khumi, Mro, and others — each with their own language, weaving traditions, and architecture. Visiting responsibly means engaging with this cultural richness as much as the landscape.

**Permit Requirements**
All foreign nationals require a permit to visit the CHT. This is obtainable through the Deputy Commissioner's office in Bandarban, Rangamati, or Khagrachhari, or through tour operators in Dhaka or Chittagong who process them in advance. Bangladeshi nationals require no permit. Always carry your permit and passport when trekking.

**The Three Districts**

*Bandarban* is the trekking hub. The town sits in a valley straddled by river and ridge and makes an excellent base. Key treks include Boga Lake (a 3–4 hour climb through Khumi village territory), Nilgiri (accessible by CNG and jeep, elevation ~900m), and the ambitious multi-day route to Tahjindong — Bangladesh's highest peak at 1,064m.

*Rangamati* is centred on the vast Kaptai Lake, created in 1962 when the Karnaphuli River was dammed. The lake flooded 40% of the CHT's arable land — a painful history that shapes Chakma identity to this day. The best way to explore is by renting a country boat for a half-day on the lake, stopping at floating markets and stilted villages.

*Khagrachhari* is the quietest of the three district towns, with fewer tourist facilities but richer access to Tripura village life. The weekly tribal market at Khagrachhari town is one of the most authentic in the CHT.

**When to Trek**
November to February is ideal — clear skies, cool temperatures (5–15°C at altitude), and dry trails. Avoid June through September when leeches become a genuine problem and landslides can close roads for days.

**Packing Essentials**
Lightweight waterproof layers, a headtorch (many guesthouses lose power nightly), iodine tablets or a Steripen, blister plasters, and enough cash for the entire trip (ATMs are rare beyond district towns). A trekking pole is invaluable on the steep laterite descents.

**Cultural Etiquette**
Ask before photographing people, particularly women. Remove shoes before entering a Buddhist monastery or Chakma home. Dress modestly — long trousers and covered shoulders are appreciated in all villages. If invited to share a meal, accept graciously; hospitality is a cornerstone of CHT culture.`,
    author: "Arif Mahmud",
    authorRole: "Adventure Correspondent",
    date: "2026-03-15",
    readTime: "9 min read",
    category: "Adventure Travel",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop",
  },
  {
    id: "5",
    title: "The Sundarbans: How to Plan an Ethical Eco-Tour",
    excerpt:
      "The world's largest mangrove forest is also one of its most fragile ecosystems. Here is how to experience the Royal Bengal Tiger's kingdom without leaving a harmful footprint — from choosing the right operator to what to do if you encounter wildlife.",
    content: `The Sundarbans spans 10,000 sq km across southern Bangladesh and the West Bengal state of India, making it the largest contiguous mangrove forest on earth. It is a UNESCO World Heritage Site, a Ramsar Wetland, and home to the last significant population of Royal Bengal Tigers that live in a tidal, saltwater environment.

**Choosing an Ethical Operator**
The single most important decision you will make is which tour operator to book with. Responsible operators limit boat sizes (maximum 12 passengers), brief guests before wildlife encounters, prohibit plastic on board, employ local Munda or Bawali community members as guides, and contribute a percentage of profits to the Sundarbans Tiger Conservation Foundation. Ask specific questions — vague answers about "sustainability" are a red flag.

**What to Expect**

The standard two-night package departs from Mongla port in Bagerhat district. The first afternoon is a gentle transit through the outer channels, watching kingfishers and Irrawaddy dolphins from the deck. By the second morning, you are deep in the forest, moving silently in a small dinghy through the narrow khals (creeks) where tigers drink at dawn. Spotted deer, wild boar, water monitors, and estuarine crocodiles are near-guaranteed sightings. Tigers require luck — and patience.

**The Forest at Night**
After dark the forest sounds completely different. Anchored in a quiet channel, with the engine off, you hear the alarm calls of axis deer, the splash of a mugger crocodile entering the water, and occasionally the low, resonant call — somewhere between a cough and a roar — that means a tiger is nearby. No lights go over the side of the boat after dusk.

**Responsible Wildlife Viewing**
If a tiger is sighted, the boat must maintain a distance of at least 50 metres and the engine must be killed immediately. Never shine torches at wildlife. Do not whistle, clap, or make sudden noises intended to provoke a reaction. Photography is fine at a respectful distance with natural light or a telephoto lens.

**What to Pack**
Neutral-coloured clothing (no bright colours, no white), binoculars (10×42 minimum), a telephoto lens if you are a photographer, insect repellent with DEET (essential), sunscreen, and a wide-brimmed hat. Plastic of any kind — including water bottles — should be left at home; most ethical operators provide refillable metal bottles and filter water on board.

**Practical Entry Point**
Fly or take an overnight bus to Khulna, then a rickshaw or CNG to Mongla (2 hours). Bagerhat, with its 15th-century Sixty Dome Mosque, is an excellent day-trip addition before or after your Sundarbans tour.`,
    author: "Sadia Rahman",
    authorRole: "Environmental Correspondent",
    date: "2026-02-28",
    readTime: "10 min read",
    category: "Eco Travel",
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=500&fit=crop",
  },
  {
    id: "6",
    title: "How to Book the Perfect Bangladesh Getaway on a Budget",
    excerpt:
      "Bangladesh is one of South Asia's most affordable travel destinations — but only if you know the tricks. From off-season hotel rates to free entrance days at national parks, here is how to see the best of the country without breaking the bank.",
    content: `Bangladesh consistently surprises budget travellers. Food, transport, and accommodation are all significantly cheaper than neighbouring India, and many of the country's headline attractions — river journeys, national parks, historic sites — are free or nominally priced. The challenge is knowing where to look.

**Flights and Getting Here**
Biman Bangladesh Airlines frequently runs promotional fares on its Dhaka–London and Dhaka–Kuala Lumpur routes. If you are already in South Asia, overland entry from Kolkata via Benapole or Haridaspur crossing is cheap and straightforward. The train from Kolkata's Chitpur station runs directly to Dhaka (Maitree Express) three times a week.

**Accommodation Hacks**
Book directly through the hotel rather than via OTAs — most Bangladeshi hotels will price-match or beat any online rate if you call or WhatsApp in advance. Government-run tourist bungalows (run by the Bangladesh Parjatan Corporation) are often the cheapest option in remote areas like the Sundarbans and Sylhet, and they come with a caretaker who doubles as a local guide. During Ramadan, many hotels offer 20–30% discounts as domestic travel drops.

**Getting Around on the Cheap**
Long-distance bus travel is extremely affordable — Dhaka to Cox's Bazar, for example, costs around BDT 700–900 (USD 6–8) on an AC coach. Night buses mean you save a night's accommodation. The train network is slower but more scenic and even cheaper; sleeper berths on the Sylhet route are among the most pleasant overnight journeys in South Asia.

**Eating Well for Almost Nothing**
Street food in Bangladesh is exceptional and safe if you choose busy stalls with high turnover. A full meal of dal, bhat (rice), sabzi (vegetables), and a protein at a local "hotel" (the Bangladeshi word for a basic restaurant) costs BDT 80–150 (under USD 1.50). The national dish, hilsa fish curry with mustard, is widely available and only slightly more expensive. Reserve mid-range restaurants for special occasions — the food at local places is invariably fresher.

**Free and Low-Cost Attractions**
Old Dhaka's Lalbagh Fort (BDT 50 entry), the Armenian Church on Armanitola Street (free), Ahsan Manzil Pink Palace (BDT 40), and the Baldha Garden (BDT 20) are all within a 3 km radius in central Dhaka. National parks charge nominal entry fees; the Lawachara Rainforest near Sreemangal costs BDT 50 and is one of the best places in Bangladesh to see hoolock gibbons in the wild.

**The Off-Season Advantage**
May to September is the monsoon — crowds thin dramatically, prices drop by 30–40%, and the country transforms into shades of green that no dry-season photograph can capture. River journeys are at their most spectacular when the chars (river islands) are submerged and the entire delta seems to be one vast inland sea.`,
    author: "Imran Chowdhury",
    authorRole: "Budget Travel Expert",
    date: "2026-02-12",
    readTime: "7 min read",
    category: "Travel Tips",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=500&fit=crop",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Destination Guide":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Insider Tips":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Adventure Travel":
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Eco Travel":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Travel Tips":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function renderContent(text: string) {
  return text.split("\n\n").map((para, i) => {
    if (para.startsWith("**") && para.endsWith("**")) {
      return (
        <h3
          key={i}
          className="mt-6 text-lg font-bold text-gray-900 dark:text-white"
        >
          {para.slice(2, -2)}
        </h3>
      );
    }
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="mt-4 text-gray-700 dark:text-gray-300">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-semibold text-gray-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          ),
        )}
      </p>
    );
  });
}

export function BlogContent() {
  const [selected, setSelected] = useState<BlogPost | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <>
      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-100">
            Resortian Journal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Stories &amp; Travel Guides
          </h1>
          <p className="mt-3 max-w-xl text-primary-100">
            Inspiration, tips, and local insight for your next Bangladesh
            adventure.
          </p>
        </div>
      </section>

      {/* ── Post grid ───────────────────────────────────────────────── */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {POSTS.map((post) => (
              <article
                key={post.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >
                {/* Thumbnail */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Category + read time */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                    >
                      <Tag className="h-3 w-3" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-base font-bold leading-snug text-gray-900 dark:text-white">
                    {post.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>

                  {/* Footer row */}
                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                        <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                          {post.author}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {post.authorRole}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(post)}
                    className="mt-4 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 active:bg-primary-800"
                  >
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          className="fixed inset-0 z-[500] flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-white text-gray-900 shadow-2xl dark:bg-gray-900 dark:text-white">
            {/* Cover image */}
            <div className="relative h-60 w-full overflow-hidden rounded-t-2xl">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-cover"
                sizes="672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={close}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              {/* Category on cover */}
              <span
                className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[selected.category] ?? "bg-gray-100 text-gray-700"}`}
              >
                {selected.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold leading-snug text-gray-900 dark:text-white sm:text-2xl">
                {selected.title}
              </h2>

              {/* Meta row */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-gray-100 pb-5 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40">
                    <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {selected.author}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selected.authorRole}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selected.date)}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  {selected.readTime}
                </span>
              </div>

              {/* Body */}
              <div className="mt-5 leading-relaxed">
                {renderContent(selected.content)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
