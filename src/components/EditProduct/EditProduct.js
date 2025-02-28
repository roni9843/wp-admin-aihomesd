import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProductDashboard() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "",
    isLive: "",
    minPrice: "",
    maxPrice: "",
    minOffer: "",
    maxOffer: "",
    productCode: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch products and categories
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("productFilters")) || {
      searchQuery: "",
      category: "",
      isLive: "",
      minPrice: "",
      maxPrice: "",
      minOffer: "",
      maxOffer: "",
      productCode: "",
    };
    setFilters(savedFilters);

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://backend.aihomesd.com/getAllCategoryWithProducts");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        const products = data.data.flatMap((p) => p.products);
        if (data.success) {
          setAllProducts(products);
          applyFilters(products, savedFilters);
        } else throw new Error("Failed to fetch products");
      } catch (error) {
        console.error("Error fetching products:", error);
        setMessage("Failed to fetch products.");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("https://backend.aihomesd.com/getAllCategory");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        if (Array.isArray(data)) setCategories(data);
        else throw new Error("Failed to fetch categories");
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const applyFilters = (products, filterValues) => {
    let result = [...products];
    if (filterValues.searchQuery) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(filterValues.searchQuery.toLowerCase())
      );
    }
    if (filterValues.category) {
      result = result.filter((p) => p.category.category === filterValues.category);
    }
    if (filterValues.isLive !== "") {
      result = result.filter((p) => p.productLive === (filterValues.isLive === "On"));
    }
    if (filterValues.minPrice) {
      const minPrice = Number(filterValues.minPrice);
      result = result.filter((p) => {
        const price = p.productOffer
          ? p.productRegularPrice - (p.productRegularPrice * p.productOffer) / 100
          : p.productRegularPrice;
        return price >= minPrice;
      });
    }
    if (filterValues.maxPrice) {
      const maxPrice = Number(filterValues.maxPrice);
      result = result.filter((p) => {
        const price = p.productOffer
          ? p.productRegularPrice - (p.productRegularPrice * p.productOffer) / 100
          : p.productRegularPrice;
        return price <= maxPrice;
      });
    }
    if (filterValues.minOffer) {
      const minOffer = Number(filterValues.minOffer);
      result = result.filter((p) => (p.productOffer || 0) >= minOffer);
    }
    if (filterValues.maxOffer) {
      const maxOffer = Number(filterValues.maxOffer);
      result = result.filter((p) => (p.productOffer || 0) <= maxOffer);
    }
    if (filterValues.productCode) {
      result = result.filter((p) =>
        p.productCode.toLowerCase().includes(filterValues.productCode.toLowerCase())
      );
    }
    setFilteredProducts(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    localStorage.setItem("productFilters", JSON.stringify(newFilters));
    applyFilters(allProducts, newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      searchQuery: "",
      category: "",
      isLive: "",
      minPrice: "",
      maxPrice: "",
      minOffer: "",
      maxOffer: "",
      productCode: "",
    };
    setFilters(defaultFilters);
    localStorage.setItem("productFilters", JSON.stringify(defaultFilters));
    setFilteredProducts(allProducts);
  };

  const handleDelete = async (product) => {
    const confirmationMessage = `
      Product Name: ${product.productName}
      Category: ${product.category.category}
      Price: ${product.productRegularPrice}
      Type 'DELETE' to confirm
    `;
    const userConfirmation = prompt(confirmationMessage);
    if (userConfirmation?.toUpperCase() === "DELETE") {
      try {
        const response = await fetch(`https://backend.aihomesd.com/deleteProduct/${product._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete product");
        const result = await response.json();
        if (result.success) {
          setMessage("Product deleted successfully");
          setAllProducts((prev) => prev.filter((p) => p._id !== product._id));
          applyFilters(allProducts.filter((p) => p._id !== product._id), filters);
        } else {
          setMessage(result.message || "Failed to delete product");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Error deleting product");
      }
    } else {
      setMessage("Delete action cancelled");
    }
  };

  const TruncatedText = ({ text, limit }) => {
    const truncateString = (str, num) => (str.length > num ? str.slice(0, num) + "..." : str);
    return <span>{truncateString(text, limit)}</span>;
  };

  return (
    <div className="container-fluid mt-4 pt-4 px-4" style={{ minHeight: "100vh" }}>
      <div
        className="card shadow-sm border-0"
        style={{ backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden" }}
      >
        <div
          className="card-header bg-light border-bottom d-flex align-items-center justify-content-between"
          style={{ padding: "15px 20px", backgroundColor: "#f1f3f5" }}
        >
          <h5
            className="mb-0"
            style={{ fontWeight: "700", color: "#0B2948", userSelect: "none" }}
          >
            Product Management
          </h5>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowFilters(!showFilters)}
            style={{
              fontSize: "0.9rem",
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
            }}
          >
            <FontAwesomeIcon icon={showFilters ? faTimes : faFilter} />{" "}
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>

        {showFilters && (
          <div
            className="card-body border-bottom py-3"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="row g-3">
              <div className="col-md-3">
                <label
                  htmlFor="searchQuery"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Product Name
                </label>
                <input
                  id="searchQuery"
                  name="searchQuery"
                  type="text"
                  className="form-control"
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="category"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.category}>
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label
                  htmlFor="isLive"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Status
                </label>
                <select
                  id="isLive"
                  name="isLive"
                  className="form-select"
                  value={filters.isLive}
                  onChange={handleFilterChange}
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                >
                  <option value="">All Status</option>
                  <option value="On">Live</option>
                  <option value="Off">Offline</option>
                </select>
              </div>
              <div className="col-md-2">
                <label
                  htmlFor="minPrice"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Min Price
                </label>
                <input
                  id="minPrice"
                  name="minPrice"
                  type="number"
                  className="form-control"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-md-2">
                <label
                  htmlFor="maxPrice"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Max Price
                </label>
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  className="form-control"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-md-2">
                <label
                  htmlFor="minOffer"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Min Offer (%)
                </label>
                <input
                  id="minOffer"
                  name="minOffer"
                  type="number"
                  className="form-control"
                  value={filters.minOffer}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-md-2">
                <label
                  htmlFor="maxOffer"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Max Offer (%)
                </label>
                <input
                  id="maxOffer"
                  name="maxOffer"
                  type="number"
                  className="form-control"
                  value={filters.maxOffer}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="productCode"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Product Code
                </label>
                <input
                  id="productCode"
                  name="productCode"
                  type="text"
                  className="form-control"
                  value={filters.productCode}
                  onChange={handleFilterChange}
                  placeholder="Search by code"
                  style={{ fontSize: "0.9rem", padding: "8px 12px", borderRadius: "6px" }}
                />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={resetFilters}
                  style={{
                    fontSize: "0.9rem",
                    padding: "6px 12px",
                    borderRadius: "6px",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              className="table table-hover table-striped align-middle"
              style={{ marginBottom: "0", backgroundColor: "#fff", fontSize: "0.9rem" }}
            >
              <thead
                style={{
                  backgroundColor: "#0B2948",
                  color: "#fff",
                  position: "sticky",
                  top: "0",
                  zIndex: "1",
                }}
              >
                <tr className="text-center">
                  <th
                    scope="col"
                    style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}
                  >
                    Category
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Name
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Images
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Code
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Price
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Offer
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Status
                  </th>
                  <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      style={{ transition: "background-color 0.2s ease" }}
                      className="text-center"
                    >
                      <td
                        style={{
                          padding: "10px",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                        }}
                      >
                        {p.category.category}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                        }}
                      >
                        <TruncatedText text={p.productName} limit={15} />
                      </td>
                      <td style={{ padding: "10px", verticalAlign: "middle" }}>
                        <div className="d-flex gap-2 flex-wrap justify-content-start">
                          {p.images.map((p_img, index) => (
                            <img
                              key={index}
                              src={p_img}
                              alt={p.productName}
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                        }}
                      >
                        {p.productCode}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                        }}
                      >
                        $
                        {(p.productOffer
                          ? p.productRegularPrice - (p.productRegularPrice * p.productOffer) / 100
                          : p.productRegularPrice
                        ).toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          verticalAlign: "middle",
                          fontSize: "0.85rem",
                        }}
                      >
                        {p.productOffer ? `${p.productOffer}%` : "-"}
                      </td>
                      <td style={{ padding: "10px", verticalAlign: "middle" }}>
                        <span
                          className={`badge rounded-pill`}
                          style={{
                            backgroundColor: p.productLive ? "#28a745" : "#dc3545",
                            color: "#fff",
                            padding: "6px 12px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {p.productLive ? "Live" : "Offline"}
                        </span>
                      </td>
                      <td style={{ padding: "10px", verticalAlign: "middle" }}>
                        <div className="btn-group" role="group">
                          <button
                            onClick={() =>
                              window.open(
                                `${window.location.origin}/dashboard/product/product-edit/productId=${p._id}`,
                                "_blank"
                              )
                            }
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px 0 0 6px",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                            title="Edit Product"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "0 6px 6px 0",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#b02a37")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
                            title="Delete Product"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center"
                      style={{
                        padding: "20px",
                        fontSize: "1rem",
                        color: "#6c757d",
                      }}
                    >
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {message && (
          <div
            className="card-footer text-center"
            style={{ padding: "10px", backgroundColor: "#f8f9fa" }}
          >
            <span
              style={{
                fontSize: "0.95rem",
                color: message.includes("Error") || message.includes("Failed") ? "#dc3545" : "#28a745",
              }}
            >
              {message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}