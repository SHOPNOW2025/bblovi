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
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ContentProvider, useContent } from "./context/ContentContext";
import { LoadingScreen } from "./components/LoadingScreen";
import { AnimatePresence, motion } from "motion/react";

const AppContent = () => {
  const { loading: authLoading } = useAuth();
  const { loading: contentLoading } = useContent();

  const isInitialLoading = authLoading || contentLoading;

  return (
    <>
      <AnimatePresence mode="wait">
        {isInitialLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
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
      </motion.div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </AuthProvider>
  );
}
