import React, { useState } from "react";

export default function Auth({ setAuthState }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const validUsername = "admin@aihomesd.com";
    const validPassword = "12345678";

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedUsername === validUsername &&
      trimmedPassword === validPassword
    ) {
      document.cookie = `authToken=${trimmedUsername}`;
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
        backgroundColor: "#f7f8fa", // Light background for a cleaner look
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          border: "none",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Softer shadow for depth
          backgroundColor: "#ffffff", // White card for modern feel
        }}
      >
        <div
          style={{
            fontSize: "26px",
            fontWeight: "600",
            marginBottom: "25px",
            textAlign: "center",
            color: "#333333", // Darker text for contrast
          }}
        >
          Admin Login
        </div>
        <div style={{ marginBottom: "25px" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#666666",
                }}
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
                  height: "42px",
                  padding: "10px",
                  fontSize: "15px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#666666",
                }}
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
                  height: "42px",
                  padding: "10px",
                  fontSize: "15px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
            </div>
            {error && (
              <div
                style={{
                  color: "red",
                  marginBottom: "20px",
                  textAlign: "center",
                  fontWeight: "500",
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
                height: "42px",
                fontSize: "16px",
                borderRadius: "6px",
                backgroundColor: "#007bff", // Blue color for primary button
                borderColor: "#007bff",
                color: "#ffffff",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
