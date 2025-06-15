"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";

export interface FilterOptions {
  searchTerm: string;
  selectedCategory: string;
  priceRange: {
    min: number;
    max: number;
  };
  stockFilter: "all" | "in-stock" | "out-of-stock";
}

interface ProductFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  onClearFilters: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  onClearFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      selectedCategory: e.target.value,
    });
  };

  const handleStockFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      stockFilter: e.target.value as "all" | "in-stock" | "out-of-stock",
    });
  };

  const handlePriceRangeChange = (
    type: "min" | "max",
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: numValue,
      },
    });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.selectedCategory ||
    filters.stockFilter !== "all" ||
    filters.priceRange.min > priceRange.min ||
    filters.priceRange.max < priceRange.max;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center justify-between mb-3">
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.selectedCategory}
            onChange={handleCategoryChange}
            title="Filter by category"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Stock Status
          </label>
          <select
            value={filters.stockFilter}
            onChange={handleStockFilterChange}
            title="Filter by stock status"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">All Products</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Price Range (₿)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange.min || ""}
              onChange={(e) => handlePriceRangeChange("min", e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange.max || ""}
              onChange={(e) => handlePriceRangeChange("max", e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 text-teal-800">
                Search: "{filters.searchTerm}"
              </span>
            )}
            {filters.selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                Category: {filters.selectedCategory}
              </span>
            )}
            {filters.stockFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                Stock: {filters.stockFilter === "in-stock" ? "In Stock" : "Out of Stock"}
              </span>
            )}
            {(filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Price: ₿{filters.priceRange.min} - ₿{filters.priceRange.max}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter; 