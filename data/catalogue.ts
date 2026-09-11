export type Category =
  | "Furniture"
  | "Electronics"
  | "Clothing"
  | "Books & Media"
  | "Kitchenware"
  | "Tools"
  | "Toys & Games"
  | "Outdoor & Bikes";

export type Condition = "Like new" | "Good" | "Fair" | "Well-worn";

export interface Item {
  id: string;
  name: string;
  price: number;
  category: Category;
  condition: Condition;
  /** left undefined when the seller didn't note it */
  brand?: string;
  /** left undefined when the seller didn't note it */
  era?: string;
  /** null = seller hasn't tested/verified this; only meaningful for powered or mechanical goods */
  verifiedWorking: boolean | null;
  /** original retail price when new, if known — left undefined otherwise */
  originalPrice?: number;
  material?: string;
  description: string;
  seller: string;
  stock: number;
}

export const catalogue: Item[] = [
  {
    id: "001",
    name: "Danish Teak Sideboard",
    price: 340,
    category: "Furniture",
    condition: "Good",
    brand: "unbranded",
    era: "1960s",
    verifiedWorking: null,
    material: "Teak veneer, solid oak legs",
    description:
      "Three sliding doors, one shallow drawer, tapered legs. A few light surface scratches on top, hinges all work smoothly.",
    seller: "Marlowe Estate Clearances",
    stock: 1,
  },
  {
    id: "002",
    name: "Sony Walkman WM-EX652",
    price: 45,
    category: "Electronics",
    condition: "Good",
    brand: "Sony",
    era: "1998",
    verifiedWorking: true,
    originalPrice: 90,
    description:
      "Cassette Walkman, belt and pinch roller recently replaced. Plays cleanly through both channels, tested with three different tapes.",
    seller: "Second Spin Audio",
    stock: 1,
  },
  {
    id: "003",
    name: "Men's Leather Bomber Jacket",
    price: 85,
    category: "Clothing",
    condition: "Fair",
    brand: "Schott NYC",
    era: "1990s",
    verifiedWorking: null,
    originalPrice: 450,
    material: "Cowhide leather, quilted lining",
    description:
      "Size 42. Softened with age, one small scuff on the left cuff, zipper pulls smoothly. Lining has been re-stitched once at the shoulder seam.",
    seller: "Corner Rack Vintage",
    stock: 1,
  },
  {
    id: "004",
    name: "Boxed Set: Complete Sherlock Holmes",
    price: 22,
    category: "Books & Media",
    condition: "Good",
    era: "1975 printing",
    verifiedWorking: null,
    description:
      "Two-volume hardcover set, dust jackets present with light edge wear. Previous owner's name inscribed on the first flyleaf.",
    seller: "Marlowe Estate Clearances",
    stock: 1,
  },
  {
    id: "005",
    name: "Le Creuset Dutch Oven, 5.5qt",
    price: 95,
    category: "Kitchenware",
    condition: "Good",
    brand: "Le Creuset",
    verifiedWorking: null,
    originalPrice: 380,
    material: "Enameled cast iron",
    description:
      "Flame orange, enamel intact inside and out with the usual light staining from use. No chips on the rim or lid.",
    seller: "Thistle & Thrift Home",
    stock: 1,
  },
  {
    id: "006",
    name: "DeWalt 18V Cordless Drill",
    price: 55,
    category: "Tools",
    condition: "Fair",
    brand: "DeWalt",
    verifiedWorking: true,
    originalPrice: 160,
    description:
      "Includes one battery and charger, no case. Chuck holds bits securely, both speed settings tested under load.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "007",
    name: "Wooden Chess Set, Hand-Carved",
    price: 38,
    category: "Toys & Games",
    condition: "Good",
    verifiedWorking: null,
    material: "Rosewood and boxwood",
    description:
      "Weighted pieces, felt-bottomed. Folding board doubles as the storage box. One pawn has a small chip on the base, doesn't affect play.",
    seller: "Corner Rack Vintage",
    stock: 1,
  },
  {
    id: "008",
    name: "Trek 820 Mountain Bike",
    price: 180,
    category: "Outdoor & Bikes",
    condition: "Good",
    brand: "Trek",
    era: "2016",
    verifiedWorking: true,
    originalPrice: 400,
    description:
      "21-speed, recently tuned with new brake pads and cables. Some paint chipping on the down tube. Tires have moderate tread left.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "009",
    name: "Mid-Century Lounge Chair",
    price: 220,
    category: "Furniture",
    condition: "Fair",
    era: "1965",
    verifiedWorking: null,
    material: "Walnut frame, wool upholstery",
    description:
      "Frame is solid with no wobble. Upholstery shows fading and one small tear on the underside of the left arm, not visible when seated.",
    seller: "Marlowe Estate Clearances",
    stock: 1,
  },
  {
    id: "010",
    name: "Nintendo Game Boy Color",
    price: 60,
    category: "Electronics",
    condition: "Good",
    brand: "Nintendo",
    era: "1999",
    verifiedWorking: true,
    originalPrice: 80,
    description:
      "Teal shell, screen has no visible scratches or dead pixels. Tested with three cartridges, all booted and saved correctly.",
    seller: "Second Spin Audio",
    stock: 1,
  },
  {
    id: "011",
    name: "Women's Wool Peacoat",
    price: 40,
    category: "Clothing",
    condition: "Good",
    brand: "unbranded",
    verifiedWorking: null,
    material: "Wool blend",
    description:
      "Size M. Double-breasted, navy. All six buttons present, no moth damage found on inspection, lining is intact.",
    seller: "Corner Rack Vintage",
    stock: 1,
  },
  {
    id: "012",
    name: "Vinyl Record Bundle — Classic Rock",
    price: 30,
    category: "Books & Media",
    condition: "Fair",
    verifiedWorking: null,
    description:
      "Twelve LPs, mixed condition sleeves with some ring wear. Not individually graded — buyer should expect ordinary surface noise typical of records this age.",
    seller: "Second Spin Audio",
    stock: 1,
  },
  {
    id: "013",
    name: "Cast Iron Skillet, 10-inch",
    price: 18,
    category: "Kitchenware",
    condition: "Good",
    brand: "Lodge",
    verifiedWorking: null,
    originalPrice: 35,
    material: "Cast iron",
    description:
      "Re-seasoned before listing, smooth cooking surface, no rust or pitting. Handle is solid with no cracks.",
    seller: "Thistle & Thrift Home",
    stock: 2,
  },
  {
    id: "014",
    name: "Hand Plane, No. 4 Smoothing",
    price: 48,
    category: "Tools",
    condition: "Fair",
    brand: "Stanley",
    era: "1950s",
    verifiedWorking: null,
    description:
      "Sole has been flattened and the blade freshly sharpened. Some surface rust remains on the frog, purely cosmetic.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "015",
    name: "Wooden Building Blocks, 120-piece",
    price: 25,
    category: "Toys & Games",
    condition: "Good",
    verifiedWorking: null,
    material: "Beechwood",
    description:
      "Complete set with the original storage crate. Sanded corners, no splinters found, a good weight for stacking.",
    seller: "Thistle & Thrift Home",
    stock: 1,
  },
  {
    id: "016",
    name: "Canvas Canoe, 15ft",
    price: 260,
    category: "Outdoor & Bikes",
    condition: "Fair",
    era: "1980s",
    verifiedWorking: null,
    material: "Canvas over cedar strip",
    description:
      "Watertight as of last season's use, per the seller — buyer should inspect the hull seams before a first paddle. One replaced thwart.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "017",
    name: "Oak Writing Desk",
    price: 150,
    category: "Furniture",
    condition: "Good",
    era: "1930s",
    verifiedWorking: null,
    material: "Solid oak",
    description:
      "Three drawers, all sliding freely after a recent wax on the runners. Top has a warm, even patina with a few ink stains near the back edge.",
    seller: "Marlowe Estate Clearances",
    stock: 1,
  },
  {
    id: "018",
    name: "Polaroid SX-70 Camera",
    price: 120,
    category: "Electronics",
    condition: "Fair",
    brand: "Polaroid",
    era: "1970s",
    verifiedWorking: null,
    originalPrice: 180,
    description:
      "Folds flat, leather covering is intact. Seller has not been able to test the electronics or shutter — current film stock and battery not included.",
    seller: "Second Spin Audio",
    stock: 1,
  },
  {
    id: "019",
    name: "Kids' Denim Jacket, Age 6–7",
    price: 10,
    category: "Clothing",
    condition: "Good",
    brand: "unbranded",
    verifiedWorking: null,
    material: "Cotton denim",
    description:
      "Light wear at the cuffs, all buttons present, no stains. Grown out of before it got much use.",
    seller: "Corner Rack Vintage",
    stock: 1,
  },
  {
    id: "020",
    name: "Enamel Camping Mug Set of 4",
    price: 16,
    category: "Kitchenware",
    condition: "Good",
    verifiedWorking: null,
    material: "Enameled steel",
    description:
      "Matching navy mugs with white rims, light chipping on two of the four handles. Sturdy for outdoor use.",
    seller: "Thistle & Thrift Home",
    stock: 1,
  },
  {
    id: "021",
    name: "Complete Encyclopedia Set, 1988",
    price: 15,
    category: "Books & Media",
    condition: "Fair",
    era: "1988",
    verifiedWorking: null,
    description:
      "24 volumes, some sun-fading on the spines. Content is naturally out of date for current events but the set is complete and unmarked inside.",
    seller: "Marlowe Estate Clearances",
    stock: 1,
  },
  {
    id: "022",
    name: "Skateboard Deck & Trucks",
    price: 35,
    category: "Outdoor & Bikes",
    condition: "Well-worn",
    brand: "Element",
    verifiedWorking: true,
    description:
      "Grip tape is worn smooth in the middle from use but bearings still spin freely and trucks hold a line. Deck has visible chipping at both tips.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "023",
    name: "Toolbox with Assorted Hand Tools",
    price: 42,
    category: "Tools",
    condition: "Fair",
    verifiedWorking: null,
    description:
      "Metal box with a mixed lot: wrenches, screwdrivers, pliers. Not a matched set, and not every tool has been individually tested — sold as a working lot.",
    seller: "Ridgeline Tool Exchange",
    stock: 1,
  },
  {
    id: "024",
    name: "Jigsaw Puzzle Lot (5 puzzles)",
    price: 12,
    category: "Toys & Games",
    condition: "Good",
    verifiedWorking: null,
    description:
      "Five 500–1000 piece puzzles, seller has checked each box against the piece count where the manufacturer listed one, but cannot guarantee no piece is missing.",
    seller: "Thistle & Thrift Home",
    stock: 1,
  },
];

export function getItem(id: string): Item | undefined {
  return catalogue.find((p) => p.id === id);
}

export const categories: Category[] = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books & Media",
  "Kitchenware",
  "Tools",
  "Toys & Games",
  "Outdoor & Bikes",
];
