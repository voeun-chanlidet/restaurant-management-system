import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  return user ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
