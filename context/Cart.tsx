'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  backOrderItems: CartItem[];
  backOrderTotalItems: number;
  backOrderTotalAmount: number;
  discounts: Record<string, { amount: number; type: string }>;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INCREMENT_ITEM'; payload: string }
  | { type: 'DECREMENT_ITEM'; payload: string }
  | { type: 'ADD_BACK_ORDER_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_BACK_ORDER_ITEM'; payload: string }
  | { type: 'UPDATE_BACK_ORDER_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_DISCOUNT'; payload: { id: string; amount: number; type: string } };

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  backOrderItems: [],
  backOrderTotalItems: 0,
  backOrderTotalAmount: 0,
  discounts: {},
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

// Helper function to get total quantity of an item across regular and back order
const getTotalItemQuantity = (state: CartState, itemId: string): number => {
  const regularQuantity = state.items.find(item => item.id === itemId)?.quantity || 0;
  const backOrderQuantity = state.backOrderItems.find(item => item.id === itemId)?.quantity || 0;
  return regularQuantity + backOrderQuantity;
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const currentTotalQuantity = getTotalItemQuantity(state, action.payload.id);
      
      // Check if adding 1 more would exceed stock
      if (currentTotalQuantity >= action.payload.stock) {
        return state; // Don't add if stock exceeded
      }
      
      let updatedItems: CartItem[];
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        backOrderItems: state.backOrderItems,
        backOrderTotalItems: state.backOrderTotalItems,
        backOrderTotalAmount: state.backOrderTotalAmount,
        discounts: state.discounts,
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      // Also remove the item's discount when removing the item
      const updatedDiscounts = { ...state.discounts };
      delete updatedDiscounts[action.payload];
      
      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        backOrderItems: state.backOrderItems,
        backOrderTotalItems: state.backOrderTotalItems,
        backOrderTotalAmount: state.backOrderTotalAmount,
        discounts: updatedDiscounts,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const targetItem = state.items.find(item => item.id === id);
      
      if (!targetItem) return state;
      
      if (quantity <= 0) {
        const updatedItems = state.items.filter(item => item.id !== id);
        const { totalItems, totalAmount } = calculateTotals(updatedItems);
        // Also remove the item's discount when quantity becomes 0
        const updatedDiscounts = { ...state.discounts };
        delete updatedDiscounts[id];
        
        return {
          items: updatedItems,
          totalItems,
          totalAmount,
          backOrderItems: state.backOrderItems,
          backOrderTotalItems: state.backOrderTotalItems,
          backOrderTotalAmount: state.backOrderTotalAmount,
          discounts: updatedDiscounts,
        };
      }

      // Check stock limit considering back order items
      const backOrderQuantity = state.backOrderItems.find(item => item.id === id)?.quantity || 0;
      const maxAllowedQuantity = targetItem.stock - backOrderQuantity;
      const finalQuantity = Math.min(quantity, maxAllowedQuantity);

      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity: finalQuantity } : item
      );
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        backOrderItems: state.backOrderItems,
        backOrderTotalItems: state.backOrderTotalItems,
        backOrderTotalAmount: state.backOrderTotalAmount,
        discounts: state.discounts,
      };
    }

    case 'INCREMENT_ITEM': {
      const targetItem = state.items.find(item => item.id === action.payload);
      if (!targetItem) return state;
      
      const currentTotalQuantity = getTotalItemQuantity(state, action.payload);
      
      // Check if incrementing would exceed stock
      if (currentTotalQuantity >= targetItem.stock) {
        return state; // Don't increment if stock exceeded
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        backOrderItems: state.backOrderItems,
        backOrderTotalItems: state.backOrderTotalItems,
        backOrderTotalAmount: state.backOrderTotalAmount,
        discounts: state.discounts,
      };
    }

    case 'DECREMENT_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0);
      
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        totalItems,
        totalAmount,
        backOrderItems: state.backOrderItems,
        backOrderTotalItems: state.backOrderTotalItems,
        backOrderTotalAmount: state.backOrderTotalAmount,
        discounts: state.discounts,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'ADD_BACK_ORDER_ITEM': {
      const { product, quantity } = action.payload;
      const existingBackOrderItem = state.backOrderItems.find(item => item.id === product.id);
      const currentTotalQuantity = getTotalItemQuantity(state, product.id);
      
      // Check if adding this quantity would exceed stock
      const availableStock = product.stock - currentTotalQuantity;
      const quantityToAdd = Math.min(quantity, availableStock);
      
      if (quantityToAdd <= 0) {
        return state; // Don't add if no stock available
      }
      
      let updatedBackOrderItems: CartItem[];
      if (existingBackOrderItem) {
        updatedBackOrderItems = state.backOrderItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      } else {
        updatedBackOrderItems = [...state.backOrderItems, { ...product, quantity: quantityToAdd }];
      }
      
      const { totalItems: backOrderTotalItems, totalAmount: backOrderTotalAmount } = calculateTotals(updatedBackOrderItems);
      
      return {
        ...state,
        backOrderItems: updatedBackOrderItems,
        backOrderTotalItems,
        backOrderTotalAmount,
      };
    }

    case 'REMOVE_BACK_ORDER_ITEM': {
      const updatedBackOrderItems = state.backOrderItems.filter(item => item.id !== action.payload);
      const { totalItems: backOrderTotalItems, totalAmount: backOrderTotalAmount } = calculateTotals(updatedBackOrderItems);
      
      return {
        ...state,
        backOrderItems: updatedBackOrderItems,
        backOrderTotalItems,
        backOrderTotalAmount,
      };
    }

    case 'UPDATE_BACK_ORDER_QUANTITY': {
      const { id, quantity } = action.payload;
      const targetItem = state.backOrderItems.find(item => item.id === id);
      
      if (!targetItem) return state;
      
      if (quantity <= 0) {
        const updatedBackOrderItems = state.backOrderItems.filter(item => item.id !== id);
        const { totalItems: backOrderTotalItems, totalAmount: backOrderTotalAmount } = calculateTotals(updatedBackOrderItems);
        
        return {
          ...state,
          backOrderItems: updatedBackOrderItems,
          backOrderTotalItems,
          backOrderTotalAmount,
        };
      }

      // Check stock limit considering regular items
      const regularQuantity = state.items.find(item => item.id === id)?.quantity || 0;
      const maxAllowedQuantity = targetItem.stock - regularQuantity;
      const finalQuantity = Math.min(quantity, maxAllowedQuantity);

      const updatedBackOrderItems = state.backOrderItems.map(item =>
        item.id === id ? { ...item, quantity: finalQuantity } : item
      );
      const { totalItems: backOrderTotalItems, totalAmount: backOrderTotalAmount } = calculateTotals(updatedBackOrderItems);
      
      return {
        ...state,
        backOrderItems: updatedBackOrderItems,
        backOrderTotalItems,
        backOrderTotalAmount,
      };
    }

    case 'UPDATE_DISCOUNT': {
      const { id, amount, type } = action.payload;
      const updatedDiscounts = { ...state.discounts };
      
      if (amount > 0) {
        updatedDiscounts[id] = { amount, type };
      } else {
        delete updatedDiscounts[id];
      }
      
      return {
        ...state,
        discounts: updatedDiscounts,
      };
    }

    default:
      return state;
  }
};

