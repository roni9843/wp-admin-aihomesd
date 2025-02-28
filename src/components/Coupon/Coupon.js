import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Alert, Pagination, InputGroup, FormControl,Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ couponCode: "", discountRate: 0, active: true });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;

  // Fetch coupons
  useEffect(() => {
    fetch("https://backend.aihomesd.com/coupons")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch coupons");
        return response.json();
      })
      .then((data) => {
        setCoupons(data);
        setError(null);
      })
      .catch((error) => setError(error.message));
  }, []);

  // Add new coupon
  const addCoupon = () => {
    fetch("https://backend.aihomesd.com/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoupon),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add coupon");
        return response.json();
      })
      .then((data) => {
        setCoupons([...coupons, data]);
        setShowAddModal(false);
        setAddError(null);
        setNewCoupon({ couponCode: "", discountRate: 0, active: true });
      })
      .catch((error) => setAddError(error.message));
  };

  // Update coupon status
  const toggleCouponStatus = (id, status) => {
    fetch(`https://backend.aihomesd.com/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !status }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update coupon");
        return response.json();
      })
      .then((updatedCoupon) => {
        setCoupons(coupons.map((coupon) => (coupon._id === id ? updatedCoupon : coupon)));
        setError(null);
      })
      .catch((error) => setError(error.message));
  };

  // Delete coupon
  const deleteCoupon = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      fetch(`https://backend.aihomesd.com/coupons/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete coupon");
          setCoupons(coupons.filter((coupon) => coupon._id !== id));
          setError(null);
        })
        .catch((error) => setError(error.message));
    }
  };

  // Filter and paginate coupons
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pageCount = Math.ceil(filteredCoupons.length / couponsPerPage);
  const indexOfLastCoupon = currentPage * couponsPerPage;
  const indexOfFirstCoupon = indexOfLastCoupon - couponsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstCoupon, indexOfLastCoupon);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid px-4 py-5" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-5"
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderBottom: "4px solid #1abc9c",
        }}
      >
        <h4 className="mb-0" style={{ fontWeight: "700", color: "#0B2948" }}>
          Coupon Management
        </h4>
        <Button
          variant="contained"
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: "#1abc9c",
            color: "#fff",
            borderRadius: "25px",
            padding: "8px 20px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Coupon
        </Button>
      </div>

      {/* Search and Error */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: "#f1f3f5", borderRadius: "6px 0 0 6px" }}>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
            <FormControl
              placeholder="Search by coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: "0 6px 6px 0", fontSize: "0.9rem" }}
            />
          </InputGroup>
        </div>
        {error && (
          <div className="col-12 mt-3">
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </div>
        )}
      </div>

      {/* Coupons Table */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderTop: "4px solid #1abc9c",
          overflow: "hidden",
        }}
      >
        <div className="card-header" style={{ backgroundColor: "#0B2948", color: "#fff", fontWeight: "600", padding: "15px" }}>
          Coupon List
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ backgroundColor: "#f1f3f5", color: "#0B2948" }}>
                <tr className="text-center">
                  <th style={{ padding: "12px", fontWeight: "600" }}>Coupon Code</th>
                  <th style={{ padding: "12px", fontWeight: "600" }}>Discount ( টাকা )</th>
                  <th style={{ padding: "12px", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCoupons.length > 0 ? (
                  currentCoupons.map((coupon) => (
                    <tr key={coupon._id} style={{ transition: "background-color 0.2s ease" }}>
                      <td className="text-center" style={{ padding: "10px", fontSize: "0.9rem" }}>
                        {coupon.couponCode}
                      </td>
                      <td className="text-center" style={{ padding: "10px", fontSize: "0.9rem" }}>
                        {coupon.discountRate}
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}>
                        <span
                          className={`badge rounded-pill`}
                          style={{
                            backgroundColor: coupon.active ? "#28a745" : "#dc3545",
                            color: "#fff",
                            padding: "6px 12px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {coupon.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-center" style={{ padding: "10px" }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => toggleCouponStatus(coupon._id, coupon.active)}
                          style={{
                            borderRadius: "20px",
                            padding: "5px 15px",
                            marginRight: "5px",
                            color: coupon.active ? "#dc3545" : "#28a745",
                            borderColor: coupon.active ? "#dc3545" : "#28a745",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = coupon.active ? "#dc3545" : "#28a745";
                            e.target.style.color = "#fff";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = coupon.active ? "#dc3545" : "#28a745";
                          }}
                        >
                          {coupon.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteCoupon(coupon._id)}
                          style={{ borderRadius: "20px", padding: "5px 15px" }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4" style={{ color: "#6c757d" }}>
                      No coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
        {pageCount > 1 && (
          <div className="card-footer d-flex justify-content-center py-3">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(pageCount)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
              />
            </Pagination>
          </div>
        )}
      </Card>

      {/* Add Coupon Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#0B2948", color: "#fff", borderRadius: "10px 10px 0 0" }}>
          <Modal.Title>Add New Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px" }}>
          {addError && (
            <Alert variant="danger" className="text-center">
              {addError}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#0B2948" }}>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter coupon code"
                value={newCoupon.couponCode}
                onChange={(e) => setNewCoupon({ ...newCoupon, couponCode: e.target.value })}
                style={{
                  borderRadius: "6px",
                  borderColor: "#ced4da",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
                  fontSize: "0.9rem",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: "600", color: "#0B2948" }}>Discount Rate ( টাকা )</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount rate"
                value={newCoupon.discountRate}
                onChange={(e) => setNewCoupon({ ...newCoupon, discountRate: parseInt(e.target.value) || 0 })}
                style={{
                  borderRadius: "6px",
                  borderColor: "#ced4da",
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
                  fontSize: "0.9rem",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={newCoupon.active}
                onChange={(e) => setNewCoupon({ ...newCoupon, active: e.target.checked })}
                style={{ fontWeight: "600", color: "#0B2948" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", padding: "15px 20px" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setShowAddModal(false)}
            style={{ borderRadius: "25px", padding: "8px 20px", fontSize: "0.9rem" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={addCoupon}
            style={{
              backgroundColor: "#1abc9c",
              color: "#fff",
              borderRadius: "25px",
              padding: "8px 20px",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            Add Coupon
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}