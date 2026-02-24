import { createBrowserRouter } from "react-router-dom";

import AdminRoute from "@/routes/AdminRoute";
import PrivateRoute from "@/routes/PrivateRoute";
import AdminLayout from "@/layouts/AdminLayout";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminOrderDetail from "@/pages/admin/OrderDetail";
import AdminOrders from "@/pages/admin/Orders";
import ProductForm from "@/pages/admin/ProductForm";
import AdminProducts from "@/pages/admin/Products";
import Brands from "@/pages/admin/Brands";
import Categories from "@/pages/admin/Categories";
import Reviews from "@/pages/admin/Reviews";
import Users from "@/pages/admin/Users";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OrderDetail from "@/pages/OrderDetail";
import OrderSuccess from "@/pages/OrderSuccess";
import Orders from "@/pages/Orders";
import ProductDetail from "@/pages/ProductDetail";
import Products from "@/pages/Products";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import Support from "@/pages/Support";
import Wishlist from "@/pages/Wishlist";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:slug", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "support", element: <Support /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "checkout", element: <Checkout /> },
          { path: "order/success", element: <OrderSuccess /> },
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <Orders /> },
          { path: "orders/:id", element: <OrderDetail /> },
          { path: "wishlist", element: <Wishlist /> },
        ],
      },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password/:token?", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "products", element: <AdminProducts /> },
          { path: "products/new", element: <ProductForm /> },
          { path: "products/:id/edit", element: <ProductForm /> },
          { path: "categories", element: <Categories /> },
          { path: "brands", element: <Brands /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "orders/:id", element: <AdminOrderDetail /> },
          { path: "users", element: <Users /> },
          { path: "reviews", element: <Reviews /> },
        ],
      },
    ],
  },
]);

export default router;
