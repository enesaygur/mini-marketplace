import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
