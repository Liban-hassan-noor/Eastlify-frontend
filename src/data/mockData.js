export const MOCK_CATEGORIES = [
  { id: '1', name: "Textiles", icon: "Shirt" },
  { id: '2', name: "Electronics", icon: "Smartphone" },
  { id: '3', name: "Cosmetics", icon: "Sparkles" },
  { id: '4', name: "Shoes", icon: "Footprints" },
  { id: '5', name: "Islamic Wear", icon: "Moon" },
  { id: '6', name: "Wholesale", icon: "Box" }
];

export const MOCK_STREETS = [
  "First Avenue", 
  "Second Avenue", 
  "Garage", 
  "Yusuf Haji", 
  "Bangledesh",
  "Eastleigh Mall",
  "Business Bay"
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
    street: "Garage",
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
    categories: ["Cosmetics"],
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
