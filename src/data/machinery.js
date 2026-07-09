// Centralized machinery data - used across all pages
export const MACHINERY = [
  {
    id: 1,
    name: "Poultry Feed Machine 5 HP",
    category: "Feed Processing",
    capacity: "100–150 KG/HR",
    price: 147500,
    originalPrice: 170000,
    rating: 4.9,
    reviews: 28,
    description: "Heavy-duty poultry feed making machine with 5HP motor. Suitable for small to medium poultry farms. Produces uniform pellets with minimal wastage.",
    features: ["5HP Electric Motor", "100–150 KG/HR Capacity", "Die & Roller Included", "Easy Maintenance", "Low Power Consumption"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
    tag: "Bestseller",
    inStock: true,
  },
  {
    id: 2,
    name: "Mixture Machine 50 KG/HR",
    category: "Mixing Equipment",
    capacity: "50 KG/HR",
    price: 59000,
    originalPrice: 72000,
    rating: 4.8,
    reviews: 19,
    description: "Industrial-grade mixture machine for uniform blending of dry powders, grains, and spices. Stainless steel drum with anti-stick coating.",
    features: ["50 KG/HR Capacity", "SS Drum", "Variable Speed Control", "Dust Proof Design", "3 HP Motor"],
    image: "https://images.unsplash.com/photo-1565514020179-026b92b2d796?auto=format&fit=crop&q=80&w=600",
    tag: "Popular",
    inStock: true,
  },
  {
    id: 3,
    name: "Cyclone Grinder 3 HP",
    category: "Grinding Equipment",
    capacity: "80–100 KG/HR",
    price: 59000,
    originalPrice: 68000,
    rating: 4.7,
    reviews: 22,
    description: "High-speed cyclone grinder for fine grinding of spices, pulses, and grains. Air-cooled mechanism prevents overheating during continuous operation.",
    features: ["3 HP Motor", "Air-Cooled System", "Fine Mesh Output", "Stainless Blades", "Low Noise"],
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600",
    tag: "New",
    inStock: true,
  },
  {
    id: 4,
    name: "Oil Expeller Machine 10 HP",
    category: "Oil Processing",
    capacity: "40–50 KG/HR",
    price: 185000,
    originalPrice: 210000,
    rating: 4.8,
    reviews: 15,
    description: "Cold-press oil expeller for extracting oil from mustard, groundnut, sunflower, and coconut. Food-grade output with minimal heat generation.",
    features: ["10 HP Motor", "Cold Press Technology", "Multi-Seed Compatible", "Auto Temperature Control", "Food Grade SS Body"],
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    tag: "Premium",
    inStock: true,
  },
  {
    id: 5,
    name: "Flour Milling Plant 20 HP",
    category: "Flour Milling",
    capacity: "200–250 KG/HR",
    price: 320000,
    originalPrice: 380000,
    rating: 4.9,
    reviews: 11,
    description: "Complete flour milling solution for wheat, maize, and other grains. Produces fine atta with precise roller adjustment. Suitable for mini flour mills.",
    features: ["20 HP Main Motor", "Pneumatic Roller Adjustment", "Bran Separator", "Automatic Bagging", "3-Phase Power"],
    image: "https://images.unsplash.com/photo-1536304993881-ff86e6f25b84?auto=format&fit=crop&q=80&w=600",
    tag: "Heavy Duty",
    inStock: true,
  },
  {
    id: 6,
    name: "Spice Grinding Plant",
    category: "Spice Processing",
    capacity: "100 KG/HR",
    price: 95000,
    originalPrice: 115000,
    rating: 4.6,
    reviews: 18,
    description: "Complete spice grinding solution with pre-cleaning, grinding, and packaging. Suitable for chilli, turmeric, coriander, and blended spices.",
    features: ["Pre-Cleaner Included", "100 KG/HR Output", "Aroma Retention Tech", "Dust-Free Design", "Stainless Interior"],
    image: "https://images.unsplash.com/photo-1544006659-f0b21884ce1d?auto=format&fit=crop&q=80&w=600",
    tag: "Popular",
    inStock: true,
  },
  {
    id: 7,
    name: "Bakery Oven 50-Tray",
    category: "Bakery Equipment",
    capacity: "50 Trays",
    price: 210000,
    originalPrice: 250000,
    rating: 4.7,
    reviews: 9,
    description: "Commercial rotary rack oven for bread, biscuits, cakes and more. Even heat distribution with motorized rack rotation. Digital temperature control.",
    features: ["50 Tray Capacity", "Digital Controls", "Rotary Rack", "Even Heat Distribution", "Electric/Gas Options"],
    image: "https://images.unsplash.com/photo-1611117765103-6e3e53ba2dbb?auto=format&fit=crop&q=80&w=600",
    tag: "Bestseller",
    inStock: true,
  },
  {
    id: 8,
    name: "Dal Mill Machine 15 HP",
    category: "Dal Processing",
    capacity: "150–200 KG/HR",
    price: 245000,
    originalPrice: 290000,
    rating: 4.8,
    reviews: 13,
    description: "Compact dal mill suitable for processing moong, chana, arhar, and other pulses. Adjustable splitting and polishing units for different dal sizes.",
    features: ["15 HP Motor", "Adjustable Splitter", "Polishing Drum", "Self-Priming", "Compact Design"],
    image: "https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&q=80&w=600",
    tag: "Heavy Duty",
    inStock: false,
  },
];

export const CATEGORIES = ['All', 'Feed Processing', 'Mixing Equipment', 'Grinding Equipment', 'Oil Processing', 'Flour Milling', 'Spice Processing', 'Bakery Equipment', 'Dal Processing'];

export const addToCart = (product, quantity = 1) => {
  const cart = JSON.parse(localStorage.getItem('rudra_cart') || '[]');
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  localStorage.setItem('rudra_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart_updated'));
};

export const getCart = () => JSON.parse(localStorage.getItem('rudra_cart') || '[]');

export const removeFromCart = (id) => {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem('rudra_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart_updated'));
};

export const updateQty = (id, qty) => {
  const cart = getCart().map(i => i.id === id ? { ...i, quantity: qty } : i).filter(i => i.quantity > 0);
  localStorage.setItem('rudra_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart_updated'));
};

export const clearCart = () => {
  localStorage.removeItem('rudra_cart');
  window.dispatchEvent(new Event('cart_updated'));
};
