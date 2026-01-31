import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import Signup from "./pages/Signup/Signup"; 
import ProtectedRoute from "./components/ProtectedRoute";
import { TripDetail } from "./components/Trips";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        
        <Route path="/trips/:id" element={<TripDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
