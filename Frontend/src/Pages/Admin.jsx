import React, { useState, useEffect } from "react";
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

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(generateMockData());
  const [selectedTable, setSelectedTable] = useState(null);
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            + Add Item
          </button>
        </div>

        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm font-semibold text-blue-800">
            🤖 AI Recommendation:
          </p>
          <p className="text-sm text-blue-700">
            Consider adding "Chicken Tikka Masala" - trending 25% this week
            based on customer preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.menuItems.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-4xl">{item.image}</div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <h4 className="font-bold text-black text-xl mb-1">{item.name}</h4>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold text-blue-600">
                  ₹{item.price}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{item.rating}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600">
                📊 {item.orders} orders this week
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
          Dynamic Table Allocation - Live Heat Map
        </h3>

        <div className="mb-6 flex gap-4 text-black text-sm">
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

        <div className="grid grid-cols-4 gap-4">
          {data.tables.map((table) => {
            const statusColors = {
              available: "bg-green-400 hover:bg-green-500",
              occupied: "bg-red-400 hover:bg-red-500",
              reserved: "bg-yellow-400 hover:bg-yellow-500",
              cleaning: "bg-gray-400 hover:bg-gray-500",
            };

            return (
              <div
                key={table.id}
                onClick={() => setSelectedTable(table)}
                className={`${
                  statusColors[table.status]
                } rounded-xl p-4 cursor-pointer transition transform hover:scale-105 text-white shadow-lg`}
              >
                <div className="font-bold text-lg mb-1">Table {table.id}</div>
                <div className="text-sm opacity-90">
                  Capacity: {table.capacity}
                </div>
                <div className="text-xs mt-2 opacity-75">
                  Heat: {Math.round(table.occupancyScore)}%
                </div>
                {table.currentOrder > 0 && (
                  <div className="text-xs mt-1 font-semibold">
                    ₹{table.currentOrder}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedTable && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-bold mb-2">Table {selectedTable.id} Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Status:{" "}
                <span className="font-semibold">{selectedTable.status}</span>
              </div>
              <div>
                Capacity:{" "}
                <span className="font-semibold">
                  {selectedTable.capacity} persons
                </span>
              </div>
              <div>
                Heat Score:{" "}
                <span className="font-semibold">
                  {Math.round(selectedTable.occupancyScore)}%
                </span>
              </div>
              <div>
                Current Bill:{" "}
                <span className="font-semibold">
                  ₹{selectedTable.currentOrder}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Kitchen Dashboard View
  const KitchenView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center text-red-500 gap-2">
          <Utensils className="w-7 h-7 text-red-500" />
          Real-time Kitchen Dashboard
        </h3>

        <div className="space-y-4">
          {data.orders.map((order) => {
            const statusColors = {
              preparing: "border-yellow-400 bg-yellow-50",
              ready: "border-green-400 bg-green-50",
              served: "border-gray-400 bg-gray-50",
            };

            return (
              <div
                key={order.id}
                className={`border-l-4 ${
                  statusColors[order.status]
                } rounded-lg p-4`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{order.id}</div>
                    <div className="text-sm text-gray-600">
                      Table {order.table}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-700">
                      {order.time}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      • {item}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">
                    ₹{order.total}
                  </span>
                  <div className="flex gap-2">
                    {order.status === "preparing" && (
                      <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">
                        Mark Ready
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">
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
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <NavTab
              icon={<Menu />}
              label="Smart Menu"
              active={activeTab === "menu"}
              onClick={() => setActiveTab("menu")}
            />
            <NavTab
              icon={<Users />}
              label="Tables"
              active={activeTab === "tables"}
              onClick={() => setActiveTab("tables")}
            />
            <NavTab
              icon={<Utensils />}
              label="Kitchen"
              active={activeTab === "kitchen"}
              onClick={() => setActiveTab("kitchen")}
            />
            <NavTab
              icon={<MessageSquare />}
              label="Feedback"
              active={activeTab === "feedback"}
              onClick={() => setActiveTab("feedback")}
            />
            <NavTab
              icon={<QrCode />}
              label="QR Ordering"
              active={activeTab === "qr"}
              onClick={() => setActiveTab("qr")}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 mx-5">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "menu" && <MenuView />}
        {activeTab === "tables" && <TableView />}
        {activeTab === "kitchen" && <KitchenView />}
        {activeTab === "feedback" && <FeedbackView />}
        {activeTab === "qr" && <QRView />}
      </main>

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

const NavTab = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 whitespace-nowrap ${
      active
        ? "border-blue-500 text-blue-600 bg-blue-50"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </button>
);

const Step = ({ number, text }) => (
  <div className="flex items-start gap-3">
    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
      {number}
    </div>
    <p className="text-sm text-gray-700 pt-0.5">{text}</p>
  </div>
);

export default RestaurantDashboard;
