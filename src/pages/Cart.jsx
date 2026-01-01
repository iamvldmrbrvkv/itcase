import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useCart();

  const handleRemoveItem = (productId, colorId, sizeId) => {
    removeFromCart(productId, colorId, sizeId);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Корзина</h1>
        <p>Ваша корзина пуста</p>
        <button onClick={() => navigate('/')}>Перейти к покупкам</button>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h1>Корзина ({cartItems.length})</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Продолжить покупки
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.productName} />
            </div>
            <div className="cart-item-info">
              <h3>{item.productName}</h3>
              <div className="cart-item-details">
                <span className="detail-label">Цвет:</span> {item.colorName}
              </div>
              <div className="cart-item-details">
                <span className="detail-label">Размер:</span> {item.sizeName}
              </div>
              <div className="cart-item-description">{item.description}</div>
            </div>
            <div className="cart-item-price">
              <div className="price">{item.price} ₽</div>
              <button
                className="remove-button"
                onClick={() =>
                  handleRemoveItem(item.productId, item.colorId, item.sizeId)
                }
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Всего товаров:</span>
          <span>{cartItems.length}</span>
        </div>
        <div className="summary-row total">
          <span>Итого:</span>
          <span>{getTotalPrice()} ₽</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
