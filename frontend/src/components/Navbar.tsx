import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { token, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Mini Marketplace
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="text-gray-700 hover:text-blue-600">
          Sepet ({items.length})
        </Link>
        {token ? (
          <>
            <Link to="/orders" className="text-gray-700 hover:text-blue-600">
              Siparişlerim
            </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Giriş Yap
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
