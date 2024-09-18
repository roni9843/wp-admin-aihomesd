import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  HourglassEmpty as PendingOrdersIcon,
  Build as ProcessingOrdersIcon,
  AttachMoney as TotalEarnedIcon,
  AccessAlarm as TotalOrdersIcon,
  Group as TotalUsersIcon,
} from "@mui/icons-material";

// Main component to display metrics and chart
const OrderMetrics = () => {
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

  const [categories, setCategories] = useState([]);

  // use
  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllCategory")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllUser")
      .then((response) => response.json())
      .then((data) => {
        console.log("data -> ", data);
        // Sort the user data by 'createdAt' field in descending order
        const sortedData = data.user?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCustomerData(sortedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Calculate key metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const CompleteOrder = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const totalEarned = orders
    .filter((order) => order.status === "Delivered")
    .reduce((acc, order) => acc + order.totalAmount, 0);

  // Get today's date and the date 30 days ago
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Filter orders to include only those within the last 30 days
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= thirtyDaysAgo && orderDate <= today;
  });

  // Aggregate orders by date
  const ordersByDate = filteredOrders.reduce((acc, order) => {
    const orderDate = new Date(order.orderDate).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    if (acc[orderDate]) {
      acc[orderDate] += 1; // Increment count of orders for that date
    } else {
      acc[orderDate] = 1; // Initialize count for that date
    }
    return acc;
  }, {});

  // Convert the aggregated data to an array format and sort by date
  const orderDataByDate = Object.keys(ordersByDate)
    .map((date) => ({
      date,
      count: ordersByDate[date],
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Convert dates to the desired format (MM/DD/YYYY)
  const formattedOrderDataByDate = orderDataByDate.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US"),
    Order: item.count,
  }));
  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f9" }}>
      <Grid container spacing={3} alignItems="stretch">
        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/order/order-list`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <TotalOrdersIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h4" component="div">
                {totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Orders */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/order/order-list`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "#f39c12",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <PendingOrdersIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Pending Orders
              </Typography>
              <Typography variant="h4" component="div">
                {pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Processing Orders */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/order/order-list`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "#3498db",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <ProcessingOrdersIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Complete Orders
              </Typography>
              <Typography variant="h4" component="div">
                {CompleteOrder}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Category */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/product/product-category`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "rgb(40, 228, 225)",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <ProcessingOrdersIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Total Category
              </Typography>
              <Typography variant="h4" component="div">
                {categories && categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Earned */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/order/order-list`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "#2ecc71",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <TotalEarnedIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Total Earned
              </Typography>
              <Typography variant="h4" component="div">
                ৳{totalEarned}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Users */}
        <Grid item xs={12} sm={6} md={2}>
          <Card
            onClick={() =>
              window.open(
                `${window.location.origin}/dashboard/user/register-customer`,
                "_blank"
              )
            }
            sx={{
              backgroundColor: "#8e44ad",
              color: "#fff",
              textAlign: "center",
              height: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CardContent>
              <Box mb={2}>
                <TotalUsersIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" component="div" gutterBottom>
                Total Register Customer
              </Typography>
              <Typography variant="h4" component="div">
                {customerData && customerData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ color: "#333" }}
        >
          Order Chart
        </Typography>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={formattedOrderDataByDate}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Order"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Box>
    </div>
  );
};

export default OrderMetrics;
