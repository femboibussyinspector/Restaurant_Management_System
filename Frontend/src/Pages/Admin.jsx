import React, { useState, useEffect } from "react";
import { socket } from '../socket';
import api from '../axios'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Menu,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Award,
  MessageSquare,
  Utensils,
  CreditCard,
  QrCode,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
// Mock Data Generator
const generateMockData = () => {
  const menuItems = [
    {
      id: 1,
      name: "Butter Chicken",
      category: "Main Course",
      price: 450,
      available: true,
      rating: 4.8,
      orders: 145,
      image: "🍛",
    },
    {
      id: 2,
      name: "Paneer Tikka",
      category: "Starter",
      price: 320,
      available: true,
      rating: 4.6,
      orders: 120,
      image: "🧀",
    },
    {
      id: 3,
      name: "Biryani",
      category: "Main Course",
      price: 380,
      available: true,
      rating: 4.9,
      orders: 200,
      image: "🍚",
    },
    {
      id: 4,
      name: "Mango Lassi",
      category: "Beverage",
      price: 120,
      available: true,
      rating: 4.7,
      orders: 180,
      image: "🥤",
    },
    {
      id: 5,
      name: "Gulab Jamun",
      category: "Dessert",
      price: 150,
      available: true,
      rating: 4.5,
      orders: 95,
      image: "🍮",
    },
    {
      id: 6,
      name: "Dal Makhani",
      category: "Main Course",
      price: 280,
      available: true,
      rating: 4.4,
      orders: 110,
      image: "🍲",
    },
  ];

  const tables = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    capacity: [2, 4, 6, 8][Math.floor(Math.random() * 4)],
    status: ["available", "occupied", "reserved", "cleaning"][
      Math.floor(Math.random() * 4)
    ],
    occupancyScore: Math.random() * 100,
    currentOrder:
      Math.random() > 0.5 ? Math.floor(Math.random() * 2000) + 500 : 0,
  }));

  const orders = [
    {
      id: "ORD001",
      table: 5,
      items: ["Butter Chicken", "Naan"],
      status: "preparing",
      time: "10 min",
      total: 520,
    },
    {
      id: "ORD002",
      table: 12,
      items: ["Biryani", "Raita"],
      status: "ready",
      time: "2 min",
      total: 420,
    },
    {
      id: "ORD003",
      table: 3,
      items: ["Paneer Tikka"],
      status: "served",
      time: "-",
      total: 320,
    },
    {
      id: "ORD004",
      table: 8,
      items: ["Dal Makhani", "Roti"],
      status: "preparing",
      time: "15 min",
      total: 350,
    },
  ];

  const feedback = [
    {
      id: 1,
      customer: "Rahul S.",
      rating: 5,
      comment: "Amazing food and great service!",
      sentiment: "positive",
      date: "2025-10-24",
    },
    {
      id: 2,
      customer: "Priya M.",
      rating: 4,
      comment: "Good but waiting time was long",
      sentiment: "neutral",
      date: "2025-10-23",
    },
    {
      id: 3,
      customer: "Amit K.",
      rating: 5,
      comment: "Best biryani in town",
      sentiment: "positive",
      date: "2025-10-23",
    },
    {
      id: 4,
      customer: "Sneha P.",
      rating: 3,
      comment: "Food was cold when served",
      sentiment: "negative",
      date: "2025-10-22",
    },
  ];

  const analytics = {
    todaySales: 45600,
    todayOrders: 87,
    avgOrderValue: 524,
    tableOccupancy: 68,
    salesTrend: [
      { day: "Mon", sales: 35000, orders: 65 },
      { day: "Tue", sales: 42000, orders: 78 },
      { day: "Wed", sales: 38000, orders: 70 },
      { day: "Thu", sales: 51000, orders: 92 },
      { day: "Fri", sales: 58000, orders: 105 },
      { day: "Sat", sales: 62000, orders: 115 },
      { day: "Sun", sales: 45600, orders: 87 },
    ],
    categoryDistribution: [
      { name: "Main Course", value: 45 },
      { name: "Starter", value: 25 },
      { name: "Beverage", value: 20 },
      { name: "Dessert", value: 10 },
    ],
  };

  return { menuItems, tables, orders, feedback, analytics };
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const RestaurantDashboard = () =>{
  const [data, setData] = useState(generateMockData());
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [userRole, setUserRole] = useState("admin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tables, setTables] = useState([]);
  const [liveOrders, setLiveOrders] = useState([]);
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.get('/menu');
        if (response.data && Array.isArray(response.data.data)) {
          setMenuItems(response.data.data);
        } else {
          console.error("API response is not in the expected format:", response.data);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        setMenuItems([]);
      }
    };

    fetchMenu();

    socket.connect();

    function onMenuItemAdded(newItem) {
      setMenuItems((prev) => [...prev, newItem]);
    }

    function onMenuItemUpdated(updatedItem) {
      setMenuItems((prev) => 
        prev.map((item) => item._id === updatedItem._id ? updatedItem : item)
      );
    }

    function onMenuItemDeleted(data) {
      setMenuItems((prev) => prev.filter((item) => item._id !== data.id));
    }

    socket.on('menuItemAdded', onMenuItemAdded);
    socket.on('menuItemUpdated', onMenuItemUpdated);
    socket.on('menuItemDeleted', onMenuItemDeleted);

    return () => {
      socket.disconnect();
      socket.off('menuItemAdded', onMenuItemAdded);
      socket.off('menuItemUpdated', onMenuItemUpdated);
      socket.off('menuItemDeleted', onMenuItemDeleted);
    };
  }, []);
  
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get('/tables');
        setTables(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tables:", error);
      }
    };
    fetchTables();
  }, []);
