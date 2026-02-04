//* 給 Links，Redirect 和 Button 等用的
export const PATHS = {
  STORE: "/",
  LIBRARY: "/library",
  PROFILE: "/profile",
  WISHLIST: "/wishlist",
  CART: "/cart",
  LOGIN: "/login",
  REGISTER: "/register",
  DETAILS: "/games",
  CHECKOUT: "/checkout",
  PAYMENT_SUCCESS: "/cart/payment-success",
  TOP_UP: "/profile/top_up",
  HISTORY: "/profile/history",
};

//* 定義需要什麽變量信息
export interface RouteConfig {
  path: string;
  name: string;
}

//* 主要的 Routes 處理
export const ROUTES: RouteConfig[] = [
  {
    path: PATHS.STORE,
    name: "Store",
  },
  {
    path: PATHS.LIBRARY,
    name: "Library",
  },
  {
    path: PATHS.PROFILE,
    name: "Profile",
  },
  {
    path: PATHS.WISHLIST,
    name: "Wishlist",
  },
  {
    path: PATHS.CART,
    name: "Cart",
  },
  {
    path: PATHS.LOGIN,
    name: "Login",
  },
  {
    path: PATHS.REGISTER,
    name: "Register",
  },
  {
    path: PATHS.DETAILS,
    name: "Details",
  },
  {
    path: PATHS.CHECKOUT,
    name: "Checkout",
  },
  {
    path: PATHS.PAYMENT_SUCCESS,
    name: "Payment Success",
  },
  {
    path: PATHS.TOP_UP,
    name: "Top Up",
  },
  {
    path: PATHS.HISTORY,
    name: "History",
  },
];
