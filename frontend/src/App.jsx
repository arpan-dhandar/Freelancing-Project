import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import AddGig from "./pages/AddGig";
import Orders from "./pages/Orders";
import Messages from "./pages/Message.jsx";
import MessageThread from "./pages/MessageThread.jsx";
import Profile from "./pages/Profile";
import { Login, Register } from "./pages/Auth";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gigs" element={<Gigs />} />
            <Route path="/gig/:id" element={<GigDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />

            <Route
              path="/add-gig"
              element={
                <ProtectedRoute>
                  <AddGig />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:id"
              element={
                <ProtectedRoute>
                  <MessageThread />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AnimatePresence>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#FFFFFF",
              color: "#111111",
              border: "1px solid #E4E4E4",
              borderRadius: "14px",
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: "13px",
              fontWeight: "500",
              padding: "12px 16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#FFFFFF" },
            },
            error: { iconTheme: { primary: "#FF2D2D", secondary: "#FFFFFF" } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
