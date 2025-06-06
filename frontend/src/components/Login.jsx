import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  TextField,
  Button,
  Container,
  Link,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import logo from "../assets/logo.PNG";

const Login = () => {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    password: "",
  });

  const [errMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!formData.employeeNumber || !formData.password) {
      setErrorMessage("Please fill all asked credentials");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          const decoded = JSON.parse(atob(data.token.split(".")[1]));

          localStorage.setItem("employeeNumber", decoded.employeeNumber || data.employeeNumber || "");
          localStorage.setItem("role", decoded.role || data.role || "");

          const role = decoded.role || data.role;
          if (role === "superadmin" || role === "administrator") {
            navigate("/home");
          } else if (role === "staff") {
            navigate("/pdsfile");
          } else {
            setErrorMessage("Unauthorized role");
          }
        } else {
          setErrorMessage("No token received from the server.");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid Credentials");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        minHeight: "70vh",
        marginLeft: "-20%",
        backgroundColor: "#fff8e1",
      }}
    >
      {/* Paper component wrapping the entire login form */}
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            backgroundColor: "#A31D1D",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            py: 2,
            display: "flex",
            justifyContent: "center",
            mb: 2,
            mx: -4,
            mt: -4,
          }}
        >
          <img
            src={logo}
            alt="E.A.R.I.S.T Logo"
            style={{
              height: 80,
              borderRadius: "50%",
              backgroundColor: "white",
              padding: 4,
            }}
          />
        </Box>

        {/* Header */}
        <Typography variant="h6" gutterBottom sx={{ mt: 5}}>
          <b>Login to your Account</b>
        </Typography>

        {/* Error message alert */}
        {errMessage && (
          <Alert sx={{ mb: 2 }} severity="error">
            {errMessage}
          </Alert>
        )}

        {/* Form fields */}
        <form onSubmit={handleLogin}>
          <TextField
            name="employeeNumber"
            label="Employee Number"
            fullWidth
            sx={{ mb: 2, mt: 5 }}
            autoComplete="employeeNumber"
            onChange={handleChanges}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 1 }}
            autoComplete="current-password"
            onChange={handleChanges}
          />

          {/* Forgot password link */}
          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Link
              onClick={() => navigate("/forgot-password")}
              underline="hover"
              sx={{
                cursor: "pointer",
                color: "black",
                fontSize: "13px",
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          {/* Login button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ bgcolor: "#A31D1D", mt: 5 }}
          >
            Login
          </Button>
        </form>

   
        <Typography variant="body2" sx={{ mt: 2, fontSize: "13px" }}>
          Don’t have an account?{" "}
          <Link
            href="/register"
            underline="hover"
            sx={{
              color: "black",
              fontWeight: "bold",
              fontSize: "13px",
            }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
