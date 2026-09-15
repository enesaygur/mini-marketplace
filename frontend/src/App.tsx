import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import OrderDetail from "./pages/OrderDetail";
import Orders from "./pages/Orders";
import CreateProduct from "./pages/CreateProduct";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";
import ProductDetail from "./pages/ProductDetail";
import { useEffect } from "react";
import { io } from "socket.io-client";
import SellerOrders from "./pages/SellerOrders";

type NewOrderData = {
  message: string;
};
function AppContent() {
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const socket = io("https://mini-marketplace-5hol.onrender.com/");

    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    socket.on("newOrder", (data: NewOrderData) => {
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/seller-orders" element={<SellerOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
