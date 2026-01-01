import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getSizes } from '../services/api';
import { useCart } from '../hooks/useCart';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, sizesData] = await Promise.all([
          getProduct(Number(id)),
          getSizes(),
        ]);
        setProduct(productData);
        setSizes(sizesData);
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setAddedToCart(false);
  };

  const handleSizeChange = (sizeId) => {
    setSelectedSize(sizeId);
    setAddedToCart(false);
  };

  const handlePrevImage = () => {
    if (selectedColor && selectedColor.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedColor.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedColor && selectedColor.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === selectedColor.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Пожалуйста, выберите цвет и размер');
      return;
    }

    const size = sizes.find((s) => s.id === selectedSize);
    const cartItem = {
      productId: product.id,
      productName: product.name,
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      sizeId: selectedSize,
      sizeName: size.label,
      price: selectedColor.price,
      image: selectedColor.images[0],
      description: selectedColor.description,
    };

    const added = addToCart(cartItem);
    if (added) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } else {
      alert('Этот товар уже добавлен в корзину');
    }
  };

  const isSizeAvailable = (sizeId) => {
    return selectedColor && selectedColor.sizes.includes(sizeId);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!product) {
    return <div className="error">Товар не найден</div>;
  }

  return (
    <div className="product-detail">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Назад к каталогу
      </button>

      <div className="product-detail-content">
        <div className="product-images">
          {selectedColor && selectedColor.images.length > 0 && (
            <>
              <div className="main-image">
                <img
                  src={selectedColor.images[currentImageIndex]}
                  alt={`${product.name} - ${selectedColor.name}`}
                />
              </div>
              {selectedColor.images.length > 1 && (
                <div className="image-controls">
                  <button onClick={handlePrevImage}>←</button>
                  <span>
                    {currentImageIndex + 1} / {selectedColor.images.length}
                  </span>
                  <button onClick={handleNextImage}>→</button>
                </div>
              )}
              <div className="image-thumbnails">
                {selectedColor.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className={currentImageIndex === index ? 'active' : ''}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          {selectedColor && (
            <>
              <div className="price">{selectedColor.price} ₽</div>
              <div className="description">{selectedColor.description}</div>
            </>
          )}

          <div className="product-options">
            <div className="option-group">
              <h3>Выберите цвет:</h3>
              <div className="color-options">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    className={`color-option ${
                      selectedColor?.id === color.id ? 'selected' : ''
                    }`}
                    onClick={() => handleColorChange(color)}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <h3>Выберите размер:</h3>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    className={`size-option ${
                      selectedSize === size.id ? 'selected' : ''
                    } ${!isSizeAvailable(size.id) ? 'disabled' : ''}`}
                    onClick={() =>
                      isSizeAvailable(size.id) && handleSizeChange(size.id)
                    }
                    disabled={!isSizeAvailable(size.id)}
                  >
                    {size.label} ({size.number})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`add-to-cart-button ${addedToCart ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!selectedColor || !selectedSize}
          >
            {addedToCart ? '✓ Добавлено в корзину' : 'Добавить в корзину'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
