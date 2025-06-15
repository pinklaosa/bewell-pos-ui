"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { relative } from 'path';

interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  options?: DropdownOption[];
  placeholder?: string;
  defaultValue?: DropdownOption | null;
  onChange?: (option: DropdownOption | null) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options = [],
  placeholder = "Select an option",
  defaultValue = null,
  onChange = () => {},
  className = "",
  disabled = false,
  name,
  id
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (option: DropdownOption): void => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  const displayText: string = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        name={name}
        id={id}
        className={`w-full px-3 py-2 bg-white border-2 border-gray-400 rounded-xl text-left  font-medium transition-colors duration-200 flex items-center justify-between ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <span className={selectedOption ? 'text-gray-700' : 'text-gray-400'}>
          {displayText}
        </span>
        <ChevronUp
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${disabled ? 'opacity-50' : ''}`}
        />
      </button>
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
          {options.map((option: DropdownOption, index: number) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionSelect(option)}
              className={`w-full px-4 py-3 text-left font-medium hover:bg-gray-50 transition-colors duration-150 ${
                selectedOption?.value === option.value ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
              } ${index !== options.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              {option.label}
            </button>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-3 text-gray-400 text-center">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown