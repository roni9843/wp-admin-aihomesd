import React, { useState } from "react";

export default function Auth({ setAuthState }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Hardcoded credentials
    const validUsername = "roni13647";
    const validPassword = "12345678";

    if (username === validUsername && password === validPassword) {
      // Example: Save authentication token in cookie
      document.cookie = `authToken=${username}`;

      // Example: Set authentication state to true
      setAuthState(true);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "300px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Login
        </div>
        <div style={{ marginBottom: "20px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="username"
                style={{ display: "block", marginBottom: "10px" }}
              >
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "10px" }}
              >
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "8px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            {error && (
              <div
                style={{
                  color: "red",
                  marginBottom: "20px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                height: "40px",
                fontSize: "16px",
                borderRadius: "4px",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
