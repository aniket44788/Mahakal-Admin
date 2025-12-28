import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) {
      setError('Product ID is required.');
      setLoading(false);
      return;
    }
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/products/single/${productId}`
        );
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError('Failed to load product.');
        }
      } catch (err) {
        setError('Error fetching product. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-2xl font-medium text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl text-red-600 bg-red-50 px-8 py-6 rounded-xl">{error || 'Product not found.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Back to Products
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <img
                src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={img.url}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Price */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-bold text-green-600">₹{product.discountPrice}</span>
                    <span className="ml-2 text-xl text-gray-500 line-through">₹{product.price}</span>
                    <span className="ml-2 text-sm font-medium text-green-600">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>Quantity: {product.quantity} {product.unit}</span>
                {product.isAvailable ? (
                  <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">In Stock</span>
                ) : (
                  <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  ({product.rating.average} rating from {product.rating.count} reviews)
                </span>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mr-2">
                {product.category}
              </span>
              {product.material && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mr-2">
                  {product.material}
                </span>
              )}
              {product.deity && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-2">
                  {product.deity}
                </span>
              )}
              {product.occasion && (
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {product.occasion}
                </span>
              )}
            </div>

            {/* Additional Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
              {product.size && <div><span className="font-medium">Size:</span> {product.size}</div>}
              {product.weight && <div><span className="font-medium">Weight:</span> {product.weight}g</div>}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 font-semibold">
                Add to Cart
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-semibold">
                Buy Now
              </button>
            </div>

            {/* Dates */}
            <div className="mt-6 pt-4 border-t text-xs text-gray-500">
              <p>Added on: {formatDate(product.createdAt)}</p>
              <p>Last updated: {formatDate(product.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;