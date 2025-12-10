import { Product, Category } from './types';

// Pune (411xxx) and Kolhapur (416xxx) pincodes
export const SERVICEABLE_PINCODES = [
  '411001', '411004', '411007', '411038', '411045', // Pune
  '416001', '416002', '416003', '416012', '416229'  // Kolhapur
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Watches' },
  { id: '2', name: 'Fragrance' },
  { id: '3', name: 'Accessories' },
  { id: '4', name: 'Apparel' },
  { id: '5', name: 'Jewelry' },
  { id: '6', name: 'Footwear' },
  { id: '7', name: 'Alcoholic' },
  { id: '8', name: 'Non-Alcoholic' },
  { id: '9', name: 'Limited Time' },
  { id: '10', name: 'Seasonal' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Royal Chronograph",
    description: "A masterpiece of timekeeping in 18k gold plating.",
    price: 12500,
    category: "Watches",
    stock: 5,
    image: "https://picsum.photos/400/400?random=1"
  },
  {
    id: 2,
    name: "Obsidian Essence",
    description: "Rare oud and amber fragrance for the discerning soul.",
    price: 4500,
    category: "Fragrance",
    stock: 12,
    image: "https://picsum.photos/400/400?random=2"
  },
  {
    id: 3,
    name: "Golden Weave Clutch",
    description: "Hand-stitched silk clutch with golden thread embroidery.",
    price: 8900,
    category: "Accessories",
    stock: 3,
    image: "https://picsum.photos/400/400?random=3"
  },
  {
    id: 4,
    name: "Heritage Silk Scarf",
    description: "100% pure silk scarf with ancient royal patterns.",
    price: 2100,
    category: "Apparel",
    stock: 20,
    image: "https://picsum.photos/400/400?random=4"
  },
  {
    id: 5,
    name: "Aurum Cufflinks",
    description: "Minimalist design, maximum impact. Solid brass core.",
    price: 1500,
    category: "Jewelry",
    stock: 15,
    image: "https://picsum.photos/400/400?random=5"
  },
  {
    id: 6,
    name: "Midnight Velvet Loafers",
    description: "Italian velvet loafers with gold-plated bits.",
    price: 6700,
    category: "Footwear",
    stock: 8,
    image: "https://picsum.photos/400/400?random=6"
  },
  // Beverages
  {
    id: 7,
    name: "Vintage Reserve Merlot",
    description: "Aged 12 years, notes of oak and blackberry.",
    price: 3200,
    category: "Alcoholic",
    stock: 25,
    image: "https://picsum.photos/400/400?random=7"
  },
  {
    id: 8,
    name: "Blue Mountain Estate Coffee",
    description: "Single-origin beans roasted to perfection, distinct floral notes.",
    price: 4100,
    category: "Non-Alcoholic",
    stock: 10,
    image: "https://picsum.photos/400/400?random=8"
  },
  {
    id: 9,
    name: "Himalayan Crystal Water",
    description: "Bottled at the source in glass decanters. Limited edition.",
    price: 800,
    category: "Non-Alcoholic",
    stock: 50,
    image: "https://picsum.photos/400/400?random=9"
  },
  {
    id: 10,
    name: "Classic Cola",
    description: "Refreshing carbonated beverage served in crystal glass.",
    price: 150,
    category: "Non-Alcoholic",
    stock: 100,
    image: "https://picsum.photos/400/400?random=10"
  },
  {
    id: 11,
    name: "Thumbs Up",
    description: "Strong, spicy, fizzy cola. The taste of thunder.",
    price: 150,
    category: "Non-Alcoholic",
    stock: 100,
    image: "https://picsum.photos/400/400?random=11"
  },
  {
    id: 12,
    name: "Artisan Lemonade",
    description: "Freshly squeezed lemons with a hint of mint and ginger.",
    price: 250,
    category: "Seasonal",
    stock: 40,
    image: "https://picsum.photos/400/400?random=12"
  },
  {
    id: 13,
    name: "Gold Flake Champagne",
    description: "Sparkling wine infused with edible 24k gold flakes.",
    price: 15000,
    category: "Limited Time",
    stock: 5,
    image: "https://picsum.photos/400/400?random=13"
  }
];