"use client";
import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import ProductClient from "./ProductClient";

// Interfaces
export interface FoodVariant {
  size: string;
  price: number;
  strikePrice?: number;
}

export interface Food {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  variants: FoodVariant[];
  basePrice?: number;
  baseStrikePrice?: number;
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  spice: string;
  price: number;
}

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('vees-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart load failed", e);
      }
    }

    async function fetchFoods() {
      try {
        const query = `*[_type == "food"] | order(_createdAt desc) {
          _id, name, category, description,
          "imageUrl": image.asset->url,
          variants, basePrice, baseStrikePrice
        }`;
        const data = await client.fetch(query, {}, { cache: 'no-store' });
        setFoods(data || []);
      } catch (error) {
        console.error("Sanity fetch failed:", error);
      } finally {
        setLoading(false); // Safety: Stop loading even if network fails
      }
    }
    fetchFoods();
  }, []);

  const addToCart = (newItem: CartItem) => {
    const newCart = [...cart, newItem];
    setCart(newCart);
    localStorage.setItem('vees-cart', JSON.stringify(newCart));
    setShowCart(true);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('vees-cart', JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const checkout = () => {
    const itemsList = cart.map(item => 
      `• ${item.name} (${item.size === 'Standard' ? '' : item.size + ', '}${item.spice}): ₦${item.price.toLocaleString()}`
    ).join('\n');
    
    const message = encodeURIComponent(
      `Hello Veesfoodieshub, I want to order:\n\n${itemsList}\n\n*Total: ₦${totalPrice.toLocaleString()}*`
    );
    window.open(`https://wa.me/2349017160061?text=${message}`, "_blank");
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["soups", "stews", "rice-pasta", "combos", "lunch"];
  const categoryTitles: Record<string, string> = {
    soups: "Our Signature Soups",
    stews: "Rich & Tasty Stews",
    "rice-pasta": "Rice & Pasta Trays",
    combos: "Premium Food Combos",
    lunch: "Everyday Lunch Packs"
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbf5]">
      <div className="text-2xl font-black uppercase italic animate-pulse text-orange-600">Loading Vibe...</div>
    </div>
  );

  if (!showMenu) {
    return (
      <main className="min-h-screen bg-[#fffbf5] flex flex-col justify-center items-center px-6 text-center">
        <div className="relative mb-8">
          <h1 className="text-7xl md:text-[12rem] font-black uppercase italic tracking-tighter text-orange-600 leading-[0.8]">
            Vees<br />Foodies<br />Hub
          </h1>
          <div className="absolute -top-4 -right-4 bg-black text-white text-[10px] font-black px-4 py-2 rounded-full rotate-12 uppercase tracking-widest shadow-xl">
            Abuja's Finest
          </div>
        </div>
        <p className="max-w-md text-sm font-bold uppercase tracking-[0.3em] text-black mb-12">
          Authentic Flavors. <br />No Long Talk, Just Great Food.
        </p>
        <button 
          onClick={() => setShowMenu(true)}
          className="bg-black text-white px-12 py-6 rounded-full font-black uppercase text-sm tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] active:scale-95 w-full max-w-xs"
        >
          Enter Menu
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffbf5] px-6 py-20 md:px-12 lg:px-24 pb-40">
      <header className="mb-20 text-center">
        <button onClick={() => setShowMenu(false)} className="mb-8 text-[10px] font-black uppercase tracking-widest border-b-2 border-black hover:text-orange-600">← Back Home</button>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-orange-600 md:text-7xl mb-4">VeesFoodiesHub</h1>
        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-12">
          <a href="tel:+2349017160061">📞 +234 901 716 0061</a>
          <a href="mailto:veesfoodieshub@gmail.com">✉️ veesfoodieshub@gmail.com</a>
        </div>
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for a meal..."
            className="w-full px-8 py-4 rounded-full border-2 border-black focus:border-orange-600 outline-none text-black font-medium transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {categories.map((cat) => {
        const sectionFoods = filteredFoods.filter((f) => f.category === cat);
        if (sectionFoods.length === 0) return null;
        return (
          <section key={cat} className="mb-32">
            <div className="mb-12 border-b-2 border-black pb-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-black">{categoryTitles[cat] || cat}</h2>
            </div>
            <div className="space-y-24">
              {sectionFoods.map((food) => (
                <ProductClient key={food._id} food={food} globalCart={cart} onAddToCart={addToCart} />
              ))}
            </div>
          </section>
        );
      })}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-8 pointer-events-none">
          <div className="max-w-md mx-auto bg-black text-white p-6 rounded-3xl shadow-2xl pointer-events-auto flex justify-between items-center border border-white/10">
            <div onClick={() => setShowCart(!showCart)} className="cursor-pointer">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Your Order ({cart.length})</p>
              <p className="text-xl font-bold italic">₦{totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={checkout} className="bg-orange-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">Checkout</button>
          </div>
          {showCart && (
            <div className="max-w-md mx-auto bg-white text-black mt-4 p-6 rounded-3xl shadow-2xl pointer-events-auto border border-gray-100 max-h-[40vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50 last:border-0 px-2">
                  <div>
                    <p className="font-bold text-sm uppercase">{item.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{item.size !== 'Standard' ? `${item.size} • ` : ''}{item.spice}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="mt-40 pb-20 text-center border-t border-gray-100 pt-20">
        <div className="flex justify-center gap-10 mb-8">
          <a href="https://instagram.com/veesfoodieshub" target="_blank" className="text-2xl font-black italic uppercase hover:text-orange-600 transition-all">Instagram</a>
          <a href="https://tiktok.com/@veesfoodieshub" target="_blank" className="text-2xl font-black italic uppercase hover:text-orange-600 transition-all">TikTok</a>
        </div>
        <p className="text-[9px] font-medium text-gray-300 uppercase tracking-[0.2em]">© 2026 VeesFoodiesHub • Built by Ahneke</p>
      </footer>
    </main>
  );
}