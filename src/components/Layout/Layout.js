import React, { useEffect, useState } from "react";
import Category from "../Category/Category";
import Crop from "../Crop/Crop";
import Product from "../Product/Product";

export default function Layout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const [isProductSubMenuVisible, setIsProductSubMenuVisible] = useState(false);
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleOptionClick = (option, subOption = null) => {
    if (option === "Product" && subOption) {
      setSelectedSubOption(subOption);
      setActiveOption(subOption);
    } else if (option === "Product") {
      setIsProductSubMenuVisible(!isProductSubMenuVisible);
      setActiveOption("Product");
    } else {
      setActiveOption(option);
      setSelectedSubOption(null);
      setIsProductSubMenuVisible(false);
    }
  };

  useEffect(() => {
    setActiveOption(selectedSubOption || "Home"); // Default to "Home" if no sub-option
  }, [selectedSubOption]);

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white shadow-lg"
        style={{
          width: isSidebarMinimized ? "70px" : "260px",
          transition: "width 0.3s ease",
          padding: "20px 10px",
          position: "fixed",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!isSidebarMinimized && (
            <h4 className="mb-0" style={{ color: "#00cccc" }}>
              Dashboard
            </h4>
          )}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
            style={{ borderRadius: "50%", padding: "5px 10px" }}
          >
            <i
              className={`fas fa-chevron-${isSidebarMinimized ? "right" : "left"}`}
            ></i>
          </button>
        </div>

        {!isSidebarMinimized && (
          <div className="text-muted small mb-3">
            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
          </div>
        )}

        <ul className="nav flex-column">
          <li
            className={`nav-item ${activeOption === "Home" ? "bg-teal-700" : ""}`}
            style={{
              borderRadius: "5px",
              marginBottom: "5px",
              transition: "background 0.3s",
            }}
            onClick={() => handleOptionClick("Home")}
          >
            <div
              className="nav-link text-white d-flex align-items-center"
              style={{
                cursor: "pointer",
                color: activeOption === "Home" ? "#00cccc" : "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00cccc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Home" ? "#00cccc" : "#fff")
              }
            >
              <i className="fas fa-home me-2"></i>
              {!isSidebarMinimized && "Home"}
            </div>
          </li>

          <li
            className={`nav-item ${activeOption === "Product" ? "bg-teal-700" : ""}`}
            style={{
              borderRadius: "5px",
              marginBottom: "5px",
              position: "relative",
            }}
            onClick={() => handleOptionClick("Product")}
          >
            <div
              className="nav-link text-white d-flex align-items-center"
              style={{
                cursor: "pointer",
                color: activeOption === "Product" ? "#00cccc" : "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00cccc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Product" ? "#00cccc" : "#fff")
              }
            >
              <i className="fas fa-cubes me-2"></i>
              {!isSidebarMinimized && "Product"}
            </div>

            {!isSidebarMinimized && (
              <ul
                className="bg-dark-subtle text-white p-0"
                style={{
                  position: "absolute",
                  left: "100%",
                  top: "0",
                  width: "180px",
                  borderRadius: "5px",
                  boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  maxHeight: isProductSubMenuVisible ? "300px" : "0",
                  transition: "max-height 0.3s ease",
                }}
              >
                {["Stock", "Color", "Category", "Crop"].map((subItem) => (
                  <li
                    key={subItem}
                    className={`p-2 ${selectedSubOption === subItem ? "bg-teal-600" : ""}`}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #333",
                      color: selectedSubOption === subItem ? "#00cccc" : "#fff",
                    }}
                    onClick={() => handleOptionClick("Product", subItem)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#00b3b3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        selectedSubOption === subItem ? "#006666" : "transparent")
                    }
                  >
                    {subItem}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li
            className={`nav-item ${activeOption === "Order" ? "bg-teal-700" : ""}`}
            style={{
              borderRadius: "5px",
              marginBottom: "5px",
            }}
            onClick={() => handleOptionClick("Order")}
          >
            <div
              className="nav-link text-white d-flex align-items-center"
              style={{
                cursor: "pointer",
                color: activeOption === "Order" ? "#00cccc" : "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00cccc")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Order" ? "#00cccc" : "#fff")
              }
            >
              <i className="fas fa-shopping-cart me-2"></i>
              {!isSidebarMinimized && "Order"}
            </div>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarMinimized ? "70px" : "260px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div
          className="bg-gradient-teal text-white shadow-sm"
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            position: "fixed",
            width: isSidebarMinimized ? "calc(100% - 70px)" : "calc(100% - 260px)",
            zIndex: 1000,
            background: "linear-gradient(90deg, #00b3b3, #00cccc)",
          }}
        >
          <h5 className="mb-0">Dashboard Overview</h5>
        </div>

        <div
          className="p-4"
          style={{ marginTop: "60px", overflowY: "auto", height: "calc(100vh - 60px)" }}
        >
          {activeOption === "Product" && <Product />}
          {activeOption === "Crop" && <Crop />}
          {activeOption === "Category" && <Category />}
          {!activeOption || activeOption === "Home" ? (
            <div className="text-muted">Welcome to the Dashboard!</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}