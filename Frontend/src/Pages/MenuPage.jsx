import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Utensils, ShoppingCart } from "lucide-react";

const DUMMY_MENU_ITEMS = [
  { id: 1, name: "Spicy Chicken Vindaloo", description: "A fiery Goan curry with tender chicken, vinegar, and a blend of hot spices.", price: 18.99, category: "Main Course", isAvailable: true, SpiceLevel: "3" },
  { id: 2, name: "Vegetable Samosas", description: "Crispy pastry filled with spiced potatoes and peas. Served with mint chutney.", price: 7.99, category: "Starters", isAvailable: true, SpiceLevel: "1" },
  { id: 3, name: "Mango Lassi", description: "A refreshing yogurt-based drink blended with sweet mango pulp.", price: 4.50, category: "Drinks", isAvailable: true, SpiceLevel: "0" },
  { id: 4, name: "Garlic Naan", description: "Soft flatbread baked in a tandoor oven with fresh garlic and butter.", price: 3.99, category: "Sides", isAvailable: false, SpiceLevel: "0" },
  { id: 5, name: "Gulab Jamun", description: "Soft, spongy milk-solid balls soaked in a sweet rose-flavored syrup.", price: 6.99, category: "Dessert", isAvailable: true, SpiceLevel: "0" },
  { id: 6, name: "Chef's Special Biryani", description: "Our signature slow-cooked basmati rice with saffron, spices, and your choice of protein.", price: 22.50, category: "Chefs Kiss", isAvailable: true, SpiceLevel: "2" },
];

const SpiceLevelIndicator = ({ level }) => {
  const spiceLevel = parseInt(level, 10) || 0;
  if (spiceLevel === 0) return <span className="text-sm text-gray-400">Mild</span>;
  return (
    <div className="flex items-center text-red-400 text-sm">
      {Array(spiceLevel).fill(0).map((_, i) => (
        <span key={i} role="img" aria-label="chilli" className="mr-1">🌶️</span>
      ))}
    </div>
  );
};

const MenuItemCard = ({ item }) => {
  const { name, description, price, isAvailable, SpiceLevel } = item;
  return (
    <div
      className={`rounded-xl border border-[#2A2F3D] bg-[#1A1C24] p-6 shadow-lg transition-all duration-300 flex flex-col justify-between 
        ${isAvailable ? "hover:bg-[#242836]" : "opacity-50 cursor-not-allowed"}`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <SpiceLevelIndicator level={SpiceLevel} />
        </div>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        {!isAvailable && <p className="text-sm text-red-500">Currently Unavailable</p>}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-semibold text-purple-400">${price.toFixed(2)}</span>
        <button
          disabled={!isAvailable}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
            isAvailable
              ? "bg-white text-gray-900 hover:bg-gray-200"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
        >
          Add
        </button>
      </div>
    </div>
  );
};

const MenuHeader = () => {
  const cartItemCount = 3;

  return (
    <header className="sticky top-0 z-50 bg-[#0D0B14]/95 backdrop-blur-md border-b border-[#2A2F3D]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <Utensils className="h-7 w-7 text-purple-500" />
          <h1 className="text-xl font-bold">RMS</h1>
        </div>

        <Link to="/cart" className="relative p-2 hover:text-purple-400 transition">
          <ShoppingCart className="h-6 w-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      setMenuItems(DUMMY_MENU_ITEMS);
      setIsLoading(false);
    };
    loadMenu();
  }, []);

  useEffect(() => {
    const groups = menuItems.reduce((acc, item) => {
      const category = item.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
    setGroupedMenu(groups);
  }, [menuItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-black to-purple-900">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black to-purple-900 text-white font-sans">
      <MenuHeader />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {Object.keys(groupedMenu).map((category) => (
          <section key={category} className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-white border-b border-purple-600 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMenu[category].map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default MenuPage;
