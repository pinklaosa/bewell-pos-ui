"use client"

import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialValue = 1,
  min = 1,
  max = 999,
  onChange = () => {},
  disabled = false,
  className = '',
  size = 'md'
}) => {
  const [quantity, setQuantity] = useState<number>(initialValue);

  React.useEffect(() => {
    setQuantity(initialValue);
  }, [initialValue]);

  const handleDecrease = (): void => {
    if (quantity > min && !disabled) {
      const newValue = quantity - 1;
      setQuantity(newValue);
      onChange(newValue);
    }
  };

  const handleIncrease = (): void => {
    if (quantity < max && !disabled) {
      const newValue = quantity + 1;
      setQuantity(newValue);
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    setQuantity(clampedValue);
    onChange(clampedValue);
  };

  const sizeConfig = {
    sm: {
      button: 'w-8 h-10',
      input: 'w-12 h-10 text-sm',
      icon: 'w-3 h-3'
    },
    md: {
      button: 'w-12 h-12',
      input: 'w-16 h-12 text-lg',
      icon: 'w-4 h-4'
    },
    lg: {
      button: 'w-16 h-16',
      input: 'w-20 h-16 text-xl',
      icon: 'w-5 h-5'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      <button
        title="Decrease"
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className={`${config.button} bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center border-r border-gray-300`}
        style={{ borderRadius: '8px 0 0 8px' }}
      >
        <Minus
          className={`${config.icon} text-gray-600 ${disabled || quantity <= min ? 'text-gray-400' : ''}`}
          strokeWidth={3}
        />
      </button>
      <input
        id="quantity"
        name="quantity"
        title="Quantity"
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className={`${config.input} text-center font-semibold text-gray-800 bg-white border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400`}
        style={{
          appearance: 'textfield',
          MozAppearance: 'textfield'
        }}
      />
      <button
        title="Increase"
          type="button"
        onClick={handleIncrease}
        disabled={disabled || quantity >= max}
        className={`${config.button} bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center border-l border-gray-300`}
        style={{ borderRadius: '0 8px 8px 0' }}
      >
        <Plus
          className={`${config.icon} text-gray-600 ${disabled || quantity >= max ? 'text-gray-400' : ''}`}
          strokeWidth={3}
        />
      </button>
    </div>
  );
};

export default QuantitySelector