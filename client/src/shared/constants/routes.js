/** Application route paths — single source of truth */
export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (slug) => `/products/${slug}`,
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDER_SUCCESS: "/order/success",
  ORDERS: "/orders",
  ORDER_DETAIL: (id) => `/orders/${id}`,
  PROFILE: "/profile",
  WISHLIST: "/wishlist",
  SUPPORT: "/support",

  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Admin
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_NEW: "/admin/products/new",
  ADMIN_PRODUCT_EDIT: (id) => `/admin/products/${id}/edit`,
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_BRANDS: "/admin/brands",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_DETAIL: (id) => `/admin/orders/${id}`,
  ADMIN_USERS: "/admin/users",
  ADMIN_REVIEWS: "/admin/reviews",
};
