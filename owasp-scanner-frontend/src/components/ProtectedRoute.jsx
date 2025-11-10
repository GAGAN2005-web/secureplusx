// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  // If not logged in, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If logged in, show the page
  return children;
};

export default ProtectedRoute;
