import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./pages/Home.jsx";
import Gigs from "./pages/Gigs.jsx";
import Gig from "./pages/Gig.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Add from "./pages/Add.jsx";
import Orders from "./pages/Orders.jsx";
import Messages from "./pages/Messages.jsx";
import Message from "./pages/Message.jsx";
import MyGigs from "./pages/MyGigs.jsx";

// 1. Initialize QueryClient outside the component
const queryClient = new QueryClient();

function App() {
  // Layout component to wrap routes with Navbar and Footer
  const Layout = () => {
    return (
      <div className="app">
        <Navbar />
        {/* Outlet renders the child route matching the current URL */}
        <Outlet />
        <Footer />
      </div>
    );
  };

  // 2. Define your routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
      ],
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  // 3. Wrap everything in QueryClientProvider
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
