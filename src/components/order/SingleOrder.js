import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useLayoutEffect, useState } from "react";

export default function SingleOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState({});
  const [status, setStatus] = useState("");

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
      setStatus(data[0].status); // Set the initial status
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
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

      callProduct();

      alert("Order status updated successfully");
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
    }
  };

  if (Object.keys(order).length === 0) {
    return (
      <div>
        <p>No order available</p>
      </div>
    );
  }

  return (
    <div className="container pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span>
            Order # <b>{order.orderId}</b>{" "}
          </span>{" "}
        </div>
        <button className="btn btn-primary">Invoice</button>
      </div>
      <div className="row">
        <div className="col-12 col-md-8 ">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              Product Details
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead className="thead-primary">
                    <tr className=" table-primary">
                      <th className="text-center">Image</th>
                      <th className="text-center">Product Name</th>
                      <th className="text-center">Item Price</th>
                      <th className="text-center">Qty</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.productName}
                            className="img-fluid"
                            style={{ maxWidth: "50px" }}
                          />
                        </td>
                        <td className="text-center">
                          {item.product.productName}
                        </td>
                        <td className="text-center">
                          {console.log("this is ", item)}
                          {item.price}
                        </td>

                        <td className="text-center">{item.qty}</td>
                        <td className="text-center">{item.qty * item.price}</td>
                        <td className="text-center">
                        <button className="btn btn-warning btn-sm">
                        <a 
                          href={`https://aihomesd.com/product/${item.product._id}`} // Corrected with curly braces
                          target="_blank" 
                          rel="noopener noreferrer" // Improves security by preventing access to the window object
                          style={{ textDecoration: 'none', color: 'inherit' }} // Optional: Ensures link text inherits styles from button
                        >
                          Visit
                        </a>  
                      </button>
                      
                        </td>
                      </tr>
                    ))}
                    <tr className="font-weight-bold ">
                      <td colSpan="4" className="text-center">
                        <b> Total</b>
                      </td>
                      <td className="text-center">
                        {" "}
                        <b> {order?.totalAmount}</b>
                      </td>
                      <td className="text-center"></td>
                    </tr>

                    {
                    order?.couponAmount &&     <tr className="font-weight-bold ">
                      <td colSpan="4" className="text-center">
                        <b>Coupon ( { order?.couponCode } ) </b>
                      </td>
                      <td className="text-center">
                        {" "}
                        <b> -{order?.couponAmount  }</b>
                      </td>
                      <td className="text-center"></td>
                    </tr>
                    }

                
                    <tr className="font-weight-bold">
                      <td colSpan="4" className="text-center">
                        <b> Shipping cost ( { order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে" } )</b>
                      </td>
                      <td className="text-center">
                        {" "}
                        <b> {order?.shippingCost}</b>
                      </td>
                      <td className="text-center"></td>
                    </tr>
                    <tr className="font-weight-bold table-info">
                      <td colSpan="4" className="text-center">
                        <b> Grand Total</b>
                      </td>
                      <td className="text-center">
                        {" "}
                        <b> {order?.totalAmount}</b>
                      </td>
                      <td className="text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 ">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              Logistics Details
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Order Date</th>
                    <td>
                      <span>{ new Date(order.orderDate).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                      }) }</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Payment</th>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value="Cash on Delivery"
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                  <th scope="row">Shipping Place</th>
                  <td>
                    <span>{order.shippingState === "shippingOutsideDhaka" ? "ঢাকার বাহিরে" : "ঢাকার মধ্যে"}</span>
                  </td>
                </tr>
                  <tr>
                    <th scope="row">Order Status</th>
                    <td>
                      <select
                        className="form-select"
                        aria-label="Order Status"
                        value={status}
                        onChange={handleStatusChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              Customer Details
            </div>
            <div className="card-body">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th scope="row">Name</th>
                    <td>{order.name}</td>
                  </tr>
                  
                  <tr>
                    <th scope="row">Phone Number</th>
                    <td>{order.phoneNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>{order.address}</td>
                  </tr>
                  <tr>
                    <th scope="row">Thana District</th>
                    <td>{order.thanaDistrict}</td>
                  </tr>
                  <tr>
                    <th scope="row">Order Notes</th>
                    <td>{order.orderNotes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
