"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/feature/ProductCard";
import Pagination from "@/components/feature/Pagination";
import ProductFilter, { FilterOptions } from "@/components/feature/ProductFilter";
import { useCart } from "@/context/Cart";

type Product = {
  no: number;
  productId: string;
  productName: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
};

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const ProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    selectedCategory: "", 
    priceRange: { min: 0, max: 50000 },
    stockFilter: "all",
  });

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });


  const { categories, priceRange } = useMemo(() => {
    if (!products) return { categories: [], priceRange: { min: 0, max: 50000 } };

    const uniqueCategories = [...new Set(products.map(p => p.category))];
    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      categories: uniqueCategories,
      priceRange: { min: minPrice, max: maxPrice },
    };
  }, [products]);

  useEffect(() => {
    if (products && filters.priceRange.min === 0 && filters.priceRange.max === 50000) {
      setFilters(prev => ({
        ...prev,
        priceRange: priceRange,
      }));
    }
  }, [products, priceRange, filters.priceRange.min, filters.priceRange.max]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const matchesName = product.productName.toLowerCase().includes(searchTerm);
        const matchesId = product.productId.toLowerCase().includes(searchTerm);
        if (!matchesName && !matchesId) return false;
      }

      if (filters.selectedCategory && product.category !== filters.selectedCategory) {
        return false;
      }

      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }

      if (filters.stockFilter === "in-stock" && product.stock === 0) {
        return false;
      }
      if (filters.stockFilter === "out-of-stock" && product.stock > 0) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, filters]);

  const { addItem } = useCart();

  const handleAddToCart = (product: Product) => {
    const cartProduct = {
      id: product.productId,
      name: product.productName,
      price: product.price,
      image: product.imageUrl,
      category: product.category,
      stock: product.stock,
    };
    
    addItem(cartProduct);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedCategory: "",
      priceRange: priceRange,
      stockFilter: "all",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500">No products found</div>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <ProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          categories={categories}
          priceRange={priceRange}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {currentProducts.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="text-gray-500 text-lg mb-2">No products match your filters</div>
                <button
                  onClick={handleClearFilters}
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-2 gap-4 md:gap-6 h-full">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onClick={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
            totalItems={filteredProducts.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
