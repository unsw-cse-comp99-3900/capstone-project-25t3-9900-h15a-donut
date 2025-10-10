import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Page/Loginpage";
import SignupPage from "./Page/Signuppage";

import App from "./App";
import "./index.css";
import Dashboard from "./Page/Dashborad";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/signup", element: <SignupPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
