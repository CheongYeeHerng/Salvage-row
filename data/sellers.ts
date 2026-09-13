/**
 * Simulated seller profiles for the demo — contact details, ratings, and
 * reviews are all made up, not real information about anyone.
 */
export interface Review {
  id: string;
  itemName: string;
  rating: number; // 1–5
  reviewerName: string;
  comment: string;
  date: string; // ISO date
}

export interface SellerProfile {
  slug: string;
  name: string;
  phone: string;
  email: string;
  reviews: Review[];
}

export const sellers: Record<string, SellerProfile> = {
  "Marlowe Estate Clearances": {
    slug: "marlowe-estate-clearances",
    name: "Marlowe Estate Clearances",
    phone: "(555) 010-2841",
    email: "hello@marlowe-estate.example",
    reviews: [
      {
        id: "r1",
        itemName: "Antique Oak Dresser",
        rating: 5,
        reviewerName: "Priya N.",
        comment: "Exactly as described, and they helped me load it into the truck. Would buy from them again.",
        date: "2026-08-20",
      },
      {
        id: "r2",
        itemName: "Victorian Wall Mirror",
        rating: 4,
        reviewerName: "Tom R.",
        comment: "Beautiful piece, a little more foxing on the glass than the photos showed, but they mentioned it wasn't fully checked.",
        date: "2026-07-30",
      },
      {
        id: "r3",
        itemName: "Set of Dining Chairs",
        rating: 5,
        reviewerName: "Ada L.",
        comment: "Sturdy, clean, and the price was fair for the condition. Smooth pickup.",
        date: "2026-06-12",
      },
      {
        id: "r4",
        itemName: "Brass Ceiling Light",
        rating: 3,
        reviewerName: "Marcus D.",
        comment: "Wiring needed replacing before I could use it — should have been flagged as untested.",
        date: "2026-05-02",
      },
    ],
  },
  "Second Spin Audio": {
    slug: "second-spin-audio",
    name: "Second Spin Audio",
    phone: "(555) 010-7723",
    email: "sales@secondspinaudio.example",
    reviews: [
      {
        id: "r1",
        itemName: "Technics Turntable",
        rating: 5,
        reviewerName: "Owen F.",
        comment: "Tested in front of me before I paid. Sounds fantastic, needle was recently replaced.",
        date: "2026-08-28",
      },
      {
        id: "r2",
        itemName: "Vintage Receiver",
        rating: 5,
        reviewerName: "Grace H.",
        comment: "Knows their gear — walked me through every port and what still works. No surprises.",
        date: "2026-08-01",
      },
      {
        id: "r3",
        itemName: "Cassette Deck",
        rating: 4,
        reviewerName: "Sam K.",
        comment: "Works well, one channel is slightly quieter than the other but not a dealbreaker at this price.",
        date: "2026-06-19",
      },
    ],
  },
  "Corner Rack Vintage": {
    slug: "corner-rack-vintage",
    name: "Corner Rack Vintage",
    phone: "(555) 010-4459",
    email: "shop@cornerrackvintage.example",
    reviews: [
      {
        id: "r1",
        itemName: "Leather Motorcycle Jacket",
        rating: 5,
        reviewerName: "Iris B.",
        comment: "Fit description was spot on, and they were upfront about the small repair on the lining.",
        date: "2026-08-15",
      },
      {
        id: "r2",
        itemName: "1970s Maxi Dress",
        rating: 4,
        reviewerName: "Renee C.",
        comment: "Gorgeous dress, smelled strongly of storage at first but aired out fine after a day.",
        date: "2026-07-22",
      },
      {
        id: "r3",
        itemName: "Wool Trench Coat",
        rating: 5,
        reviewerName: "Devon P.",
        comment: "Exactly the era and cut I was looking for. Quick, friendly pickup.",
        date: "2026-06-30",
      },
      {
        id: "r4",
        itemName: "Silk Blouse",
        rating: 2,
        reviewerName: "Lena W.",
        comment: "A button was missing that wasn't mentioned in the listing. Otherwise fine quality.",
        date: "2026-05-18",
      },
    ],
  },
  "Thistle & Thrift Home": {
    slug: "thistle-and-thrift-home",
    name: "Thistle & Thrift Home",
    phone: "(555) 010-9012",
    email: "hi@thistleandthrift.example",
    reviews: [
      {
        id: "r1",
        itemName: "Hand-Painted Ceramic Vase",
        rating: 5,
        reviewerName: "Noah T.",
        comment: "No chips or cracks anywhere, wrapped really well for pickup too.",
        date: "2026-08-26",
      },
      {
        id: "r2",
        itemName: "Silverware Set",
        rating: 4,
        reviewerName: "Beatrice O.",
        comment: "A couple of pieces don't quite match the set but it was disclosed upfront. Good value.",
        date: "2026-07-14",
      },
      {
        id: "r3",
        itemName: "Woven Table Runner",
        rating: 5,
        reviewerName: "Callum J.",
        comment: "Lovely condition, exactly as pictured. Very responsive seller.",
        date: "2026-06-05",
      },
    ],
  },
  "Ridgeline Tool Exchange": {
    slug: "ridgeline-tool-exchange",
    name: "Ridgeline Tool Exchange",
    phone: "(555) 010-3376",
    email: "contact@ridgelinetools.example",
    reviews: [
      {
        id: "r1",
        itemName: "Table Saw",
        rating: 5,
        reviewerName: "Frank M.",
        comment: "Let me test it running before buying, blade guard and safety features all intact. Knows tools.",
        date: "2026-08-30",
      },
      {
        id: "r2",
        itemName: "Kayak, 12ft",
        rating: 3,
        reviewerName: "Hana S.",
        comment: "Small hairline crack near the seat they hadn't noticed — still usable but wasn't in the listing.",
        date: "2026-07-09",
      },
      {
        id: "r3",
        itemName: "Air Compressor",
        rating: 5,
        reviewerName: "Diego V.",
        comment: "Ran it for ten minutes on-site to prove it held pressure. Very fair pricing.",
        date: "2026-06-21",
      },
      {
        id: "r4",
        itemName: "Extension Ladder",
        rating: 4,
        reviewerName: "Wren A.",
        comment: "Solid and stable, a bit heavier than expected to transport but that's on me for not asking.",
        date: "2026-05-11",
      },
    ],
  },
};

export function getSellerByName(name: string): SellerProfile | undefined {
  return sellers[name];
}

export function getSellerBySlug(slug: string): SellerProfile | undefined {
  return Object.values(sellers).find((s) => s.slug === slug);
}

export function getSellerContact(name: string): { phone: string; email: string } | undefined {
  const seller = sellers[name];
  return seller ? { phone: seller.phone, email: seller.email } : undefined;
}

export function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((total, r) => total + r.rating, 0);
  return sum / reviews.length;
}
