import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Pagination,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload, faSort, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Typography, Chip, Tooltip, Avatar } from "@mui/material";
import dayjs from "dayjs";

export default function Email() {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const emailsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch("https://backend.aihomesd.com/getAllEmail")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch emails");
        return response.json();
      })
      .then((data) => {
        setCustomerData(data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
        setError(error.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD MMM YYYY, HH:mm");
  };

  const getFilteredAndSortedEmails = () => {
    let filtered = [...customerData];
    if (searchQuery) {
      filtered = filtered.filter((email) =>
        ["email", "name", "phone"].some((field) =>
          email[field]?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    if (startDate || endDate) {
      filtered = filtered.filter((email) => {
        const createdDate = dayjs(email.createdDate);
        return (!startDate || createdDate.isAfter(startDate)) &&
               (!endDate || createdDate.isBefore(endDate));
      });
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

  const filteredEmails = getFilteredAndSortedEmails();
  const pageCount = Math.ceil(filteredEmails.length / emailsPerPage);
  const currentEmails = filteredEmails.slice(
    (currentPage - 1) * emailsPerPage,
    currentPage * emailsPerPage
  );

  const handleSelectEmail = (id) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const dataToExport = selectedEmails.length > 0 
      ? customerData.filter(email => selectedEmails.includes(email._id))
      : filteredEmails;
    const csvRows = [
      ["Email", "Phone", "Name", "Created Date", "Message"],
      ...dataToExport.map((email) => [
        email.email || "N/A",
        email.phone || "N/A",
        email.name || "N/A",
        formatDate(email.createdDate),
        email.message || "No message",
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Emails_${dayjs().format("YYYY-MM-DD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{
        minHeight: "100vh",
        bgcolor: "#e6f4f1", // Light teal background based on #1abc9c
        p: 4,
        fontFamily: "'Poppins', sans-serif",
      }}>
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
              <FontAwesomeIcon icon={faEnvelope} size="lg" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d3748" }}>
                Email Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Manage your communications
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={exportToCSV}
              disabled={filteredEmails.length === 0}
              style={{
                background: "#1abc9c",
                border: "none",
                borderRadius: 10,
                padding: "12px 24px",
                fontWeight: 600,
                boxShadow: "0 5px 15px rgba(26,188,156,0.3)",
                transition: "all 0.3s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => (e.target.style.background = "#148c76")}
              onMouseOut={(e) => (e.target.style.background = "#1abc9c")}
            >
              <FontAwesomeIcon icon={faDownload} className="me-2" />
              {selectedEmails.length > 0 ? `Export (${selectedEmails.length})` : "Export All"}
            </Button>
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "12px 20px",
                  color: "#2d3748",
                  fontWeight: 500,
                }}
              >
                <FontAwesomeIcon icon={faSort} className="me-2" />
                Sort
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ borderRadius: 10, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
                <Dropdown.Item onClick={() => { setSortBy("createdAt"); setSortOrder("desc"); }}>
                  Latest First
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy("createdAt"); setSortOrder("asc"); }}>
                  Oldest First
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy("email"); setSortOrder("asc"); }}>
                  Email A-Z
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy("name"); setSortOrder("asc"); }}>
                  Name A-Z
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "#e6f4f1", border: "none", color: "#2d3748", borderRadius: "0 10px 10px 0" }}
            />
          </InputGroup>
          <DatePicker
            label="From"
            value={startDate}
            onChange={setStartDate}
            slotProps={{
              textField: {
                sx: {
                  "& .MuiInputBase-root": { bgcolor: "#e6f4f1", color: "#2d3748", borderRadius: 2 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiInputLabel-root": { color: "#718096" },
                },
              },
            }}
          />
          <DatePicker
            label="To"
            value={endDate}
            onChange={setEndDate}
            slotProps={{
              textField: {
                sx: {
                  "& .MuiInputBase-root": { bgcolor: "#e6f4f1", color: "#2d3748", borderRadius: 2 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiInputLabel-root": { color: "#718096" },
                },
              },
            }}
          />
          <Chip
            label={`${filteredEmails.length} Results`}
            sx={{ bgcolor: "#1abc9c", color: "#ffffff", fontWeight: 600, borderRadius: 2 }}
          />
        </Box>

        {/* Table */}
        <Box sx={{
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}>
          <Table hover style={{ margin: 0, color: "#2d3748" }}>
            <thead style={{ background: "#e6f4f1" }}>
              <tr>
                <th style={{ padding: "15px 20px" }}>
                  <Form.Check
                    onChange={(e) => setSelectedEmails(
                      e.target.checked ? currentEmails.map(e => e._id) : []
                    )}
                  />
                </th>
                <th style={{ padding: "15px 20px", fontWeight: 600 }}>Email</th>
                <th style={{ padding: "15px 20px", fontWeight: 600 }}>Phone</th>
                <th style={{ padding: "15px 20px", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "15px 20px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "15px 20px", fontWeight: 600 }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="spinner-border text-primary" style={{ color: "#1abc9c" }} role="status" />
                  </td>
                </tr>
              ) : currentEmails.length > 0 ? (
                currentEmails.map((email) => (
                  <tr key={email._id} style={{ 
                    transition: "all 0.3s ease",
                    "&:hover": { background: "#f0f9f7" } // Light teal hover
                  }}>
                    <td style={{ padding: "15px 20px" }}>
                      <Form.Check
                        checked={selectedEmails.includes(email._id)}
                        onChange={() => handleSelectEmail(email._id)}
                      />
                    </td>
                    <td style={{ padding: "15px 20px" }}>
                      <Tooltip title="Copy Email">
                        <span
                          onClick={() => navigator.clipboard.writeText(email.email)}
                          style={{ cursor: "pointer", color: "#1abc9c" }}
                        >
                          {email.email || "N/A"}
                        </span>
                      </Tooltip>
                    </td>
                    <td style={{ padding: "15px 20px" }}>{email.phone || "N/A"}</td>
                    <td style={{ padding: "15px 20px" }}>{email.name || "N/A"}</td>
                    <td style={{ padding: "15px 20px" }}>{formatDate(email.createdDate)}</td>
                    <td style={{ padding: "15px 20px" }}>{email.message || "No message"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-5" style={{ color: "#718096" }}>
                    No emails found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {pageCount > 1 && (
            <Box sx={{
              p: 3,
              display: "flex",
              justifyContent: "center",
              bgcolor: "#e6f4f1",
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
        </Box>
      </Box>
    </LocalizationProvider>
  );
}