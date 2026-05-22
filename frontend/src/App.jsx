import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import CitizenPortal from "./pages/CitizenPortal";
import OfficerDashboard from "./pages/OfficerDashboard";
import DepartmentDirectory from "./pages/DepartmentDirectory";
import Analytics from "./pages/Analytics";
import LucknowDemo from "./pages/LucknowDemo";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-secondary">

        <Navbar />

        <main className="flex-1">

          <Routes>

            <Route
              path="/"
              element={<CitizenPortal />}
            />

            <Route
              path="/dashboard"
              element={<OfficerDashboard />}
            />

            <Route
              path="/departments"
              element={<DepartmentDirectory />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/lucknow-demo"
              element={<LucknowDemo />}
            />

          </Routes>

        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}