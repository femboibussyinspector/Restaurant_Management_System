import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

import Navbar from "./Navbar.jsx";
import Menu from "./Menu.jsx";

export default function Dashboard({ token }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with fetch('/api/dashboard') for MySQL
    setTimeout(() => {
      setData({
        analytics: {
          todaySales: 12450,
          todayOrders: 187,
          avgOrderValue: 66.58,
          tableOccupancy: 78,
          salesTrend: [
            { day: "Mon", sales: 8000 },
            { day: "Tue", sales: 9500 },
            { day: "Wed", sales: 12450 },
            { day: "Thu", sales: 11000 },
            { day: "Fri", sales: 15000 },
            { day: "Sat", sales: 18000 },
            { day: "Sun", sales: 20000 },
          ],
        },
        pie_data: {
          Order_Category: [
            "Mains",
            "Desserts",
            "Drinks",
            "Appetizers",
            "Salads",
          ],
          No_of_Orders: [75, 45, 30, 25, 12],
        },
        sentiment_pct: 94,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4d0e1d] to-[#800000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-[#eee4da]" />
      </div>
    );
  }

  const salesData = {
    labels: data.analytics.salesTrend.map((d) => d.day),
    datasets: [
      {
        label: "Sales ($)",
        data: data.analytics.salesTrend.map((d) => d.sales),
        borderColor: "#d8a4ac",
        backgroundColor: "rgba(216, 164, 172, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: data.pie_data.Order_Category,
    datasets: [
      {
        data: data.pie_data.No_of_Orders,
        backgroundColor: [
          "#4d0e1d",
          "#800000",
          "#d8a4ac",
          "#c8a49f",
          "#eee4da",
        ],
        borderColor: "#eee4da",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{ padding: "1.5rem", background: "#1a1a1a", minHeight: "100vh" }}
    >
      <header
        style={{
          background: "linear-gradient(90deg, #4d0e1d, #800000)",
          color: "#eee4da",
          padding: "2rem",
          borderRadius: "16px",
          marginBottom: "2rem",
          boxShadow: "0 8px 25px rgba(77, 14, 29, 0.4)",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "800",
            textAlign: "center",
            margin: 0,
          }}
        >
          SmartDine AI Dashboard
        </h1>
      </header>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "dashboard" && (
        <>
          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr)",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "#eee4da",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(200, 164, 172, 0.3)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "0.8rem",
                }}
              >
                Today's Sales
              </h3>
              <h2
                style={{
                  color: "#800000",
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0.3rem 0",
                }}
              >
                $ {data.analytics.todaySales?.toLocaleString()}
              </h2>
            </div>
            <div
              style={{
                background: "#eee4da",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(200, 164, 172, 0.3)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "0.8rem",
                }}
              >
                Orders
              </h3>
              <h2
                style={{
                  color: "#800000",
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0.3rem 0",
                }}
              >
                {data.analytics.todayOrders}
              </h2>
            </div>
            <div
              style={{
                background: "#eee4da",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(200, 164, 172, 0.3)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "0.8rem",
                }}
              >
                Avg Order Value
              </h3>
              <h2
                style={{
                  color: "#800000",
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0.3rem 0",
                }}
              >
                $ {data.analytics.avgOrderValue}
              </h2>
            </div>
            <div
              style={{
                background: "#eee4da",
                padding: "2rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(200, 164, 172, 0.3)",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  marginBottom: "0.8rem",
                }}
              >
                Table Occupancy
              </h3>
              <h2
                style={{
                  color: "#800000",
                  fontSize: "2.5rem",
                  fontWeight: "800",
                  margin: "0.3rem 0",
                }}
              >
                {data.analytics.tableOccupancy}%
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "#eee4da",
                padding: "2.5rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(216, 164, 172, 0.3)",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                Sales Trend
              </h3>
              <Line data={salesData} />
            </div>
            <div
              style={{
                background: "#eee4da",
                padding: "2.5rem",
                borderRadius: "16px",
                boxShadow: "0 8px 30px rgba(216, 164, 172, 0.3)",
              }}
            >
              <h3
                style={{
                  color: "#4d0e1d",
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                }}
              >
                Popular Items
              </h3>
              <Pie data={pieData} />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "2rem",
              background: "linear-gradient(90deg, #4d0e1d, #800000)",
              color: "#eee4da",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 15px 40px rgba(77, 14, 29, 0.5)",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Peak Hours
              </h4>
              <div
                style={{
                  background: "rgba(216, 164, 172, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                }}
              >
                6-9 PM
              </div>
              <p
                style={{ marginTop: "0.8rem", opacity: 0.9, fontSize: "1rem" }}
              >
                85% occupancy
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Top Dish
              </h4>
              <div
                style={{
                  background: "rgba(216, 164, 172, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                }}
              >
                Truffle Pasta
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <h4
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  marginBottom: "1rem",
                }}
              >
                Sentiment
              </h4>
              <div
                style={{
                  background: "rgba(238, 228, 218, 0.3)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  fontSize: "1.5rem",
                  fontWeight: "900",
                  color: "#d8a4ac",
                }}
              >
                94%
              </div>
              <p
                style={{ marginTop: "0.8rem", opacity: 0.9, fontSize: "1rem" }}
              >
                Positive
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "menu" && <Menu token={token} />}

      {activeTab === "tables" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Dynamic Table Heat Map
          <br />
          D3.js powered - ML allocation
        </div>
      )}

      {activeTab === "inventory" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Inventory Prediction (ML)
          <br />
          Low stock alerts
        </div>
      )}

      {activeTab === "feedback" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Feedback Sentiment (NLP)
          <br />
          HuggingFace pipeline
        </div>
      )}

      {activeTab === "qr" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          QR Ordering & Stripe
          <br />
          Contactless payments
        </div>
      )}

      {activeTab === "payments" && (
        <div
          style={{
            padding: "4rem",
            fontSize: "1.5rem",
            textAlign: "center",
            color: "#eee4da",
          }}
        >
          Billing & Reports
          <br />
          GST invoices
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p
          style={{
            color: "#eee4da",
            opacity: 0.7,
            fontSize: "1rem",
            fontStyle: "italic",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          MySQL Ready: Connect to smartdine_rms database via /api/dashboard
          endpoint
        </p>
      </div>
    </div>
  );
}
