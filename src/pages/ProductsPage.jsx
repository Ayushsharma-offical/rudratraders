import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const sampleProducts = [
  { id: 1, name: "Poultry Feed Machine 5 HP", capacity: "100-150 KG/HR", price: 147500.00, image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=500" },
  { id: 2, name: "Mixture Machine", capacity: "50 KG/HR", price: 59000.00, image: "https://images.unsplash.com/photo-1565514020179-026b92b2d796?auto=format&fit=crop&q=80&w=500" },
  { id: 3, name: "Cyclone Grinder 3 HP", capacity: "Heavy Duty", price: 59000.00, image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=500" },
  { id: 4, name: "Industrial Oven", capacity: "50 Trays", price: 210000.00, image: "https://images.unsplash.com/photo-1611117765103-6e3e53ba2dbb?auto=format&fit=crop&q=80&w=500" },
];

const ProductsPage = () => {
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('rudra_cart') || '[]');
    const existing = currentCart.find(item => item.id === product.id);
    if(existing) {
      existing.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('rudra_cart', JSON.stringify(currentCart));
    alert(`${product.name} added to Quote Request.`);
  };

  return (
    <div className="py-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">Industrial <span className="text-brand-gold">Machinery</span></h1>
          <p className="text-gray-400">High-performance MSME equipment. Add to cart to generate a custom quotation.</p>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="btn-outline flex items-center"
        >
          <ShoppingCart className="mr-2 w-5 h-5" /> View Quote Cart
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sampleProducts.map(product => (
          <div key={product.id} className="bg-brand-dark border border-brand-green rounded-xl overflow-hidden group hover:border-brand-gold transition duration-300 shadow-lg">
            <div className="h-48 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
              <p className="text-sm text-brand-bronze mb-4">{product.capacity}</p>
              <div className="flex justify-between items-center mt-6">
                <span className="text-xl font-bold text-brand-gold">₹{product.price.toLocaleString()}</span>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="bg-brand-green hover:bg-brand-gold hover:text-brand-dark text-white p-2 rounded-full transition duration-300"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
