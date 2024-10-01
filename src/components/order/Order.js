import React, { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the filter status from local storage on component mount
    const savedFilterStatus = localStorage.getItem("orderFilterStatus");
    if (savedFilterStatus) {
      setFilterStatus(savedFilterStatus);
    }

    fetch("https://backend.aihomesd.com/getAllOrder")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
        setLoading(false);

        // Apply the filter from local storage (if it exists)
        if (savedFilterStatus && savedFilterStatus !== "All") {
          const filtered = sortedData.filter(
            (order) => order.status === savedFilterStatus
          );
          setFilteredOrders(filtered);
        } else {
          setFilteredOrders(sortedData); // Show all orders by default
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setFilterStatus(selectedStatus);

    // Save the selected status to local storage
    localStorage.setItem("orderFilterStatus", selectedStatus);

    if (selectedStatus === "All") {
      setFilteredOrders(orders); // Show all orders if "All" is selected
    } else {
      const filtered = orders.filter(
        (order) => order.status === selectedStatus
      );
      setFilteredOrders(filtered);
    }
  };

  const tableStyles = { backgroundColor: "#f8f9fa" };
  const cellStyles = { padding: "0.3rem", fontSize: "0.875rem" };
  const imgStyles = { maxHeight: "50px", objectFit: "cover" };
  const buttonStyles = {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    color: "white",
    marginLeft: "auto",
    cursor: "pointer",
  };
  const buttonHoverStyles = {
    backgroundColor: "#0056b3",
    borderColor: "#004085",
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow">
        <div className="card-body">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div
                className="spinner-border text-primary"
                role="status"
                aria-label="Loading"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <h5 className="text-danger">{error}</h5>
            </div>
          ) : (
            <div className="table-responsive" style={tableStyles}>
              <table className="table table-bordered table-sm table-striped table-hover">
                <thead className="table-primary">
                  <tr className="text-center">
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Order ID
                    </th>
                    <th scope="col">
                      <select
                        className="form-select"
                        aria-label="Order status filter"
                        value={filterStatus}
                        onChange={handleFilterChange}
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Name
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Place
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Phone
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Payment
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Total
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Order Date
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Products
                    </th>
                    <th scope="col" style={{ padding: "10px 10px" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td style={cellStyles}>{order.orderId}</td>
                        <td style={cellStyles} className="text-center">
                          {order.status === "Pending" && (
                            <span className="badge rounded-pill text-bg-warning">
                              Pending
                            </span>
                          )}
                          {order.status === "Cancelled" && (
                            <span className="badge rounded-pill text-bg-danger">
                              Cancelled
                            </span>
                          )}
                          {order.status === "Shipped" && (
                            <span className="badge rounded-pill text-bg-info">
                              Shipped
                            </span>
                          )}
                          {order.status === "Delivered" && (
                            <span className="badge rounded-pill text-bg-success">
                              Delivered
                            </span>
                          )}
                          {order.status === "Processing" && (
                            <span className="badge rounded-pill text-bg-primary">
                              Processing
                            </span>
                          )}
                        </td>
                        <td style={cellStyles}>{order.userId.username}</td>
                        <td style={cellStyles}>{order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে"}</td>
                        <td style={cellStyles}>{order.userId.phoneNumber}</td>
                        <td style={cellStyles}>{order.paymentMethod}</td>
                        <td style={cellStyles}>{order.totalAmount  - order.couponAmount + order.shippingCost}</td>
                        <td style={cellStyles}>
                          {new Date(order.orderDate).toLocaleString()}
                        </td>
                        <td style={cellStyles}>
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th scope="col">Image</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product) => (
                                <tr key={product.product._id}>
                                  <td>
                                    <img
                                      src={product.product.images[0]}
                                      alt={product.product.productName}
                                      className="img-fluid"
                                      style={imgStyles}
                                    />
                                  </td>
                                  <td className="text-center">{product.qty}</td>
                                  <td>{product.product.productRegularPrice}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                        <td style={cellStyles}>
                          <button
                            className="btn btn-sm"
                            style={buttonStyles}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor =
                                buttonHoverStyles.backgroundColor;
                              e.target.style.borderColor =
                                buttonHoverStyles.borderColor;
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor =
                                buttonStyles.backgroundColor;
                              e.target.style.borderColor =
                                buttonStyles.borderColor;
                            }}
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
                        colSpan="10"
                        className="text-center"
                        style={{ padding: "1rem" }}
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
