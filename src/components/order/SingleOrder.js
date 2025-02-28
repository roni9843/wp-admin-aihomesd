import React, { useEffect, useLayoutEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Invoice from "./Invoice";
import { Box, Card, Typography, Button } from "@mui/material";

export default function SingleOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const path = window.location.pathname;
    const id = path.split("orderId=")[1];
    setOrderId(id);
  }, []);

  useEffect(() => {
    if (orderId) {
      callProduct(orderId);
    }
  }, [orderId]);

  const callProduct = async (orderId) => {
    setLoading(true);
    const url = "https://backend.aihomesd.com/getOrderByOrderId";
    const payload = { orderId };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOrder(data[0]);
      setStatus(data[0].status);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSaveChanges = async () => {
    const url = `https://backend.aihomesd.com/updateOrderStatus/${orderId}`;
    const payload = { status };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await callProduct(orderId);
      alert("Order status updated successfully");
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      alert("Failed to update order status");
    }
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (Object.keys(order).length === 0) {
    return (
      <div className="container-fluid py-5 text-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <Card sx={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "20px" }}>
          <Typography variant="h5" style={{ color: "#6c757d" }}>
            No order available
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-5" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <Box
        className="d-flex justify-content-between align-items-center mb-5"
        sx={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderBottom: "4px solid #1abc9c",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700", color: "#0B2948" }}>
          Order #{orderId}
        </Typography>
        <Box className="d-flex align-items-center gap-3">
          <Invoice orderDetails={order} />
        </Box>
      </Box>

      <div className="row g-4">
        {/* Sidebar: Logistics and Customer Details */}
        <div className="col-12 col-lg-4 order-lg-2">
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              background: "linear-gradient(135deg, #ffffff, #f1f3f5)",
              mb: 4,
            }}
          >
            <div className="card-header" style={{ backgroundColor: "#3498db", color: "#fff", fontWeight: "600", padding: "15px" }}>
              Logistics Details
            </div>
            <div className="card-body p-4">
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Order Date
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {new Date(order.orderDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </Typography>
              </Box>
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Payment
                </Typography>
                <input
                  type="text"
                  className="form-control"
                  value="Cash on Delivery"
                  readOnly
                  style={{ fontSize: "0.9rem", backgroundColor: "#e9ecef", borderRadius: "6px" }}
                />
              </Box>
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Shipping Place
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে"}
                </Typography>
              </Box>
              <Box className="mb-4">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Order Status
                </Typography>
                <select
                  className="form-select"
                  value={status}
                  onChange={handleStatusChange}
                  style={{ fontSize: "0.9rem", borderRadius: "6px", padding: "8px" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSaveChanges}
                sx={{
                  backgroundColor: "#1abc9c",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "10px",
                  fontSize: "0.9rem",
                  "&:hover": { backgroundColor: "#148c76" },
                }}
              >
                Save Changes
              </Button>
            </div>
          </Card>

          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              background: "linear-gradient(135deg, #ffffff, #f1f3f5)",
            }}
          >
            <div className="card-header" style={{ backgroundColor: "#f39c12", color: "#fff", fontWeight: "600", padding: "15px" }}>
              Customer Details
            </div>
            <div className="card-body p-4">
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Name
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.name}
                </Typography>
              </Box>
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.phoneNumber}
                </Typography>
              </Box>
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Address
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.address}
                </Typography>
              </Box>
              <Box className="mb-3">
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Thana District
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.thanaDistrict}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#6c757d", fontWeight: "600" }}>
                  Order Notes
                </Typography>
                <Typography variant="body1" sx={{ color: "#0B2948" }}>
                  {order.orderNotes || "N/A"}
                </Typography>
              </Box>
            </div>
          </Card>
        </div>

        {/* Product Details */}
        <div className="col-12 col-lg-8 order-lg-1">
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              borderTop: "4px solid #1abc9c",
            }}
          >
            <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#0B2948", color: "#fff", fontWeight: "600", padding: "15px" }}>
              <span>Product Details</span>
              <Typography variant="body2" sx={{ color: "#d1d8e0" }}>
                Total Items: {order.products.length}
              </Typography>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "#f1f3f5", color: "#0B2948" }}>
                    <tr className="text-center">
                      <th style={{ padding: "12px", fontWeight: "600" }}>Image</th>
                      <th style={{ padding: "12px", fontWeight: "600" }}>Product Name</th>
                      <th style={{ padding: "12px", fontWeight: "600" }}>Item Price</th>
                      <th style={{ padding: "12px", fontWeight: "600" }}>Qty</th>
                      <th style={{ padding: "12px", fontWeight: "600" }}>Total</th>
                      <th style={{ padding: "12px", fontWeight: "600" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ padding: "10px" }}>
                          <img
                            src={item.product.images[0]}
                            alt={item.product.productName}
                            style={{ maxWidth: "50px", borderRadius: "4px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                          />
                        </td>
                        <td style={{ padding: "10px", fontSize: "0.9rem" }}>{item.product.productName}</td>
                        <td className="text-center" style={{ padding: "10px", fontSize: "0.9rem" }}>
                          ৳{item.price.toLocaleString()}
                        </td>
                        <td className="text-center" style={{ padding: "10px", fontSize: "0.9rem" }}>
                          {item.qty}
                        </td>
                        <td className="text-center" style={{ padding: "10px", fontSize: "0.9rem" }}>
                          ৳{(item.qty * item.price).toLocaleString()}
                        </td>
                        <td className="text-center" style={{ padding: "10px" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            href={`https://aihomesd.com/product/${item.product._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: "#3498db",
                              borderColor: "#3498db",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              fontSize: "0.85rem",
                              "&:hover": { backgroundColor: "#3498db", color: "#fff", borderColor: "#3498db" },
                            }}
                          >
                            Visit
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: "#e9ecef", fontWeight: "600" }}>
                      <td colSpan="4" style={{ padding: "10px", textAlign: "right" }}>
                        Subtotal
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}>
                        ৳{order?.totalAmount.toLocaleString()}
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}></td>
                    </tr>
                    {order?.couponAmount !== 0 && (
                      <tr style={{ backgroundColor: "#e9ecef", fontWeight: "600" }}>
                        <td colSpan="4" style={{ padding: "10px", textAlign: "right" }}>
                          Coupon ({order?.couponCode})
                        </td>
                        <td className="text-center" style={{ padding: "10px" }}>
                          -৳{order?.couponAmount.toLocaleString()}
                        </td>
                        <td className="text-center" style={{ padding: "10px" }}></td>
                      </tr>
                    )}
                    <tr style={{ backgroundColor: "#e9ecef", fontWeight: "600" }}>
                      <td colSpan="4" style={{ padding: "10px", textAlign: "right" }}>
                        Shipping Cost ({order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে"})
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}>
                        ৳{order?.shippingCost.toLocaleString()}
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}></td>
                    </tr>
                    <tr style={{ backgroundColor: "#d1e7dd", fontWeight: "700" }}>
                      <td colSpan="4" style={{ padding: "10px", textAlign: "right" }}>
                        Grand Total
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}>
                        ৳{(order?.totalAmount + order?.shippingCost - order?.couponAmount).toLocaleString()}
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}