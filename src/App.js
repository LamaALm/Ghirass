import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import FarmerLogin from "./FarmerLogin";
import FarmerDashboard from "./FarmerDashboard";
import BuyerDashboard from "./BuyerDashboard";
import Favorites from "./Favorites";
import FarmPage from "./FarmPage";
import AdminDashboard from "./AdminDashboard";
import GovernmentDashboard from "./GovernmentDashboard";
import AdminPin from "./AdminPin";
import GovPin from "./GovPin";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/farm/:farmer" element={<FarmPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/government" element={<GovernmentDashboard />} />
        <Route path="/admin-pin" element={<AdminPin />} />
        <Route path="/gov-pin" element={<GovPin />} />

      </Routes>
    </Router>
  );
}

export default App;
