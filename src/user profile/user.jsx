import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  CreditCard,
  Star,
  Clock,
  CheckCircle,
  Utensils,
  Plus,
  Minus,
  Trash2,
  X,
  Search,
  Filter,
  MessageSquare,
  ThumbsUp,
  Award,
  ArrowLeft,
  Package,
  ChefHat,
  Truck,
  Home,
  User,
  Bell,
  Menu as MenuIcon,
} from "lucide-react";

const CustomerOrderApp = () => {
  const [currentView, setCurrentView] = useState("menu"); // menu, cart, payment, tracking, review
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [tableNumber, setTableNumber] = useState("5");
  const [orderHistory, setOrderHistory] = useState([]);

  // Mock Menu Data
  const menuItems = [
    {
      id: 1,
      name: "Butter Chicken",
      category: "Main Course",
      price: 450,
      image: "🍛",
      rating: 4.8,
      desc: "Creamy tomato-based curry with tender chicken",
      veg: false,
      spicy: 2,
    },
    {
      id: 2,
      name: "Paneer Tikka",
      category: "Starter",
      price: 320,
      image: "🧀",
      rating: 4.6,
      desc: "Grilled cottage cheese with aromatic spices",
      veg: true,
      spicy: 1,
    },
    {
      id: 3,
      name: "Biryani",
      category: "Main Course",
      price: 380,
      image: "🍚",
      rating: 4.9,
      desc: "Fragrant basmati rice with aromatic spices",
      veg: false,
      spicy: 2,
    },
    {
      id: 4,
      name: "Mango Lassi",
      category: "Beverage",
      price: 120,
      image: "🥤",
      rating: 4.7,
      desc: "Refreshing yogurt drink with mango pulp",
      veg: true,
      spicy: 0,
    },
    {
      id: 5,
      name: "Gulab Jamun",
      category: "Dessert",
      price: 150,
      image: "🍮",
      rating: 4.5,
      desc: "Sweet dumplings in rose-flavored syrup",
      veg: true,
      spicy: 0,
    },
    {
      id: 6,
      name: "Dal Makhani",
      category: "Main Course",
      price: 280,
      image: "🍲",
      rating: 4.4,
      desc: "Black lentils cooked with butter and cream",
      veg: true,
      spicy: 1,
    },
    {
      id: 7,
      name: "Chicken Tikka",
      category: "Starter",
      price: 350,
      image: "🍗",
      rating: 4.7,
      desc: "Marinated chicken grilled to perfection",
      veg: false,
      spicy: 2,
    },
    {
      id: 8,
      name: "Naan",
      category: "Bread",
      price: 50,
      image: "🫓",
      rating: 4.6,
      desc: "Soft leavened flatbread",
      veg: true,
      spicy: 0,
    },
  ];

  const categories = [
    "All",
    "Starter",
    "Main Course",
    "Bread",
    "Beverage",
    "Dessert",
  ];

  // Cart Functions
  const addToCart = (item) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart(
      cart
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + change;
            return newQty > 0 ? { ...i, quantity: newQty } : i;
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getSubtotal = () => getTotalAmount();
  const getTax = () => Math.round(getSubtotal() * 0.05); // 5% GST
  const getFinalTotal = () => getSubtotal() + getTax();

  // Filter Menu
  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Process Payment
  const processPayment = (paymentMethod) => {
    const newOrder = {
      id: "ORD" + Date.now(),
      items: [...cart],
      total: getFinalTotal(),
      status: "placed",
      timestamp: new Date().toISOString(),
      table: tableNumber,
      paymentMethod: paymentMethod,
      estimatedTime: 25,
    };

    setCurrentOrder(newOrder);
    setOrderHistory([newOrder, ...orderHistory]);
    setCart([]);
    setCurrentView("tracking");

    // Simulate order status updates
    setTimeout(() => {
      setCurrentOrder((prev) => ({
        ...prev,
        status: "preparing",
        estimatedTime: 15,
      }));
    }, 5000);

    setTimeout(() => {
      setCurrentOrder((prev) => ({
        ...prev,
        status: "ready",
        estimatedTime: 5,
      }));
    }, 15000);

    setTimeout(() => {
      setCurrentOrder((prev) => ({
        ...prev,
        status: "served",
        estimatedTime: 0,
      }));
    }, 25000);
  };

  // Menu View
  const MenuView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Table {tableNumber}</h1>
            <p className="text-sm text-white/80">Browse our delicious menu</p>
          </div>
          <button
            onClick={() => setCurrentView("cart")}
            className="relative bg-white/20 backdrop-blur p-3 rounded-xl hover:bg-white/30 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-5 h-5 z-1" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder-white/60"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <div className="p-4">
              <div className="flex gap-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-black text-xl text-left">
                      {item.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.veg
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.veg ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>
                  </div>
                  <p className="text-xs text-left text-gray-500 mb-2">
                    {item.desc}
                  </p>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {item.rating}
                      </span>
                    </div>
                    {item.spicy > 0 && (
                      <span className="text-red-500 text-sm mr-5">
                        {"🌶️".repeat(item.spicy)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Cart View
  const CartView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentView("menu")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold">Your Cart</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => setCurrentView("menu")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white text-black rounded-xl shadow-lg p-4"
              >
                <div className="flex gap-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-bold text-lg">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 text-black rounded-xl p-6 space-y-3">
            <h3 className="font-bold text-left text-lg mb-4">Bill Summary</h3>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{getSubtotal()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>GST (5%)</span>
              <span>₹{getTax()}</span>
            </div>
            <div className="border-t-2 border-gray-300 pt-3 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-blue-600">₹{getFinalTotal()}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView("payment")}
            className="w-full py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-bold text-lg shadow-lg"
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );

  // Payment View
  const PaymentView = () => {
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [upiId, setUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
      setProcessing(true);
      setTimeout(() => {
        processPayment(selectedMethod);
        setProcessing(false);
      }, 2000);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView("cart")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Payment</h2>
        </div>

        {/* Order Summary */}
        <div className="bg-linear-to-br from-blue-50 to-purple-50 text-black rounded-xl p-6 border-2 border-blue-200">
          <h3 className="font-bold text-left text-xl mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-blue-300 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>
              Total Amount <i className="font-light">(5% GST)</i>
            </span>
            <span className="text-blue-600">₹{getFinalTotal()}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="font-bold text-left">Select Payment Method</h3>

          {/* UPI */}
          <div
            onClick={() => setSelectedMethod("upi")}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${
              selectedMethod === "upi"
                ? "border-blue-500 bg-blue-50 text-black"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                UPI
              </div>
              <div className="flex flex-col justify-start items-start">
                <div className="font-bold">UPI Payment</div>
                <div className="text-sm text-gray-500">
                  Google Pay, PhonePe, Paytm
                </div>
              </div>
            </div>
            {selectedMethod === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., user@paytm)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>

          {/* Card */}
          <div
            onClick={() => setSelectedMethod("card")}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${
              selectedMethod === "card"
                ? "border-blue-500 bg-blue-50 text-black"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-10 h-10 text-blue-500" />
              <div>
                <div className="font-bold">Credit/Debit Card</div>
                <div className="text-sm text-gray-500">
                  Visa, Mastercard, Rupay
                </div>
              </div>
            </div>
            {selectedMethod === "card" && (
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                maxLength="16"
              />
            )}
          </div>

          {/* Wallet */}
          <div
            onClick={() => setSelectedMethod("wallet")}
            className={`border-2 rounded-xl p-4 cursor-pointer transition ${
              selectedMethod === "wallet"
                ? "border-blue-500 bg-blue-50 text-black"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                💰
              </div>
              <div>
                <div className="font-bold">Digital Wallet</div>
                <div className="text-sm text-gray-500">
                  Paytm, Amazon Pay, FreeCharge
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition ${
            processing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing Payment...
            </span>
          ) : (
            `Pay ₹${getFinalTotal()}`
          )}
        </button>

        <div className="text-center text-sm text-gray-500">
          🔒 Secured by 256-bit SSL encryption
        </div>
      </div>
    );
  };

  // Order Tracking View
  const TrackingView = () => {
    if (!currentOrder) return null;

    const statusSteps = [
      {
        key: "placed",
        label: "Order Placed",
        icon: <CheckCircle />,
        color: "text-green-500",
      },
      {
        key: "preparing",
        label: "Preparing",
        icon: <ChefHat />,
        color: "text-yellow-500",
      },
      {
        key: "ready",
        label: "Ready",
        icon: <Package />,
        color: "text-blue-500",
      },
      {
        key: "served",
        label: "Served",
        icon: <Utensils />,
        color: "text-purple-500",
      },
    ];

    const currentStepIndex = statusSteps.findIndex(
      (s) => s.key === currentOrder.status
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Track Your Order</h2>
          <p className="text-gray-600">Order ID: {currentOrder.id}</p>
        </div>

        {/* Success Animation */}
        {currentOrder.status === "placed" && (
          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center border-2 border-green-200">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Your order has been placed successfully
            </p>
          </div>
        )}

        {/* Status Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-6">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isCompleted
                          ? "bg-linear-to-br from-blue-500 to-purple-500 text-white scale-110"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className={`w-1 h-12 transition ${
                          isCompleted ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3
                      className={`font-bold text-lg ${
                        isCurrent
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {isCurrent && currentOrder.estimatedTime > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Estimated time: {currentOrder.estimatedTime} min
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-xl text-black p-6">
          <h3 className="font-bold mb-4">Order Details</h3>
          <div className="space-y-2">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="text-green-600">₹{currentOrder.total}</span>
            </div>
          </div>
        </div>

        {currentOrder.status === "served" && (
          <button
            onClick={() => setCurrentView("review")}
            className="w-full py-4 bg-linear-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition font-bold shadow-lg flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            Leave a Review
          </button>
        )}

        <button
          onClick={() => setCurrentView("menu")}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
        >
          Back to Menu
        </button>
      </div>
    );
  };

  // Review View
  const ReviewView = () => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
      // Here you would send the review to the backend
      setSubmitted(true);
      setTimeout(() => {
        setCurrentView("menu");
      }, 2000);
    };

    if (submitted) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600">Your feedback helps us improve</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView("tracking")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Rate Your Experience</h2>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-orange-50 rounded-xl p-8 text-center border-2 border-yellow-200">
          <h3 className="text-lg font-semibold text-black mb-4">
            How was your experience?
          </h3>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600">
              {rating === 5
                ? "Excellent!"
                : rating === 4
                ? "Great!"
                : rating === 3
                ? "Good"
                : rating === 2
                ? "Fair"
                : "Poor"}
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Share your feedback
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows="6"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Great Food",
            "Quick Service",
            "Good Ambience",
            "Value for Money",
          ].map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 text-black bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-lg text-sm transition"
            >
              {tag}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition ${
            rating === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          }`}
        >
          Submit Review
        </button>
      </div>
    );
  };

  // Main Rendering
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Simple Profile Header */}
      <div className="flex items-center gap-3 mb-4">
        <User className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full p-2" />
        <div>
          <h2 className="font-bold text-lg">Welcome!</h2>
          <p className="text-sm text-gray-500">Table {tableNumber}</p>
        </div>
        <button
          className="ml-auto p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setCurrentView("tracking")}
          title="Track Current Order"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => setCurrentView("menu")}
          title="Go to Menu"
        >
          <MenuIcon className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* View Area */}
      <div>
        {currentView === "menu" && <MenuView />}
        {currentView === "cart" && <CartView />}
        {currentView === "payment" && <PaymentView />}
        {currentView === "tracking" && <TrackingView />}
        {currentView === "review" && <ReviewView />}
      </div>

      {/* Simple History (Optional) */}
      {orderHistory.length > 0 && (
        <div className="bg-white mt-10 rounded-xl text-black shadow-lg p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" /> Past Orders
          </h3>
          <div className="divide-y">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="py-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{order.id}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="font-bold">₹{order.total}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs 
                    ${
                      order.status === "served"
                        ? "bg-green-100 text-green-600"
                        : order.status === "ready"
                        ? "bg-blue-100 text-blue-600"
                        : order.status === "preparing"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-500"
                    }
                  `}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderApp;
