import React, { useEffect, useState } from "react";

export default function Email() {
  const [loading] = useState(false); // Set to false as we're using demo data
  const [error] = useState(null);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllEmail")
      .then((response) => response.json())
      .then((data) => {
        // Sort the user data by 'createdAt' field in descending order
        const sortedData = data?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        console.log("data -> ", sortedData);
        setCustomerData(sortedData);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "20px", margin: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead className="table-primary">
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Created Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {customerData &&
            customerData.map((email) => (
              <tr
                key={email._id}
                style={{
                  backgroundColor: "#fafafa", // Light grey for odd rows
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f1f1f1"; // Hover color
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fafafa"; // Original color
                }}
              >
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {email.email || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {email.phone || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {email.name || "N/A"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {formatDate(email.createdDate)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {email.message || "No message"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
