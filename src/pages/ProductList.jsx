import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  return (
    <div className="product-list">
      <h1>Каталог товаров</h1>
      <div className="products-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="product-card"
          >
            <div className="product-image">
              <img
                src={product.colors[0].images[0]}
                alt={product.name}
              />
            </div>
            <h3>{product.name}</h3>
            <div className="product-colors">
              {product.colors.length} {product.colors.length === 1 ? 'цвет' : 'цвета'}
            </div>
            <div className="product-price">
              от {product.colors[0].price} ₽
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