// --- ADD THIS NEW BLOCK ---
useEffect(() => {
  // 1. Connect and join the admin room
  socket.connect();
  socket.emit('joinAdminRoom'); // You need to add this room logic to server.js later

  // 2. Listener for new orders
  function onNewOrderPlaced(newOrder) {
    // Add the new order to the top of the list
    setLiveOrders((prevOrders) => [newOrder, ...prevOrders]);
  }
  
  // 3. Listener for status updates (Mark Ready/Served buttons)
  function onOrderStatusUpdated(updatedOrder) {
    setLiveOrders((prevOrders) => 
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  }
  
  // 4. Attach listeners
  socket.on('newOrderPlaced', onNewOrderPlaced);
  socket.on('orderStatusUpdated', onOrderStatusUpdated);

  // 5. Cleanup when the component unmounts
  return () => {
    socket.off('newOrderPlaced', onNewOrderPlaced);
    socket.off('orderStatusUpdated', onOrderStatusUpdated);
    socket.disconnect(); // This may disconnect the entire app, consider keeping it connected
  };
}, []);

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await api.delete(`/menu/${itemId}`);
      setMenuItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Failed to delete item. See console for details.");
    }
  };

  const handleAddItem = async (newItemData) => {
    try {
      const response = await api.post('/menu', newItemData);
      
      // ... success code ...

    } catch (error) {
      console.error("Failed to add item:", error);
      
      const errorMessage = error.response?.data?.message || // Get specific error message
                           error.response?.data?.errors?.message || // Check deeper for validation errors
                           "An unknown error occurred. Check console.";

      alert("Failed to add item: " + errorMessage); // <-- SHOW THE ERROR TO THE USER
    }
  };
  
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  const handleUpdateItem = async (updatedItemData) => {
    if (!editingItem) return;

    try {
      const response = await api.put(`/menu/${editingItem._id}`, updatedItemData);
      
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item._id === editingItem._id ? response.data.data : item
        )
      );
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item. See console for details.");
    }
  };

  const handleUpdateTableStatus = async (tableId, newStatus) => {
    try {
      const response = await api.patch(`/tables/${tableId}/status`, { status: newStatus });
      
      setTables((prevTables) =>
        prevTables.map((table) =>
          table._id === tableId ? response.data.data : table
        )
      );
    } catch (error) {
      console.error("Failed to update table status:", error);
      alert("Failed to update status. See console for details.");
    }
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6 h-screen w-[90vw]">
      <div className="flex flex-row justify-between md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard
          icon={<DollarSign className="w-16 h-8" />}
          title="Today's Sales"
          value={`₹${data.analytics.todaySales.toLocaleString()}`}
          change="+12.5%"
          color="bg-blue-500"
        />
        <StatCard
          icon={<ShoppingCart className="w-16 h-8" />}
          title="Orders"
          value={data.analytics.todayOrders}
          change="+8.3%"
          color="bg-green-500"
        />
        <StatCard
          icon={<Users className="w-16 h-8" />}
          title="Avg Order Value"
          value={`₹${data.analytics.avgOrderValue}`}
          change="+5.1%"
          color="bg-yellow-500"
        />
        <StatCard
          icon={<Activity className="w-16 h-8" />}
          title="Table Occupancy"
          value={`${data.analytics.tableOccupancy}%`}
          change="-2.4%"
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Sales Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.analytics.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Menu className="w-6 h-6 text-green-500" />
            Category Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.analytics.categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.analytics.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" />
          AI-Powered Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightCard
            title="Peak Hours"
            value="7 PM - 9 PM"
            description="Highest footfall detected"
          />
          <InsightCard
            title="Top Dish"
            value="Biryani"
            description="200 orders this week"
          />
          <InsightCard
            title="Customer Sentiment"
            value="87% Positive"
            description="Based on feedback analysis"
          />
        </div>
      </div>
    </div>
  );

 // Smart Menu View
 const MenuView = () => (
  <div className="space-y-6 h-screen w-[90vw]">
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center text-orange-500 gap-2">
          <Utensils className="w-7 h-7 text-orange-500" />
          Smart Menu Management
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          + Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl">{item.image || '🍛'}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.isAvailable 
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
              <h4 className="font-bold text-black text-xl mb-1">{item.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-blue-600">
                  ₹{item.price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{item.rating || 0}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                📊 {item.orders || 0} orders
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
            <button onClick={() => handleOpenEditModal(item)}className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition">
      Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item._id)}
                className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

  // Table Heat Map View
  const TableView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-purple-500 gap-2">
          <Activity className="w-7 h-7 text-purple-500" />
          Live Table Management
        </h3>

        <div className="mb-6 flex flex-wrap gap-4 text-black text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span>Cleaning</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => {
            const statusColors = {
              available: "bg-green-400",
              occupied: "bg-red-400",
              reserved: "bg-yellow-400",
              cleaning: "bg-gray-400",
            };

            return (
              <div
                key={table._id}
                className={`${
                  statusColors[table.status]
                } rounded-xl p-4 text-white shadow-lg relative`}
              >
                {/* --- THIS IS THE NEW BADGE --- */}
                {table.isInSession && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 justify-center items-center text-xs font-semibold">
                      LIVE
                    </span>
                  </span>
                )}
                {/* --------------------------- */}

                <div className="font-bold text-lg mb-1">Table {table.tableNumber}</div>
                <div className="text-sm opacity-90 mb-3">
                  Capacity: {table.capacity}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/90">Change Status:</label>
                  <select
                    value={table.status}
                    onChange={(e) => handleUpdateTableStatus(table._id, e.target.value)}
                    className="w-full rounded-md border-0 p-1.5 text-gray-900"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="cleaning">Cleaning</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  // Kitchen Dashboard View
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.patch(`/order/${orderId}/status`, { status: newStatus });
      const updatedOrder = response.data.data;
      
      // Update state immediately without waiting for socket event (for fast UI feedback)
      setLiveOrders((prevOrders) => 
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert(error.response?.data?.message || "Failed to update order status.");
    }
  };

  const KitchenView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-red-500 gap-2">
          <Utensils className="w-7 h-7 text-red-500" />
          Real-time Kitchen Dashboard
        </h3>

        <div className="space-y-4">
          {liveOrders.length === 0 && (
            <p className="text-gray-500 text-center py-10">No active orders are currently pending.</p>
          )}
          {liveOrders.map((order) => {
            const statusColors = {
              pending: "border-red-400 bg-red-50",
              preparing: "border-yellow-400 bg-yellow-50",
              ready: "border-green-400 bg-green-50",
              served: "border-gray-400 bg-gray-50",
            };

            return (
              <div
                key={order._id}
                className={`border-l-4 ${
                  statusColors[order.status]
                } rounded-lg p-4 transition duration-300`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg text-gray-800">{order.tableId}</div>
                    <div className="text-sm text-gray-600">
                      Order ID: {order._id.substring(0, 8)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-700 capitalize">
                      {order.status}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 mb-3 border-b border-gray-200 pb-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order._id, "preparing")}
                        className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
                      >
                        Start Prep
                      </button>
                    )}
                    {order.status === "preparing" && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order._id, "ready")}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button 
                        onClick={() => handleUpdateOrderStatus(order._id, "served")}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                      >
                        Mark Served
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  // Feedback & Sentiment Analysis View
  const FeedbackView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-indigo-500 gap-2">
          <MessageSquare className="w-7 h-7 text-indigo-500" />
          Customer Feedback & AI Sentiment Analysis
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <ThumbsUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">67%</div>
            <div className="text-sm text-green-600">Positive</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Minus className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-700">23%</div>
            <div className="text-sm text-yellow-600">Neutral</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <ThumbsDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">10%</div>
            <div className="text-sm text-red-600">Negative</div>
          </div>
        </div>

        <div className="space-y-4">
          {data.feedback.map((fb) => {
            const sentimentColors = {
              positive: "border-green-400 bg-green-50",
              neutral: "border-yellow-400 bg-yellow-50",
              negative: "border-red-400 bg-red-50",
            };

            return (
              <div
                key={fb.id}
                className={`border-l-4 ${
                  sentimentColors[fb.sentiment]
                } rounded-lg p-4`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-black">
                      {fb.customer}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < fb.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-gray-700">{fb.date}</div>
                </div>
                <p className="text-sm mb-2">{fb.comment}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-600 border capitalize">
                    🤖 {fb.sentiment}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // QR Ordering View
  const QRView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-blue-500 gap-2">
          <QrCode className="w-7 h-7 text-blue-500" />
          QR-Based Ordering System
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="w-48 h-48 mx-auto bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Table 5 - QR Code</h4>
            <p className="text-sm text-gray-600 mb-4">Scan to order and pay</p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Generate QR
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg">How it works:</h4>
            <div className="space-y-3">
              <Step number={1} text="Customer scans QR code at their table" />
              <Step
                number={2}
                text="Menu opens in mobile browser with table linked"
              />
              <Step number={3} text="Customer browses and adds items to cart" />
              <Step
                number={4}
                text="Order sent directly to kitchen in real-time"
              />
              <Step
                number={5}
                text="Payment via UPI/Card with Razorpay integration"
              />
              <Step
                number={6}
                text="Digital receipt sent to customer's phone"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                Benefits:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Contactless ordering</li>
                <li>• Reduced wait time</li>
                <li>• Lower staff workload</li>
                <li>• Accurate order tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-2 px-6 py-4">
          <div className="flex flex-row justify-between items-center gap-5">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Utensils className="w-8 h-8" />
                Smart Dine
              </h1>
              <p className="text-sm opacity-90 mt-1">
                AI-Powered Restaurant Management
              </p>
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              {/* <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur border border-white/30 text-white"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="chef">Chef</option>
                <option value="waiter">Waiter</option>
              </select> */}
              <button className="px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl px-6">
          <div className="flex gap-1 overflow-x-auto">
            <NavTab
              icon={<Activity />}
              label="Dashboard"
              to="/admin/dashboard"
              active={location.pathname === "/admin/dashboard"}
            />
            <NavTab
              icon={<Menu />}
              label="Smart Menu"
              to="/admin/menu"
              active={location.pathname === "/admin/menu"}
            />
            <NavTab
              icon={<Users />}
              label="Tables"
              to="/admin/tables"
              active={location.pathname === "/admin/tables"}
            />
            <NavTab
              icon={<Utensils />}
              label="Kitchen"
              to="/admin/kitchen"
              active={location.pathname === "/admin/kitchen"}
            />
            <NavTab
              icon={<MessageSquare />}
              label="Feedback"
              to="/admin/feedback"
              active={location.pathname === "/admin/feedback"}
            />
            <NavTab
              icon={<QrCode />}
              label="QR Ordering"
              to="/admin/qr"
              active={location.pathname === "/admin/qr"}
            />
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="px-6 py-8 mx-5">
        <Routes>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="menu" element={<MenuView />} />
          <Route path="tables" element={<TableView />} />
          <Route path="kitchen" element={<KitchenView />} />
          <Route path="feedback" element={<FeedbackView />} />
          <Route path="qr" element={<QRView />} />
        </Routes>
      </main>
      <AddItemModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }} 
        onSave={editingItem ? handleUpdateItem : handleAddItem}
        editingItem={editingItem}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm opacity-75">
            © 2025 RestaurantAI Pro - Powered by MERN Stack + AI/ML
          </p>
        </div>
      </footer>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value, change, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
    <div className="flex items-start justify-between mb-4 gap-5">
      <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
      <span
        className={`text-sm font-semibold ${
          change.startsWith("+") ? "text-green-600" : "text-red-600"
        }`}
      >
        {change}
      </span>
    </div>
    <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const InsightCard = ({ title, value, description }) => (
  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
    <h4 className="text-sm opacity-90 mb-1">{title}</h4>
    <p className="text-xl font-bold mb-1">{value}</p>
    <p className="text-xs opacity-75">{description}</p>
  </div>
);

const NavTab = ({ icon, label, to, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
      active
        ? "border-blue-500 text-blue-600 bg-blue-50"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </Link>
);

const Step = ({ number, text }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
      {number}
    </div>
    <p className="text-sm text-gray-700 pt-0.5">{text}</p>
  </div>
);


const AddItemModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    isAvailable: true,
    SpiceLevel: "1",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        category: editingItem.category,
        isAvailable: editingItem.isAvailable,
        SpiceLevel: editingItem.SpiceLevel || "1",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "Main Course",
        isAvailable: true,
        SpiceLevel: "1",
      });
    }
  }, [editingItem, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mt-20">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option>Main Course</option>
              <option>Starters</option>
              <option>Dessert</option>
              <option>Drinks</option>
              <option>Sides</option>
              <option>Chefs Kiss</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
            <select
              name="SpiceLevel"
              value={formData.SpiceLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">0 (No Spice)</option>
              <option value="1">1 (Mild)</option>
              <option value="2">2 (Medium)</option>
              <option value="3">3 (Spicy)</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-700">Item is Available</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              {editingItem ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RestaurantDashboard;
