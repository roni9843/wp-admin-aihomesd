import React, { useEffect, useState } from "react";
import Category from "../Category/Category";
import Crop from "../Crop/Crop";
import Product from "../Product/Product";

export default function Layout() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  const [isProductSubMenuVisible, setIsProductSubMenuVisible] = useState(false); // Define the state variable for the submenu

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const handleOptionClick = (option, subOption = null) => {
    if (option === "Product" && subOption) {
      // If a sub-option is clicked under Product, set the selected sub-option
      setSelectedSubOption(subOption);
      setActiveOption(subOption); // Set the active option to Product
    } else if (option === "Product") {
      // If only the Product option is clicked, toggle submenu visibility
      setIsProductSubMenuVisible(!isProductSubMenuVisible);
      setActiveOption("Product"); // Set the active option to Product
    } else {
      setActiveOption(option);
      setSelectedSubOption(null); // Reset selected sub-option
    }
  };

  const [selectedSubOption, setSelectedSubOption] = useState(null);

  useEffect(() => {
    setActiveOption(selectedSubOption);
  }, [selectedSubOption]);

  return (
    <div>
      <div
        className="row m_0_p_0"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          className="sidebar"
          style={{
            backgroundColor: "#2c3e50",
            color: "#ecf0f1",
            padding: "20px",
            position: "fixed",
            height: "100%",
            overflowY: "auto",
            width: isSidebarMinimized ? "60px" : "250px",
            transition: "width 0.3s",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              {!isSidebarMinimized && (
                <>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "#ecf0f1",
                      marginBottom: "10px" /* Added spacing below Dashboard */,
                    }}
                  >
                    Dashboard
                  </span>
                  <div className="d-flex justify-content-between">
                    <div style={{ fontSize: "0.8rem", marginBottom: "5px" }}>
                      {new Date().toLocaleDateString()}{" "}
                      {/* Display current date */}
                    </div>
                    <div style={{ fontSize: "0.8rem", marginBottom: "10px" }}>
                      {" "}
                      {new Date().toLocaleTimeString()}{" "}
                      {/* Display current time */}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <button
                onClick={toggleSidebar}
                style={{
                  backgroundColor: "#2980b9",
                  color: "#ecf0f1",
                  border: "none",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: "background-color 0.3s",
                }}
              >
                {isSidebarMinimized ? (
                  <i className="fas fa-chevron-right"></i>
                ) : (
                  <i className="fas fa-chevron-left"></i>
                )}
              </button>
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: "0" }}>
            <li
              style={{
                padding: "10px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "color 0.3s",
                color: activeOption === "Home" ? "#3498db" : "#ecf0f1",
                background: activeOption === "Home" ? "#2c3e50" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3498db")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Home" ? "#3498db" : "#ecf0f1")
              }
              onClick={() => handleOptionClick("Home")}
            >
              <i
                className="fas fa-home"
                style={{ marginRight: isSidebarMinimized ? "0" : "10px" }}
              ></i>
              {!isSidebarMinimized && "Home"}
            </li>
            <li
              style={{
                padding: "10px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "color 0.3s",
                color: activeOption === "Product" ? "#3498db" : "#ecf0f1",
                background:
                  activeOption === "Product" ? "#2c3e50" : "transparent",
                position: "relative", // Added for positioning the submenu
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3498db")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Product" ? "#3498db" : "#ecf0f1")
              }
              onClick={() => handleOptionClick("Product")}
            >
              <i
                className="fas fa-cubes"
                style={{ marginRight: isSidebarMinimized ? "0" : "10px" }}
              ></i>
              {!isSidebarMinimized && "Product"}
              {!isSidebarMinimized && (
                <ul
                  style={{
                    listStyle: "none",
                    padding: "0",
                    position: "absolute",
                    top: "100%", // Position the submenu below the parent
                    left: "0",
                    backgroundColor: "#34495e",
                    minWidth: "200px",
                    zIndex: "1", // Ensure the submenu appears above other elements
                    overflow: "hidden",
                    maxHeight: isProductSubMenuVisible ? "200px" : "0", // Control height based on visibility
                    transition: "max-height 0.3s ease-out", // Add sliding animation
                  }}
                >
                  <li
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #2c3e50",
                      cursor: "pointer",
                      color:
                        selectedSubOption === "Stock" ? "#3498db" : "#ecf0f1",
                      background:
                        selectedSubOption === "Stock"
                          ? "#2c3e50"
                          : "transparent",
                    }}
                    onClick={() => handleOptionClick("Product", "Stock")}
                  >
                    Stock
                  </li>
                  <li
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #2c3e50",
                      cursor: "pointer",
                      color:
                        selectedSubOption === "Color" ? "#3498db" : "#ecf0f1",
                      background:
                        selectedSubOption === "Color"
                          ? "#2c3e50"
                          : "transparent",
                    }}
                    onClick={() => handleOptionClick("Product", "Color")}
                  >
                    Color
                  </li>
                  <li
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #2c3e50",
                      cursor: "pointer",
                      color:
                        selectedSubOption === "Category"
                          ? "#3498db"
                          : "#ecf0f1",
                      background:
                        selectedSubOption === "Category"
                          ? "#2c3e50"
                          : "transparent",
                    }}
                    onClick={() => handleOptionClick("Product", "Category")}
                  >
                    Category
                  </li>
                  <li
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #2c3e50",
                      cursor: "pointer",
                      color:
                        selectedSubOption === "Crop" ? "#3498db" : "#ecf0f1",
                      background:
                        selectedSubOption === "Crop"
                          ? "#2c3e50"
                          : "transparent",
                    }}
                    onClick={() => handleOptionClick("Product", "Crop")}
                  >
                    Crop
                  </li>
                  {/* Add more sub-menu items here */}
                </ul>
              )}
            </li>
            <li
              style={{
                padding: "10px 0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "color 0.3s",
                color: activeOption === "Order" ? "#3498db" : "#ecf0f1",
                background:
                  activeOption === "Order" ? "#2c3e50" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3498db")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeOption === "Order" ? "#3498db" : "#ecf0f1")
              }
              onClick={() => handleOptionClick("Order")}
            >
              <i
                className="fas fa-shopping-cart"
                style={{ marginRight: isSidebarMinimized ? "0" : "10px" }}
              ></i>
              {!isSidebarMinimized && "Order"}
            </li>
            {/* Add more options similarly */}
          </ul>
        </div>

        <div
          className="content"
          style={{
            marginLeft: isSidebarMinimized ? "60px" : "250px",
            transition: "margin-left 0.3s",
            width: isSidebarMinimized
              ? "calc(100% - 60px)"
              : "calc(100% - 250px)",
          }}
        >
          <div
            className="topbar"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #2980b9, #6dd5fa)",
              color: "#ecf0f1",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              position: "fixed",
              top: "0",
              zIndex: "1000",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div>Dashboard Title</div>
          </div>

          <div
            style={{
              marginTop: "50px",
              padding: "20px",
              overflowY: "auto",
              height: "calc(100vh - 50px)",
            }}
          >
            {activeOption === "Product" && <Product></Product>}
            {activeOption === "Crop" && <Crop></Crop>}
            {activeOption === "Category" && <Category></Category>}
          </div>
        </div>
      </div>
    </div>
  );
}
