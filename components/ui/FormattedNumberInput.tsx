import React, { useState, useEffect, useRef } from 'react';

interface FormattedNumberInputProps {
  value?: number | null;
  placeholder?: string;
  onChange?: (value: number | null) => void;
  onBlur?: (value: number | null) => void;
  onFocus?: () => void;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  allowNegative?: boolean;
  prefix?: string;
  suffix?: string;
  id?: string;
  name?: string;
  autoFocus?: boolean;
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value = null,
  placeholder = "0.00",
  onChange = () => {},
  onBlur = () => {},
  onFocus = () => {},
  disabled = false,
  className = "",
  min,
  max,
  decimalPlaces = 2,
  allowNegative = false,
  prefix = "",
  suffix = "",
  id,
  name,
  autoFocus = false
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatNumber = (num: number | null): string => {
    if (num === null || num === undefined || isNaN(num)) return "";

    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(num);

    return `${prefix}${formatted}${suffix}`;
  };

  const parseNumber = (str: string): number | null => {
    if (!str) return null;
    const cleanStr = str.replace(prefix, '').replace(suffix, '').replace(/,/g, '');
    const isNegative = cleanStr.startsWith('-');
    if (isNegative && !allowNegative) return null;

    const num = parseFloat(cleanStr);
    return isNaN(num) ? null : num;
  };

  const validateNumber = (num: number | null): number | null => {
    if (num === null) return null;

    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;

    return num;
  };

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused, decimalPlaces, prefix, suffix]);

  const handleFocus = (): void => {
    setIsFocused(true);
    if (value !== null && value !== undefined) {
      setDisplayValue(value.toString());
    }
    onFocus();
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    const parsedValue = parseNumber(displayValue);
    const validatedValue = validateNumber(parsedValue);

    setDisplayValue(formatNumber(validatedValue));

    onChange(validatedValue);
    onBlur(validatedValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    if (isFocused) {
      const parsedValue = parseNumber(inputValue);
      const validatedValue = validateNumber(parsedValue);
      onChange(validatedValue);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const char = e.key;
    const currentValue = displayValue;
    if (e.ctrlKey || e.metaKey || ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(char)) {
      return;
    }

    if (/^\d$/.test(char)) {
      return;
    }

    if (char === '.' && decimalPlaces > 0 && !currentValue.includes('.')) {
      return;
    }

    if (char === '-' && allowNegative && currentValue.length === 0) {
      return;
    }

    e.preventDefault();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={`px-2 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-[400] focus:outline-none focus:ring-2 focus:ring-transparent focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 ${className}`}
      id={id}
      name={name}
      autoFocus={autoFocus}
    />
  );
};

export default FormattedNumberInput;