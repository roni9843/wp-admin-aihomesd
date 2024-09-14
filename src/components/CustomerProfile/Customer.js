import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

export default function Customer() {
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

  return (
    <Container style={{ padding: "20px" }}>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead className="table-primary ">
              <tr>
                <th>Username</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((user) => (
                <tr
                  key={user._id}
                  style={{
                    backgroundColor: "#fafafa", // Light grey for odd rows
                  }}
                >
                  <td>{user.username}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