// Context
export interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (id: string) => number;
  isInCart: (id: string) => boolean;
  addBackOrderItem: (product: Product, quantity: number) => void;
  removeBackOrderItem: (id: string) => void;
  updateBackOrderQuantity: (id: string, quantity: number) => void;
  isInBackOrder: (id: string) => boolean;
  getBackOrderQuantity: (id: string) => number;
  getTotalItemQuantity: (id: string) => number;
  getAvailableStock: (id: string, currentStock: number) => number;
  canAddToCart: (id: string, currentStock: number) => boolean;
  updateDiscount: (id: string, amount: number, type: string) => void;
  getDiscount: (id: string) => { amount: number; type: string } | null;
  calculateDiscountedPrice: (price: number, quantity: number, id: string) => number;
  getDiscountAmount: (price: number, quantity: number, id: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const incrementItem = (id: string) => {
    dispatch({ type: 'INCREMENT_ITEM', payload: id });
  };

  const decrementItem = (id: string) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemQuantity = (id: string): number => {
    const item = state.items.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const isInCart = (id: string): boolean => {
    return state.items.some(item => item.id === id);
  };

  const isInBackOrder = (id: string): boolean => {
    return state.backOrderItems.some(item => item.id === id);
  };

  const getBackOrderQuantity = (id: string): number => {
    const item = state.backOrderItems.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  const getTotalItemQuantityHelper = (id: string): number => {
    return getTotalItemQuantity(state, id);
  };

  const getAvailableStock = (id: string, currentStock: number): number => {
    const totalUsed = getTotalItemQuantity(state, id);
    return Math.max(0, currentStock - totalUsed);
  };

  const canAddToCart = (id: string, currentStock: number): boolean => {
    const totalUsed = getTotalItemQuantity(state, id);
    return totalUsed < currentStock;
  };

  const addBackOrderItem = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_BACK_ORDER_ITEM', payload: { product, quantity } });
  };

  const removeBackOrderItem = (id: string) => {
    dispatch({ type: 'REMOVE_BACK_ORDER_ITEM', payload: id });
  };

  const updateBackOrderQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_BACK_ORDER_QUANTITY', payload: { id, quantity } });
  };

  const updateDiscount = (id: string, amount: number, type: string) => {
    // Find the item to get its price and quantity for validation
    const item = state.items.find(item => item.id === id);
    if (!item) return;

    const itemTotal = item.price * item.quantity;
    let validatedAmount = amount;

    // Validate discount limits
    if (type === 'percent') {
      // Percentage cannot exceed 100%
      validatedAmount = Math.min(Math.max(0, amount), 100);
    } else {
      // Baht amount cannot exceed item total price
      validatedAmount = Math.min(Math.max(0, amount), itemTotal);
    }

    dispatch({ 
      type: 'UPDATE_DISCOUNT', 
      payload: { id, amount: validatedAmount, type } 
    });
  };

  const getDiscount = (id: string) => {
    return state.discounts[id] || null;
  };

  const calculateDiscountedPrice = (price: number, quantity: number, id: string): number => {
    const discount = state.discounts[id];
    if (!discount) return price * quantity;

    if (discount.type === "percent") {
      return (price * quantity) * (1 - discount.amount / 100);
    } else {
      return Math.max(0, (price * quantity) - discount.amount);
    }
  };

  const getDiscountAmount = (price: number, quantity: number, id: string): number => {
    const discount = state.discounts[id];
    if (!discount) return 0;

    const originalTotal = price * quantity;
    const discountedTotal = calculateDiscountedPrice(price, quantity, id);
    return originalTotal - discountedTotal;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    getItemQuantity,
    isInCart,
    addBackOrderItem,
    removeBackOrderItem,
    updateBackOrderQuantity,
    isInBackOrder,
    getBackOrderQuantity,
    getTotalItemQuantity: getTotalItemQuantityHelper,
    getAvailableStock,
    canAddToCart,
    updateDiscount,
    getDiscount,
    calculateDiscountedPrice,
    getDiscountAmount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
