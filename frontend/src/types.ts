export interface House {
  id: string;
  images: string[];
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  type: string;
  description: string;
  matchScore?: number;
  listing_url?: string;
}
