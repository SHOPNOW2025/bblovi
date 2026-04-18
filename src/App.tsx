/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Work from "./pages/Work.tsx";
import Pricing from "./pages/Pricing.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import CompanyPortal from "./pages/CompanyPortal.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="portal" element={<CompanyPortal />} />
        </Route>
      </Routes>
    </Router>
  );
}
