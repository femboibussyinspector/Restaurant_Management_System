import { useState, useEffect } from "react";

export default function Menu({ token }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/menu", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(setMenuItems)
      .catch((err) => setError("Failed to load menu"))
      .finally(() => setLoading(false));
  }, [token]);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const addItem = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menu", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          price: parseFloat(newPrice),
          category: newCategory,
        }),
      });
      if (res.ok) {
        refreshMenu();
        setNewName("");
        setNewPrice("");
        setNewCategory("");
      }
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        refreshMenu();
      }
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  const refreshMenu = () => {
    fetch("http://localhost:5000/api/menu", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMenuItems);
  };

  if (loading)
    return (
      <div className="text-[#eee4da] text-center py-12">Loading menu...</div>
    );
  if (error)
    return <div className="text-red-400 text-center py-12">{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "1rem",
          marginBottom: "2rem",
          background: "linear-gradient(90deg, #4d0e1d, #800000)",
          padding: "1.5rem",
          borderRadius: "16px",
          color: "#eee4da",
        }}
      >
        <h2 style={{ fontSize: "2.5rem", fontWeight: "800", margin: 0 }}>
          Menu Management
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "end" }}>
            <input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #eee4da40",
                background: "rgba(238, 228, 218, 0.1)",
                color: "#eee4da",
                minWidth: "120px",
              }}
            />
            <input
              placeholder="Price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              style={{
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #eee4da40",
                background: "rgba(238, 228, 218, 0.1)",
                color: "#eee4da",
                minWidth: "100px",
              }}
            />
            <input
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                padding: "0.8rem",
                borderRadius: "8px",
                border: "1px solid #eee4da40",
                background: "rgba(238, 228, 218, 0.1)",
                color: "#eee4da",
                minWidth: "100px",
              }}
            />
            <button
              onClick={addItem}
              disabled={!newName || !newPrice || !newCategory}
              style={{
                background: "#d8a49f",
                color: "#4d0e1d",
                padding: "0.8rem 1.5rem",
                borderRadius: "8px",
                fontWeight: "700",
                cursor:
                  !newName || !newPrice || !newCategory
                    ? "not-allowed"
                    : "pointer",
                border: "none",
                boxShadow: "0 4px 15px rgba(216, 164, 172, 0.4)",
                opacity: !newName || !newPrice || !newCategory ? 0.5 : 1,
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#eee4da",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 8px 25px rgba(216, 164, 172, 0.3)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                color: "#4d0e1d",
                fontSize: "1.8rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
              }}
            >
              {item.name}
            </h3>
            <p
              style={{
                color: "#800000",
                fontSize: "2.2rem",
                fontWeight: "900",
                margin: "0.5rem 0",
              }}
            >
              ${item.price}
            </p>
            <p style={{ color: "#4d0e1d", fontSize: "1.1rem", opacity: 0.8 }}>
              {item.category}
            </p>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#eee4da",
            padding: "4rem",
            fontSize: "1.3rem",
          }}
        >
          No menu items. Click "Add Item" to get started!
        </div>
      )}
    </div>
  );
}
