import { useState } from "react";

export default function Navbar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "menu", label: "Menu", icon: "🍽️" },
    { id: "tables", label: "Tables", icon: "🪑" },
    { id: "feedback", label: "Feedback", icon: "⭐" },
    { id: "qr", label: "QR Orders", icon: "📱" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "inventory", label: "Inventory", icon: "📦" },
  ];

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #4d0e1d 0%, #800000 100%)",
        padding: "1rem 2rem",
        borderRadius: "16px",
        marginBottom: "2rem",
        boxShadow: "0 8px 25px rgba(77, 14, 29, 0.4)",
        display: "flex",
        justifyContent: "space-evenly",
        gap: "1rem",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      className="no-scrollbar"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            background: activeTab === tab.id ? "#d8a4ac" : "transparent",
            color: activeTab === tab.id ? "#4d0e1d" : "#eee4da",
            border: "2px solid #c8a49f50",
            padding: "0.8rem 1.5rem",
            borderRadius: "12px",
            fontWeight: activeTab === tab.id ? "800" : "500",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            minWidth: "120px",
          }}
          onMouseEnter={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.background = "rgba(238, 228, 218, 0.1)";
              e.target.style.borderColor = "#c8a49f80";
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab.id) {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "#c8a49f50";
            }
          }}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
