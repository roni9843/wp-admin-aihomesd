import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    username: "",
    email: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("orderFilters")) || {
      status: "All",
      username: "",
      email: "",
      category: "",
    };
    setFilters(savedFilters);

    fetch("https://backend.aihomesd.com/getAllOrder")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
        setLoading(false);
        applyFilters(sortedData, savedFilters);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      });
  }, []);

  const applyFilters = (data, filterValues) => {
    let result = [...data];
    if (filterValues.status !== "All") {
      result = result.filter((order) => order.status === filterValues.status);
    }
    if (filterValues.username) {
      result = result.filter((order) =>
        order.userId.username.toLowerCase().includes(filterValues.username.toLowerCase())
      );
    }
    if (filterValues.email) {
      result = result.filter((order) =>
        order.userId.email.toLowerCase().includes(filterValues.email.toLowerCase())
      );
    }
    if (filterValues.category) {
      result = result.filter((order) =>
        order.products.some((product) =>
          product.product.category.toLowerCase().includes(filterValues.category.toLowerCase())
        )
      );
    }
    setFilteredOrders(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    localStorage.setItem("orderFilters", JSON.stringify(newFilters));
    applyFilters(orders, newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = { status: "All", username: "", email: "", category: "" };
    setFilters(defaultFilters);
    localStorage.setItem("orderFilters", JSON.stringify(defaultFilters));
    setFilteredOrders(orders);
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
            Order Management
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
                  htmlFor="statusFilter"
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
                  id="statusFilter"
                  name="status"
                  className="form-select"
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={{
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    borderColor: "#ced4da",
                  }}
                >
                  <option value="All">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="usernameFilter"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Username
                </label>
                <input
                  id="usernameFilter"
                  name="username"
                  type="text"
                  className="form-control"
                  value={filters.username}
                  onChange={handleFilterChange}
                  placeholder="Search by username"
                  style={{
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "6px",
                  }}
                />
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="emailFilter"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Email
                </label>
                <input
                  id="emailFilter"
                  name="email"
                  type="text"
                  className="form-control"
                  value={filters.email}
                  onChange={handleFilterChange}
                  placeholder="Search by email"
                  style={{
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "6px",
                  }}
                />
              </div>
              <div className="col-md-3">
                <label
                  htmlFor="categoryFilter"
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    color: "#0B2948",
                    marginBottom: "5px",
                  }}
                >
                  Product Category
                </label>
                <input
                  id="categoryFilter"
                  name="category"
                  type="text"
                  className="form-control"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="Search by category"
                  style={{
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "6px",
                  }}
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
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "300px", backgroundColor: "#f8f9fa" }}
            >
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div
              className="d-flex justify-content-center align-items-center text-danger"
              style={{ height: "300px", fontSize: "1.1rem", fontWeight: "500" }}
            >
              {error}
            </div>
          ) : (
            <div className="table-responsive">
              <table
                className="table table-hover table-striped align-middle"
                style={{
                  marginBottom: "0",
                  backgroundColor: "#fff",
                  fontSize: "0.9rem",
                }}
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
                      Order ID
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Name
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Email
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Place
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Phone
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Payment
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Total
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Order Date
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Products
                    </th>
                    <th style={{ padding: "12px", fontWeight: "600", userSelect: "none" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
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
                          {order.orderId}
                        </td>
                        <td style={{ padding: "10px", verticalAlign: "middle" }}>
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor:
                                order.status === "Pending"
                                  ? "#ffc107"
                                  : order.status === "Cancelled"
                                  ? "#dc3545"
                                  : order.status === "Shipped"
                                  ? "#17a2b8"
                                  : order.status === "Delivered"
                                  ? "#28a745"
                                  : "#007bff",
                              color: "#fff",
                              padding: "6px 12px",
                              fontSize: "0.8rem",
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.userId.username}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.userId.email}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে"}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.userId.phoneNumber}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.paymentMethod}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {order.totalAmount - order.couponAmount + order.shippingCost}
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            verticalAlign: "middle",
                            fontSize: "0.85rem",
                          }}
                        >
                          {new Date(order.orderDate).toLocaleString()}
                        </td>
                        <td style={{ padding: "10px", verticalAlign: "middle" }}>
                          <table
                            className="table table-sm mb-0"
                            style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}
                          >
                            <thead>
                              <tr>
                                <th style={{ padding: "8px", fontSize: "0.8rem" }}>Image</th>
                                <th
                                  style={{
                                    padding: "8px",
                                    fontSize: "0.8rem",
                                    textAlign: "center",
                                  }}
                                >
                                  Qty
                                </th>
                                <th style={{ padding: "8px", fontSize: "0.8rem" }}>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product) => (
                                <tr key={product.product._id}>
                                  <td style={{ padding: "8px" }}>
                                    <img
                                      src={product.product.images[0]}
                                      alt={product.product.productName}
                                      style={{
                                        maxHeight: "40px",
                                        width: "auto",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px",
                                      textAlign: "center",
                                      fontSize: "0.85rem",
                                    }}
                                  >
                                    {product.qty}
                                  </td>
                                  <td style={{ padding: "8px", fontSize: "0.85rem" }}>
                                    {product.product.productRegularPrice}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td style={{ padding: "10px", verticalAlign: "middle" }}>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "#1abc9c",
                              color: "#fff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = "#148c76")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = "#1abc9c")
                            }
                            onClick={() =>
                              window.open(
                                `${window.location.origin}/dashboard/order/order-list/orderId=${order._id}`,
                                "_blank"
                              )
                            }
                          >
                            Action
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="text-center"
                        style={{
                          padding: "20px",
                          fontSize: "1rem",
                          color: "#6c757d",
                        }}
                      >
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}