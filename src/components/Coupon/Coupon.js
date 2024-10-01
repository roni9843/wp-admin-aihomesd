import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    couponCode: '',
    discountRate: 0,
    active: true,
  });
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [error, setError] = useState(null); // For storing error messages
  const [addError, setAddError] = useState(null); // For errors during add operation

  // Fetch coupons from the backend using fetch
  useEffect(() => {
    fetch('https://backend.aihomesd.com/coupons')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        return response.json();
      })
      .then((data) => {
        setCoupons(data);
        setError(null); // Clear any previous errors
      })
      .catch((error) => setError(error.message)); // Set error if fetch fails
  }, []);

  // Add new coupon using fetch
  const addCoupon = () => {
    fetch('https://backend.aihomesd.com/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCoupon),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add coupon');
        }
        return response.json();
      })
      .then((data) => {
        setCoupons([...coupons, data]);
        setShowAddModal(false); // Hide the modal
        setAddError(null); // Clear any previous add errors
      })
      .catch((error) => setAddError(error.message)); // Set error if add fails
  };

  // Update coupon status using fetch
  const toggleCouponStatus = (id, status) => {
    fetch(`https://backend.aihomesd.com/coupons/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ active: !status }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update coupon');
        }
        return response.json();
      })
      .then((updatedCoupon) => {
        const updatedCoupons = coupons.map((coupon) =>
          coupon._id === id ? updatedCoupon : coupon
        );
        setCoupons(updatedCoupons);
        setError(null); // Clear any previous errors
      })
      .catch((error) => setError(error.message)); // Set error if update fails
  };

  return (
    <div className="container mt-5">
     

      {/* Display general error message */}
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {/* Button to open add coupon modal */}
      <div className="d-flex justify-content-end mb-3 mt-5 pt-5">
        <Button
          variant="primary"
          style={{
            backgroundColor: '#007bff',
            borderRadius: '25px',
            padding: '10px 20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          onClick={() => setShowAddModal(true)}
        >
          Add New Coupon
        </Button>
      </div>

      {/* Display coupons in a table */}
      <Table
        striped
        bordered
        hover
        responsive
        className="table-sm table-striped table-hover"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <thead
          className="thead-dark"
          style={{
            backgroundColor: '#343a40',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <tr>
            <th>Coupon Code</th>
            <th>Discount Rate</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: 'center' }}>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.couponCode}</td>
              <td>{coupon.discountRate}</td>
              <td>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: coupon.active ? 'green' : 'red',
                  }}
                >
                  {coupon.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <Button
                  variant={coupon.active ? 'danger' : 'success'}
                  onClick={() => toggleCouponStatus(coupon._id, coupon.active)}
                  style={{
                    borderRadius: '20px',
                    padding: '5px 15px',
                  }}
                >
                  {coupon.active ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Coupon Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        style={{ borderRadius: '10px' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display error during coupon add */}
          {addError && (
            <Alert variant="danger" className="text-center">
              {addError}
            </Alert>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter coupon code"
                value={newCoupon.couponCode}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, couponCode: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  borderColor: '#ced4da',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Discount Rate</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount rate"
                value={newCoupon.discountRate}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, discountRate: e.target.value })
                }
                style={{
                  borderRadius: '8px',
                  borderColor: '#ced4da',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.075)',
                }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Active"
                checked={newCoupon.active}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, active: e.target.checked })
                }
                style={{ fontWeight: 'bold' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddModal(false)}
            style={{
              backgroundColor: '#6c757d',
              borderRadius: '25px',
              padding: '10px 20px',
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={addCoupon}
            style={{
              backgroundColor: '#007bff',
              borderRadius: '25px',
              padding: '10px 20px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            Add Coupon
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
