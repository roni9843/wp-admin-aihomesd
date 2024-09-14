import React, { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllOrder") // Replace with your backend API URL
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedData);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const tableStyles = {
    backgroundColor: "#f8f9fa",
  };

  const cellStyles = {
    padding: "0.3rem",
    fontSize: "0.875rem",
  };

  const badgeStyles = {
    success: {
      backgroundColor: "#28a745",
    },
    danger: {
      backgroundColor: "#dc3545",
    },
  };

  const imgStyles = {
    maxHeight: "50px",
    objectFit: "cover",
  };

  const cardHeaderStyles = {
    backgroundColor: "#007bff",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
  };

  const cardHeaderTextStyles = {
    fontSize: "1.25rem",
    margin: 0,
  };

  const buttonStyles = {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    color: "white",
    marginLeft: "auto",
  };

  const buttonHoverStyles = {
    backgroundColor: "#0056b3",
    borderColor: "#004085",
  };

  const handleFilterChange = (status) => {
    // Implement filtering logic based on status
    const filteredOrders = orders.filter((order) => order.status === status);
    setOrders(filteredOrders);
  };
  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive" style={tableStyles}>
            <table className="table table-bordered table-sm table-striped table-hover">
              <thead className="table-primary ">
                <tr className="text-center container-fluid">
                  <th scope="col" style={{ padding: "10px 10px" }}>
                    Order ID
                  </th>
                  <th scope="col">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>All</option>
                      <option value="Pending">Pending</option>
                      <option value="1">Processing</option>
                      <option value="2">Shipped</option>
                      <option value="2">Delivered</option>
                      <option value="3">Cancelled</option>
                    </select>
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Name
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Email
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Phone
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Payment
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Total
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Order Date
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Products
                  </th>
                  <th scope="col " style={{ padding: "10px 10px" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
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
                    <td style={cellStyles}>{order.userId.email}</td>
                    <td style={cellStyles}>{order.userId.phoneNumber}</td>
                    <td style={cellStyles}>{order.paymentMethod}</td>
                    <td style={cellStyles}>${order.totalAmount}</td>
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
                              <td>${product.product.productRegularPrice}</td>
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
                          e.target.style.borderColor = buttonStyles.borderColor;
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
