import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HourglassEmpty as PendingOrdersIcon,
  Build as ProcessingOrdersIcon,
  AttachMoney as TotalEarnedIcon,
  AccessAlarm as TotalOrdersIcon,
  Group as TotalUsersIcon,
  Category as CategoryIcon,
  ShoppingCart as CartIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PerformanceDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const [chartType, setChartType] = useState("line");

  // Fetch data
  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllOrder")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
      })
      .catch((error) => console.error("Error fetching orders:", error));

    fetch("https://backend.aihomesd.com/getAllCategory")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));

    fetch("https://backend.aihomesd.com/getAllUser")
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.user?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCustomerData(sortedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Filter data based on date range
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= startDate.toDate() && orderDate <= endDate.toDate();
  });

  // Calculate metrics
  const totalOrders = filteredOrders.length;
  const pendingOrders = filteredOrders.filter((order) => order.status === "Pending").length;
  const processingOrders = filteredOrders.filter((order) => order.status === "Processing").length;
  const shippedOrders = filteredOrders.filter((order) => order.status === "Shipped").length;
  const deliveredOrders = filteredOrders.filter((order) => order.status === "Delivered").length;
  const cancelledOrders = filteredOrders.filter((order) => order.status === "Cancelled").length;
  const totalEarned = filteredOrders
    .filter((order) => order.status === "Delivered")
    .reduce((acc, order) => acc + order.totalAmount, 0);
  const averageOrderValue = deliveredOrders > 0 ? totalEarned / deliveredOrders : 0;
  const totalProductsSold = filteredOrders.reduce(
    (acc, order) => acc + order.products.reduce((sum, p) => sum + p.qty, 0),
    0
  );

  // Top Products
  const productSales = filteredOrders.reduce((acc, order) => {
    order.products.forEach((p) => {
      acc[p.product._id] = {
        name: p.product.productName,
        qty: (acc[p.product._id]?.qty || 0) + p.qty,
      };
    });
    return acc;
  }, {});
  const topProducts = Object.entries(productSales)
    .map(([id, { name, qty }]) => ({ id, name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Order Status Breakdown for Pie Chart
  const statusData = [
    { name: "Pending", value: pendingOrders, color: "#f39c12" },
    { name: "Processing", value: processingOrders, color: "#3498db" },
    { name: "Shipped", value: shippedOrders, color: "#e67e22" },
    { name: "Delivered", value: deliveredOrders, color: "#2ecc71" },
    { name: "Cancelled", value: cancelledOrders, color: "#e74c3c" },
  ].filter((item) => item.value > 0);

  // Customer Growth
  const customersByDate = customerData.reduce((acc, customer) => {
    const date = new Date(customer.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
  const customerGrowthData = Object.keys(customersByDate)
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US"),
      Customers: customersByDate[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate.toDate() && itemDate <= endDate.toDate();
    });

  // Orders by Date for Line/Bar Chart
  const ordersByDate = filteredOrders.reduce((acc, order) => {
    const orderDate = new Date(order.orderDate).toISOString().split("T")[0];
    acc[orderDate] = (acc[orderDate] || 0) + 1;
    return acc;
  }, {});
  const orderChartData = Object.keys(ordersByDate)
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US"),
      Orders: ordersByDate[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Handle card click
  const handleCardClick = (status, redirectUrl) => {
    localStorage.setItem("orderFilterStatus", status);
    window.open(redirectUrl, "_blank");
  };

  // Export data as CSV
  const exportToCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Total Orders", totalOrders],
      ["Pending Orders", pendingOrders],
      ["Processing Orders", processingOrders],
      ["Shipped Orders", shippedOrders],
      ["Delivered Orders", deliveredOrders],
      ["Cancelled Orders", cancelledOrders],
      ["Total Earned", totalEarned],
      ["Average Order Value", averageOrderValue.toFixed(2)],
      ["Total Products Sold", totalProductsSold],
      ["Total Categories", categories.length],
      ["Total Customers", customerData.length],
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Performance_Dashboard_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className="container-fluid px-4 py-5"
        style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}
      >
        {/* Header */}
       


        <Box
        className="d-flex justify-content-between align-items-center mb-5"
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderLeft: "5px solid #1abc9c",
        }}
      >
        <Typography variant="h4" style={{ fontWeight: "700", color: "#0B2948" }}>
          E-Commerce Performance Dashboard
        </Typography>
        <Box className="d-flex align-items-center gap-3">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ backgroundColor: "#f1f3f5", borderRadius: "6px", "& .MuiInputBase-input": { color: "#0B2948" } }}
              />
            )}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ backgroundColor: "#f1f3f5", borderRadius: "6px", "& .MuiInputBase-input": { color: "#0B2948" } }}
              />
            )}
          />
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
            style={{ backgroundColor: "#1abc9c", color: "#fff", borderRadius: "6px", padding: "8px 16px" }}
          >
            Export
          </Button>
        </Box>
      </Box>




        {/* Quick Stats */}
        <Grid container spacing={2} mb={4}>
          {[
            { label: "Total Orders", value: totalOrders, color: "#4CAF50" },
            { label: "Total Earned", value: `৳${totalEarned.toLocaleString()}`, color: "#27ae60" },
            { label: "Avg Order Value", value: `৳${averageOrderValue.toFixed(2)}`, color: "#8e44ad" },
            { label: "Products Sold", value: totalProductsSold, color: "#d35400" },
            { label: "Total Customers", value: customerData.length, color: "#9b59b6" },
          ].map((stat, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <Box
                className="text-center p-3"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}22, #fff)`,
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  animation: "fadeIn 0.5s ease-in-out",
                }}
              >
                <Typography variant="subtitle2" style={{ color: "#0B2948", fontWeight: "600" }}>
                  {stat.label}
                </Typography>
                <Typography variant="h6" style={{ color: stat.color, fontWeight: "700" }}>
                  {stat.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Main Sections */}
        <Grid container spacing={4}>
          {/* Order Trends */}
          <Grid item xs={12} md={8}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <CardContent>
                <Box className="d-flex justify-content-between align-items-center mb-3">
                  <Typography variant="h5" style={{ fontWeight: "700", color: "#0B2948" }}>
                    Order Trends
                  </Typography>
                  <FormControl variant="outlined" size="small" style={{ minWidth: "120px" }}>
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      label="Chart Type"
                      style={{ borderRadius: "6px" }}
                    >
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <ResponsiveContainer width="100%" height={400}>
                  {chartType === "line" ? (
                    <LineChart data={orderChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Orders"
                        stroke="#1abc9c"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={orderChartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderRadius: "6px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Orders" fill="#1abc9c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Status Breakdown */}
          <Grid item xs={12} md={4}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <CardContent>
                <Typography variant="h5" style={{ fontWeight: "700", color: "#0B2948", marginBottom: "20px" }}>
                  Order Status Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Products */}
          <Grid item xs={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <CardContent>
                <Typography variant="h5" style={{ fontWeight: "700", color: "#0B2948", marginBottom: "20px" }}>
                  Top 5 Best-Selling Products
                </Typography>
                <Box>
                  {topProducts.map((product, index) => (
                    <Box
                      key={product.id}
                      className="d-flex justify-content-between align-items-center py-2"
                      style={{
                        borderBottom: index < topProducts.length - 1 ? "1px solid #e0e0e0" : "none",
                      }}
                    >
                      <Typography variant="body1" style={{ fontSize: "0.9rem", color: "#333" }}>
                        {index + 1}. {product.name}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: "600", color: "#1abc9c" }}>
                        {product.qty} sold
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Customer Growth */}
          <Grid item xs={12} md={6}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                overflow: "hidden",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <CardContent>
                <Typography variant="h5" style={{ fontWeight: "700", color: "#0B2948", marginBottom: "20px" }}>
                  Customer Growth
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Customers"
                      stroke="#9b59b6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Fade-in Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </LocalizationProvider>
  );
};

export default PerformanceDashboard;