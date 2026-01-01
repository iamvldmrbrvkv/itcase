import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './Header.css';

const Header = () => {
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const cartCount = getCartItemsCount();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Магазин одежды
        </Link>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Каталог
          </Link>
          <Link
            to="/cart"
            className={`cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
          >
            Корзина
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
