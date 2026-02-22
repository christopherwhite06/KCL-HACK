import type { House } from "../types";

/** Egham / Royal Holloway area – fallback when Scansan is unavailable. ~51.426, -0.566 */
const BASE_LAT = 51.426;
const BASE_LNG = -0.566;

const STREETS = [
  "High Street",
  "Station Road",
  "Victoria Street",
  "Campbell Road",
  "Church Road",
  "Thorpe Road",
  "Runnymede Mews",
  "Egham Hill",
  "Princess Royal Drive",
  "Englefield Green",
  "Barley Mow Passage",
  "Saville Gardens",
  "Windsor Road",
  "St Jude's Road",
  "Runnymede Close",
  "Thorpe Lane",
  "Bishopsgate Road",
  "Callow Hill",
  "Mill Lane",
  "Bourne Road",
  "Sunnyside Road",
  "Church Lane",
  "College Road",
  "Cooper's Hill",
  "Wick Road",
  "Stoneleigh Road",
  "Alexandra Road",
  "Harvest Road",
  "Runnymede Way",
  "The Causeway",
];

const IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
];

function house(i: number): House {
  const street = STREETS[i % STREETS.length];
  const num = (i % 24) + 1;
  const lat = BASE_LAT + (Math.sin(i * 0.7) * 0.008) + (i * 0.0002);
  const lng = BASE_LNG + (Math.cos(i * 0.5) * 0.012) + (i * 0.0001);
  const bedrooms = (i % 4) + 1;
  const bathrooms = Math.max(1, (i % 3) + 1);
  const rent = 900 + (i % 12) * 120 + bedrooms * 80;
  return {
    id: `egham-${i + 1}`,
    images: [IMAGES[i % IMAGES.length], IMAGES[(i + 1) % IMAGES.length]],
    price: rent,
    currency: "GBP",
    bedrooms,
    bathrooms,
    squareFeet: 550 + bedrooms * 180 + (i % 5) * 50,
    location: {
      address: `${num} ${street}`,
      city: "Egham",
      state: "Surrey",
      zipCode: "TW20",
      coordinates: { lat, lng },
    },
    type: bedrooms >= 3 ? "house" : "apartment",
    description: `Property to rent near Royal Holloway, Egham. ${street}.`,
    matchScore: 70 + (i % 25),
  };
}

export const EGHAM_FALLBACK_HOUSES: House[] = Array.from({ length: 30 }, (_, i) => house(i));
