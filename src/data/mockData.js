export const MOCK_CATEGORIES = [
  { id: '1', name: "Textiles", icon: "Shirt" },
  { id: '2', name: "Islamic Wear", icon: "Moon" },
  { id: '3', name: "Shoes", icon: "Footprints" },
  { id: '4', name: "Cosmetics", icon: "Sparkles" },
  { id: '5', name: "Perfumes & Fragrances", icon: "SprayCan" },
  { id: '6', name: "Electronics", icon: "Smartphone" },
  { id: '7', name: "Phones & Accessories", icon: "Phone" },
  { id: '8', name: "Bags & Luggage", icon: "Briefcase" },
  { id: '9', name: "Kids & Baby Wear", icon: "Baby" },
  { id: '10', name: "Home & Household", icon: "Home" },
  { id: '11', name: "Wholesale", icon: "Box" }
];

export const MOCK_STREETS = [
  "12th Street", "11th Street", "10th Street", "9th Street", "8th Street", 
  "7th Street", "6th Street", "5th Street", "4th Street", "3rd Street", 
  "2nd Street", "1st Street",
  "Jam Street", "Yusuf Haji Avenue", "First Avenue", "Second Avenue", 
  "Garage Road",
  "Eastleigh Mall", "Business Bay", "Garissa Lodge Area", 
  "Amal Plaza Area", "California Area"
];

export const MOCK_SHOPS = [
  {
    id: "1",
    name: "Al-Amin Textiles",
    street: "First Avenue",
    phone: "+254700000001",
    categories: ["Textiles", "Islamic Wear"],
    description: "Best Somali diracs, baatis, and premium fabrics. Wholesale and retail available.",
    image: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    totalCalls: 145,
    orders: 23,
    sales: 85000
  },
  {
    id: "2",
    name: "Digital World Islii",
    street: "Garage Road",
    phone: "+254700000002",
    categories: ["Electronics"],
    description: "Latest iPhones, Samsungs, laptops and accessories. Best prices in Nairobi.",
    image: "https://images.unsplash.com/photo-1596742578443-7682e525c489?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    totalCalls: 210,
    orders: 45,
    sales: 420000
  },
  {
    id: "3",
    name: "Madina Scents",
    street: "Eastleigh Mall",
    phone: "+254700000003",
    categories: ["Cosmetics", "Perfumes & Fragrances"],
    description: "Authentic Arabian perfumes and beauty products.",
    image: "https://images.unsplash.com/photo-1616949755610-8c97321e25b3?auto=format&fit=crop&q=80&w=800",
    rating: 4.2,
    totalCalls: 56,
    orders: 12,
    sales: 35000
  }
];

export const MOCK_ORDERS = [
  { id: '101', customer: "Fatuma Ali", product: "iPhone 13 Pro", status: "Completed", date: "2023-12-01", amount: 120000 },
  { id: '102', customer: "Ahmed Hassan", product: "Samsung Charger", status: "Pending", date: "2023-12-02", amount: 2500 },
  { id: '103', customer: "Halima J", product: "Dirac Set", status: "Completed", date: "2023-12-02", amount: 4500 }
];

export const MOCK_LISTINGS = [
  {
    id: 'l1',
    shopId: '1',
    title: 'Premium Somali Dirac',
    description: 'High quality silk dirac with matching garbarsaar. Available in multiple colors.',
    price: 4500,
    isOnOffer: true,
    offerPrice: 3500,
    availability: 'In Stock',
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800'],
    category: 'Textiles',
    createdAt: '2023-12-01T10:00:00Z'
  },
  {
    id: 'l2',
    shopId: '2',
    title: 'iPhone 15 Pro Max',
    description: 'Brand new, 256GB, Titanium Blue. 1 year Apple Warranty.',
    price: 185000,
    isOnOffer: false,
    availability: 'Limited',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'],
    category: 'Electronics',
    createdAt: '2023-12-02T14:30:00Z'
  }
];
