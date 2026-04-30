"use client";
import { useState } from "react";
import Image from "next/image";
import { Food, CartItem } from "./page";

interface ProductClientProps {
  food: Food;
  globalCart: CartItem[];
  onAddToCart: (item: CartItem) => void;
}

export default function ProductClient({ food, onAddToCart }: ProductClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    food.variants?.length > 0 ? food.variants[0] : { size: "Standard", price: food.basePrice || 0, strikePrice: food.baseStrikePrice }
  );
  const [selectedSpice, setSelectedSpice] = useState("Not Spicy");

  const currentPrice = selectedVariant.price;
  const currentStrike = selectedVariant.strikePrice;

  const handleAdd = () => {
    onAddToCart({
      id: `${food._id}-${Date.now()}`,
      name: food.name,
      size: selectedVariant.size,
      spice: selectedSpice,
      price: currentPrice
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-gray-100 shadow-2xl">
        {food.imageUrl ? (
          <Image src={food.imageUrl} alt={food.name} fill className="object-cover transition-transform duration-700 hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
        )}
      </div>

      <div className="flex flex-col h-full justify-center">
        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black mb-4">{food.name}</h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10 max-w-md">{food.description}</p>

        {food.variants?.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4">Choose Size</p>
            <div className="flex flex-wrap gap-3">
              {food.variants.map((v) => (
                <button
                  key={v.size}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedVariant.size === v.size ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-4">Spice Level</p>
          <div className="flex gap-3">
            {["Not Spicy", "Medium", "Extra Spicy"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSpice(s)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedSpice === s ? "bg-orange-600 text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div>
            {currentStrike && <p className="text-sm text-gray-400 line-through font-bold">₦{currentStrike.toLocaleString()}</p>}
            {/* PRICE IS NOW SOLID BLACK */}
            <p className="text-4xl font-black italic text-black">₦{currentPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex-1 bg-black text-white py-6 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
}