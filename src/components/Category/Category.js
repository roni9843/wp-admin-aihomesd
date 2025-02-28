import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Form,
  Alert,
  Card,
  ListGroup,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faImage, faUpload } from "@fortawesome/free-solid-svg-icons";
import { Box, Typography, Tooltip, Avatar, Chip, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import dayjs from "dayjs";

// Styled components
const StyledCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 12px 40px rgba(26, 188, 156, 0.15)',
  borderLeft: '4px solid #1abc9c',
  background: '#ffffff',
});

const StyledButton = styled(Button)({
  background: '#1abc9c',
  border: 'none',
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  boxShadow: '0 5px 15px rgba(26,188,156,0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#148c76',
  },
});

const StyledFormControl = styled(Form.Control)({
  borderRadius: 10,
  background: '#e6f4f1',
  border: 'none',
  '&:focus': {
    borderColor: '#1abc9c',
    boxShadow: '0 0 0 0.2rem rgba(26, 188, 156, 0.25)',
  },
});

export default function Category() {
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://backend.aihomesd.com/getAllCategory");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to load categories");
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveCategory = async (categoryId) => {
    try {
      const response = await fetch(
        `https://backend.aihomesd.com/removeCategory/${categoryId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove category");
      }

      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      setMessage("Category deleted successfully");
    } catch (error) {
      console.error("Error removing category:", error);
      setMessage("Error removing category");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      setMessage("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(
          "https://api.imgbb.com/1/upload?key=b7424c6aa6bf3ab8f5c2a405e70531a2",
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (!data.success) throw new Error("Image upload failed");
        imageUrl = data.data.url;
      }

      const categoryResponse = await fetch(
        "https://backend.aihomesd.com/addCategory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, image: imageUrl }),
        }
      );

      if (!categoryResponse.ok) throw new Error("Failed to add category");

      const responseData = await categoryResponse.json();
      setCategories(responseData.getCategories);
      setCategory("");
      setImageFile(null);
      setPreviewUrl(null);
      setMessage("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage("Error adding category");
    } finally {
      setLoading(false);
    }
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
              <FontAwesomeIcon icon={faImage} size="lg" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: "#2d3748" }}>
                Category Management
              </Typography>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Organize your product categories
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${categories.length} Categories`}
            sx={{ bgcolor: "#1abc9c", color: "#ffffff", fontWeight: 600, borderRadius: 2 }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* Add Category Form */}
          <StyledCard sx={{ flex: 1 }}>
            <Card.Header style={{ background: "#e6f4f1", padding: "15px 20px" }}>
              <Typography variant="h6" sx={{ color: "#2d3748", fontWeight: 600 }}>
                Add New Category
              </Typography>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAddCategory}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <StyledFormControl
                    type="text"
                    value={category}
                    onChange={handleCategoryChange}
                    required
                    placeholder="Enter category name"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category Image (Optional)</Form.Label>
                  <StyledFormControl
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {previewUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={previewUrl}
                        alt="Preview"
                        style={{ maxWidth: "150px", borderRadius: 8, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                      />
                    </Box>
                  )}
                </Form.Group>

                <StyledButton
                  type="submit"
                  disabled={loading || !category.trim()}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  {loading ? "Adding..." : "Add Category"}
                </StyledButton>
              </Form>

              {message && (
                <Alert
                  variant={message.includes("Error") ? "danger" : "success"}
                  className="mt-3"
                  style={{ borderRadius: 8 }}
                >
                  {message}
                </Alert>
              )}
            </Card.Body>
          </StyledCard>

          {/* Categories List */}
          <StyledCard sx={{ flex: 1, maxHeight: "500px", overflowY: "auto" }}>
            <Card.Header style={{ background: "#e6f4f1", padding: "15px 20px" }}>
              <Typography variant="h6" sx={{ color: "#2d3748", fontWeight: 600 }}>
                Existing Categories
              </Typography>
            </Card.Header>
            <ListGroup variant="flush">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <ListGroup.Item
                    key={cat._id}
                    className="d-flex justify-content-between align-items-center"
                    style={{ padding: "15px 20px" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {cat.image ? (
                        <Tooltip title="Category Image">
                          <img
                            src={cat.image}
                            alt={cat.category}
                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover" }}
                          />
                        </Tooltip>
                      ) : (
                        <Avatar sx={{ bgcolor: "#d1ece5", width: 50, height: 50 }}>
                          <FontAwesomeIcon icon={faImage} style={{ color: "#1abc9c" }} />
                        </Avatar>
                      )}
                      <Box>
                        <Typography sx={{ fontWeight: 500, color: "#2d3748" }}>
                          {cat.category}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#718096" }}>
                          Added: {dayjs(cat.createdAt).format("DD MMM YYYY")}
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title="Remove Category">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveCategory(cat._id)}
                        style={{ borderRadius: 8 }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Tooltip>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item className="text-center py-4" style={{ color: "#718096" }}>
                  No categories found
                </ListGroup.Item>
              )}
            </ListGroup>
          </StyledCard>
        </Box>
      </Container>
    </Box>
  );
}