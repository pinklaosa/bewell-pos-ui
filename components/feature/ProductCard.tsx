"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
  
type Product = {
  no: number;
  productId: string;
  productName: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
};

interface ProductCardProps {
  product: Product;
  currency?: string;
  onClick?: (product: Product) => void;
}

const ProductCard = ({
  product,
  currency = "₿",
  onClick = () => {},
}: ProductCardProps) => {
  return (
    product && (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full h-full flex flex-col">
        <div className="relative flex-[0.6] p-2 md:p-3 flex items-center justify-center bg-gray-50">
          {product.imageUrl ? (
            <>
              <img
                src={product.imageUrl}
                alt={product.productName}
                className={`w-[320px] h-full object-cover rounded-lg ${
                  product.stock === 0 ? 'opacity-40 grayscale' : ''
                }`}
                aria-label="Product image"
              />
              {product.stock === 0 && (
                <div className="absolute inset-2 md:inset-3 flex items-center justify-center">
                  <span className="text-red-600 text-xs md:text-sm font-bold bg-red-100 border-2 border-red-300 px-3 py-1.5 rounded-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full relative">
              <div className="w-full h-full border-2 border-gray-400 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gray-400 origin-top-left transform rotate-42"
                  aria-label="No image"
                ></div>
                <div
                  className="absolute top-0 right-0 w-full h-0.5 bg-gray-400 origin-top-right transform -rotate-42"
                  aria-label="No image"
                ></div>
              </div>
              {product.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-600 text-xs md:text-sm font-bold bg-red-100 border-2 border-red-300 px-3 py-1.5 rounded-lg shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          )}
          
          <button
            className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 md:w-8 md:h-8 flex justify-center items-center bg-white p-1 md:p-1.5 rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
            onClick={() => onClick(product)}
            aria-label="Add to cart"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex-[0.4] flex flex-col justify-between p-2 md:p-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-xs md:text-sm font-semibold text-[#3D3D3D] leading-tight line-clamp-2">
              {product.productName}
            </h3>
            <p className="text-xs text-[#425466] truncate">
              {product.productId}
            </p>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-[#E5E7EB] text-[#3D3D3D] text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full font-medium">
                {product.category}
              </span>
              <span className="text-xs text-gray-500">
                Stock: {product.stock}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm md:text-base font-bold text-[#3D3D3D]">
                {currency}{formatPrice(String(product.price))}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
