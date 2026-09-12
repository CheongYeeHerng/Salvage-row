/**
 * Simulated contact details for the demo's fictional sellers, keyed by the
 * exact `seller` string used in data/catalogue.ts. Entirely made up for
 * demo purposes — not real phone numbers or addresses.
 */
export interface SellerContact {
  phone: string;
  email: string;
}

export const sellers: Record<string, SellerContact> = {
  "Marlowe Estate Clearances": {
    phone: "(555) 010-2841",
    email: "hello@marlowe-estate.example",
  },
  "Second Spin Audio": {
    phone: "(555) 010-7723",
    email: "sales@secondspinaudio.example",
  },
  "Corner Rack Vintage": {
    phone: "(555) 010-4459",
    email: "shop@cornerrackvintage.example",
  },
  "Thistle & Thrift Home": {
    phone: "(555) 010-9012",
    email: "hi@thistleandthrift.example",
  },
  "Ridgeline Tool Exchange": {
    phone: "(555) 010-3376",
    email: "contact@ridgelinetools.example",
  },
};

export function getSellerContact(seller: string): SellerContact | undefined {
  return sellers[seller];
}
