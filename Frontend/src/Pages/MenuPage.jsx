import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Utensils, ShoppingCart } from "lucide-react";
import api from '../axios';

// --- HELPER COMPONENTS ---

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

const MenuItemCard = ({ item, onAddItem }) => {
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
        <span className="text-lg font-semibold text-purple-400">₹{price.toFixed(2)}</span>
        <button
          onClick={() => onAddItem(item)}
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
  return (
    <header className="sticky top-0 z-50 bg-[#0D0B14]/95 backdrop-blur-md border-b border-[#2A2F3D]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <Utensils className="h-7 w-7 text-purple-500" />
          <h1 className="text-xl font-bold">Table T101</h1>
        </div>
      </div>
    </header>
  );
};

const OrderSummary = ({ items, onPlaceOrder, onRemoveItem, onUpdateQuantity }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="bg-[#1A1C24] p-6 rounded-xl shadow-2xl sticky top-20 text-center text-gray-500">
        Start by adding items to your order.
      </div>
    );
  }

  return (
    <div className="bg-[#1A1C24] p-6 rounded-xl shadow-2xl sticky top-20">
      <h2 className="text-2xl font-bold text-white mb-4 border-b border-purple-600 pb-2">
        Order Summary
      </h2>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between text-sm border-b border-gray-700/50 pb-2">
            <div className="flex flex-col">
              <span className="font-semibold text-white">{item.name}</span>
              <span className="text-purple-400">₹{item.price.toFixed(2)} ea.</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="bg-gray-700 w-6 h-6 rounded-full text-white hover:bg-gray-600 disabled:opacity-50"
              >
                -
              </button>
              <span className="w-5 text-center font-bold">{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                className="bg-gray-700 w-6 h-6 rounded-full text-white hover:bg-gray-600"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => onRemoveItem(item._id)}
              className="text-red-500 hover:text-red-400"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-purple-600 pt-4 space-y-2">
        <div className="flex justify-between text-gray-300 text-sm">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-300 text-sm">
          <span>Tax (5%):</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white text-xl font-bold pt-2">
          <span>Total:</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => onPlaceOrder(total)}
        className="w-full mt-6 bg-purple-600 text-white p-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition"
      >
        Send Order & Pay Now
      </button>
    </div>
  );
};

// --- MAIN COMPONENT ---
const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [groupedMenu, setGroupedMenu] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [finalBill, setFinalBill] = useState(null);


  // --- Helper Functions for Cart Management ---

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prevItems) => 
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleAddItemToCart = (itemToAdd) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === itemToAdd._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === itemToAdd._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // --- API Call to Place Order ---

  const handlePlaceOrder = async (totalAmount) => {
    if (cartItems.length === 0) return;

    if (!window.confirm(`Confirm order totaling ₹${totalAmount.toFixed(2)}? This action sends the order to the kitchen.`)) {
        return;
    }

    try {
      const orderData = cartItems.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity,
      }));

      const response = await api.post('/order/create', { items: orderData });
      
      setFinalBill({ 
        orderId: response.data.data._id, 
        total: totalAmount, 
        items: cartItems 
      });
      setIsOrderSent(true); 
      setCartItems([]);


    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error.response?.data?.message || "Failed to place order. Please call the waiter.");
    }
  };


  // --- Data Loading Logic ---

  useEffect(() => {
    const loadMenu = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/menu');
        setMenuItems(response.data.data);
      } catch (error) {
        console.error("Failed to fetch menu:", error);
      } finally {
        setIsLoading(false);
      }
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

  // --- JSX Return ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-black to-purple-900">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Final Bill View ---
  if (isOrderSent && finalBill) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-black to-purple-900 text-white font-sans p-8">
        <MenuHeader />
        <div className="max-w-xl mx-auto mt-16 p-8 rounded-xl shadow-2xl bg-[#1A1C24] text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-4">Order Sent & Payment Pending!</h2>
          <p className="text-lg text-gray-300 mb-6">Your order (ID: {finalBill.orderId}) has been successfully sent to the kitchen.</p>
          
          <div className="border border-purple-700 p-4 rounded-lg space-y-3 mb-6">
            <h3 className="text-xl font-semibold mb-2">Final Bill Summary</h3>
            {finalBill.items.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-gray-400">
                    <span>{item.name} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="border-t border-purple-700 pt-3 flex justify-between text-2xl font-bold text-white">
                <span>Total Amount:</span>
                <span>₹{finalBill.total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-yellow-400 mb-4">
            Please show this summary to the waiter for UPI/Card payment processing. Thank you!
          </p>
          <button
            onClick={() => {
                setIsOrderSent(false);
                setFinalBill(null);
            }}
            className="mt-4 bg-purple-600 text-white p-3 rounded-lg text-lg font-bold hover:bg-purple-700 transition"
          >
            Start New Order
          </button>
        </div>
      </div>
    );
  }


  // --- Main Menu View ---
  return (
    <div className="min-h-screen bg-gradient-to-tr from-black to-purple-900 text-white font-sans">
      <MenuHeader />
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-3 gap-12">
        
        {/* Menu Section (2/3 width) */}
        <div className="col-span-2">
            {Object.keys(groupedMenu).map((category) => (
              <section key={category} className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-white border-b border-purple-600 pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {groupedMenu[category].map((item) => (
                    <MenuItemCard 
                      key={item._id} 
                      item={item} 
                      onAddItem={handleAddItemToCart} 
                    />
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Order Summary Sidebar (1/3 width) */}
        <div className="col-span-1">
          <OrderSummary 
            items={cartItems} 
            onPlaceOrder={handlePlaceOrder}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>
        
      </main>
    </div>
  );
};

export default MenuPage;