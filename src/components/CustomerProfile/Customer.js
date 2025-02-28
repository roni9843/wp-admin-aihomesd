import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Pagination,
  InputGroup,
  FormControl,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faSort, faUser } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography, Chip, Tooltip, Avatar } from "@mui/material";
import { styled } from '@mui/material/styles';
import dayjs from "dayjs";

// Styled components
const StyledTable = styled(Table)({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  background: '#ffffff',
});

const StyledButton = styled(Button)({
  background: '#1abc9c',
  border: 'none',
  borderRadius: 10,
  padding: '12px 24px',
  fontWeight: 600,
  boxShadow: '0 5px 15px rgba(26,188,156,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#148c76',
  },
});

export default function Customer() {
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const usersPerPage = 10;

  useEffect(() => {
    fetch("https://backend.aihomesd.com/getAllUser")
      .then((response) => response.json())
      .then((data) => {
        console.log("data -> ", data);
        setCustomerData(data.user || []);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY, HH:mm");
  };

  // Filter and sort users
  const getFilteredAndSortedUsers = () => {
    let filtered = [...customerData];

    if (searchQuery) {
      filtered = filtered.filter((user) =>
        ["username", "phoneNumber", "email"].some((field) =>
          user[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      const valueA = a[sortBy] || "";
      const valueB = b[sortBy] || "";
      if (sortBy === "createdAt") {
        return sortOrder === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortOrder === "desc"
        ? String(valueB).localeCompare(String(valueA))
        : String(valueA).localeCompare(String(valueB));
    });

    return filtered;
  };

  const filteredUsers = getFilteredAndSortedUsers();
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleSelectUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const dataToExport = selectedUsers.length > 0 
      ? customerData.filter(user => selectedUsers.includes(user._id))
      : filteredUsers;
    const csvRows = [
      ["Username", "Phone Number", "Email", "Created At"],
      ...dataToExport.map((user) => [
        user.username || "N/A",
        user.phoneNumber || "N/A",
        user.email || "N/A",
        formatDate(user.createdAt),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Customers_${dayjs().format("YYYY-MM-DD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#e6f4f1", p: 4, fontFamily: "'Poppins', sans-serif" }}>
      <Container>
        {/* Header */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          bgcolor: "#ffffff",
          p: 3,
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          borderLeft: "4px solid #1abc9c",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#1abc9c", width: 50, height: 50 }}>
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d3748" }}>
                Customer Management
              </Typography>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Overview of all registered users
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <StyledButton
              onClick={exportToCSV}
              disabled={filteredUsers.length === 0}
            >
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              {selectedUsers.length > 0 ? `Export (${selectedUsers.length})` : "Export All"}
            </StyledButton>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{
          bgcolor: "#ffffff",
          p: 3,
          borderRadius: 3,
          mb: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          alignItems: "center",
        }}>
          <InputGroup sx={{ maxWidth: 320, borderRadius: 10 }}>
            <InputGroup.Text sx={{ bgcolor: "#e6f4f1", border: "none", color: "#718096" }}>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "#e6f4f1", border: "none", color: "#2d3748", borderRadius: "0 10px 10px 0" }}
            />
          </InputGroup>
          <Chip
            label={`${filteredUsers.length} Customers`}
            sx={{ bgcolor: "#1abc9c", color: "#ffffff", fontWeight: 600, borderRadius: 2 }}
          />
        </Box>

        {/* Table */}
        <StyledTable hover>
          <thead style={{ background: "#e6f4f1" }}>
            <tr>
              <th style={{ padding: "15px 20px" }}>
                <Form.Check
                  onChange={(e) => setSelectedUsers(
                    e.target.checked ? currentUsers.map(u => u._id) : []
                  )}
                />
              </th>
              <th style={{ padding: "15px 20px", fontWeight: 600 }}>
                Username
                <FontAwesomeIcon
                  icon={faSort}
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortBy("username");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                />
              </th>
              <th style={{ padding: "15px 20px", fontWeight: 600 }}>
                Phone
                <FontAwesomeIcon
                  icon={faSort}
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortBy("phoneNumber");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                />
              </th>
              <th style={{ padding: "15px 20px", fontWeight: 600 }}>
                Email
                <FontAwesomeIcon
                  icon={faSort}
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortBy("email");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                />
              </th>
              <th style={{ padding: "15px 20px", fontWeight: 600 }}>
                Created At
                <FontAwesomeIcon
                  icon={faSort}
                  className="ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSortBy("createdAt");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                />
              </th>
              <th style={{ padding: "15px 20px", fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id} style={{ transition: "all 0.3s ease" }}>
                  <td style={{ padding: "15px 20px" }}>
                    <Form.Check
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td style={{ padding: "15px 20px" }}>{user.username || "N/A"}</td>
                  <td style={{ padding: "15px 20px" }}>{user.phoneNumber || "N/A"}</td>
                  <td style={{ padding: "15px 20px" }}>
                    <Tooltip title="Copy Email">
                      <span
                        onClick={() => navigator.clipboard.writeText(user.email)}
                        style={{ cursor: "pointer", color: "#1abc9c" }}
                      >
                        {user.email || "N/A"}
                      </span>
                    </Tooltip>
                  </td>
                  <td style={{ padding: "15px 20px" }}>{formatDate(user.createdAt)}</td>
                  <td style={{ padding: "15px 20px" }}>
                    <Badge bg="success" style={{ backgroundColor: "#1abc9c !important", padding: "6px 12px" }}>
                      Active
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-5" style={{ color: "#718096" }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            bgcolor: "#e6f4f1",
            p: 2,
            borderRadius: 3,
          }}>
            <Pagination style={{ margin: 0 }}>
              <Pagination.Prev
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ color: "#1abc9c", background: "#ffffff" }}
              />
              {[...Array(pageCount)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    color: i + 1 === currentPage ? "#ffffff" : "#1abc9c",
                    background: i + 1 === currentPage ? "#1abc9c" : "#ffffff",
                    border: "1px solid #d1ece5",
                    borderRadius: 6,
                  }}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                disabled={currentPage === pageCount}
                style={{ color: "#1abc9c", background: "#ffffff" }}
              />
            </Pagination>
          </Box>
        )}
      </Container>
    </Box>
  );
}