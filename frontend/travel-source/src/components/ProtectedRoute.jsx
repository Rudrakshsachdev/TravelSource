/*
this component is used to protect routes
it checks if the user is authenticated and has the required role
if not, it redirects to the login page
*/


import { Navigate } from "react-router-dom";
import { getAuthData } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRole }) => {
    const auth = getAuthData();

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && auth.role?.toUpperCase() !== allowedRole?.toUpperCase()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
