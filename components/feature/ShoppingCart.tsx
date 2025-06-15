"use client"

import React, { useState } from "react"
import { Trash2 } from "lucide-react"
import Dropdown from "../ui/Dropdown"
import FormattedNumberInput from "../ui/FormattedNumberInput"
import QuantitySelector from "../ui/QuantitySelector"
import BackOrderModal from "../feature/BackOrderModal"
import { useCart } from "@/context/Cart"

interface DropdownOption {
  label: string
  value: string
}

const ShoppingCart: React.FC = () => {
  const { state, removeItem, updateQuantity, removeBackOrderItem, updateBackOrderQuantity, getTotalItemQuantity, getAvailableStock, canAddToCart, updateDiscount, getDiscount, calculateDiscountedPrice } = useCart()
  const [backOrderModal, setBackOrderModal] = useState<{ isOpen: boolean; item: any }>({
    isOpen: false,
    item: null
  })

  const dropdownOptions: DropdownOption[] = [
    { label: "บาท(฿)", value: "baht" },
    { label: "เปอร์เซ็นต์(%)", value: "percent" },
  ]



  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("th-TH").format(price)
  }

  const openBackOrderModal = (item: any) => {
    setBackOrderModal({ isOpen: true, item })
  }

  const closeBackOrderModal = () => {
    setBackOrderModal({ isOpen: false, item: null })
  }

  if (state.items.length === 0 && state.backOrderItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        ไม่มีสินค้าในตะกร้า
      </div>
    )
  }

  const renderRegularItemCard = (item: any) => {
    const availableStock = getAvailableStock(item.id, item.stock || 0)
    const isLowStock = availableStock <= 5 && availableStock > 0
    const isOutOfStock = availableStock === 0
    
    return (
      <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 h-full">
          <div className="w-full sm:w-[110px] h-[95px] sm:h-[95px] bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 relative">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-full border-2 border-gray-400">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 border-gray-400 border-l-2 transform rotate-45"></div>
                  <div className="absolute inset-0 border-gray-400 border-l-2 transform -rotate-45"></div>
                </div>
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                หมด
              </div>
            )}
            {isLowStock && (
              <div className="absolute top-1 right-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded">
                เหลือน้อย
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="mb-3">
              <h3 className="text-gray-800 font-medium text-sm sm:text-base mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-gray-500 text-xs mb-1">{item.id}</p>
              {item.category && (
                <p className="text-gray-400 text-xs mb-1">{item.category}</p>
              )}
              <div className="text-xs">
                <span className="text-gray-500">สต็อก: </span>
                <span className={`font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'}`}>
                  {item.stock || 0} ชิ้น
                </span>
                <span className="text-gray-500 ml-2">เหลือสั่งได้: </span>
                <span className={`font-medium ${availableStock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {availableStock} ชิ้น
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-lg sm:text-xl font-semibold text-[#55565A]">
                ฿ {formatPrice(calculateDiscountedPrice(item.price, item.quantity, item.id))}
              </div>
            </div>

            <div className="block sm:hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">จำนวน:</span>
                <QuantitySelector 
                  size="sm" 
                  initialValue={item.quantity}
                  max={Math.min(item.stock || 0, item.quantity + availableStock)}
                  onChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-600">ส่วนลด:</span>
                <div className="flex gap-2">
                  <Dropdown
                    className="flex-1 text-xs"
                    options={dropdownOptions}
                    defaultValue={dropdownOptions.find(opt => opt.value === (getDiscount(item.id)?.type || "baht")) || dropdownOptions[0]}
                    onChange={(selectedOption) => {
                      const currentAmount = getDiscount(item.id)?.amount || 0
                      const type = selectedOption?.value || "baht"
                      updateDiscount(item.id, currentAmount, type as string)
                    }}
                  />
                  <FormattedNumberInput
                    value={getDiscount(item.id)?.amount || 0}
                    onChange={(value) => {
                      const currentType = getDiscount(item.id)?.type || "baht"
                      updateDiscount(item.id, value || 0, currentType)
                    }}
                    className="flex-1 h-[40px] text-xs"
                    decimalPlaces={0}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 lg:gap-4 flex-wrap">
              <div className="flex items-center">
                <QuantitySelector 
                  size="sm" 
                  initialValue={item.quantity}
                  max={Math.min(item.stock || 0, item.quantity + availableStock)}
                  onChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Dropdown
                  className="w-[120px] lg:w-[150px] text-xs"
                  options={dropdownOptions}
                  defaultValue={dropdownOptions.find(opt => opt.value === (getDiscount(item.id)?.type || "baht")) || dropdownOptions[0]}
                  onChange={(selectedOption) => {
                    const currentAmount = getDiscount(item.id)?.amount || 0
                    const type = selectedOption?.value || "baht"
                    updateDiscount(item.id, currentAmount, type as string)
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <FormattedNumberInput
                  value={getDiscount(item.id)?.amount || 0}
                  onChange={(value) => {
                    const currentType = getDiscount(item.id)?.type || "baht"
                    updateDiscount(item.id, value || 0, currentType)
                  }}
                  className="w-full max-w-[80px] lg:max-w-[100px] h-[40px] text-xs"
                  decimalPlaces={0}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 sm:gap-1 w-full sm:w-auto justify-center sm:justify-center">
            <div className="flex flex-col items-center sm:items-end gap-1">
              <div className="text-xs text-gray-500 text-center sm:text-right">
                สั่งตามหลัง
              </div>
              <button
                onClick={() => openBackOrderModal(item)}
                disabled={isOutOfStock}
                className={`w-7 h-7 border-2 rounded flex items-center justify-center transition-colors ${
                  isOutOfStock 
                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                    : 'border-orange-300 bg-orange-50 hover:bg-orange-100'
                }`}
                title={isOutOfStock ? 'สินค้าหมด' : 'สั่งตามหลัง'}
              >
                <span className={`text-xs font-bold ${isOutOfStock ? 'text-gray-400' : 'text-orange-600'}`}>+</span>
              </button>
            </div>

            <div className="flex sm:flex-col gap-2 sm:gap-1">
              <button
                title="Remove"
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBackOrderItemCard = (item: any) => {
    const availableStock = getAvailableStock(item.id, item.stock || 0)
    
    return (
      <div key={`backorder-${item.id}`} className="bg-orange-50 rounded-lg border border-orange-200 p-3 sm:p-4 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 h-full">
          <div className="w-full sm:w-[110px] h-[95px] sm:h-[95px] bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-full border-2 border-gray-400">
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 border-gray-400 border-l-2 transform rotate-45"></div>
                  <div className="absolute inset-0 border-gray-400 border-l-2 transform -rotate-45"></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="mb-3">
              <h3 className="text-gray-800 font-medium text-sm sm:text-base mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-gray-500 text-xs mb-1">{item.id}</p>
              {item.category && (
                <p className="text-gray-400 text-xs mb-1">{item.category}</p>
              )}
              <div className="text-xs">
                <span className="text-gray-500">สต็อก: </span>
                <span className="font-medium text-orange-600">{item.stock || 0} ชิ้น</span>
                <span className="text-gray-500 ml-2">เหลือสั่งได้: </span>
                <span className={`font-medium ${availableStock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {availableStock} ชิ้น
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-lg sm:text-xl font-semibold text-[#55565A]">
                ฿ {formatPrice(item.price * item.quantity)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">จำนวน:</span>
                <QuantitySelector 
                  size="sm" 
                  initialValue={item.quantity}
                  max={Math.min(item.stock || 0, item.quantity + availableStock)}
                  onChange={(newQuantity) => updateBackOrderQuantity(item.id, newQuantity)}
                />
              </div>
              
              <button
                title="Remove from back order"
                onClick={() => removeBackOrderItem(item.id)}
                className="w-7 h-7 border border-orange-300 rounded flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-orange-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 bg-gray-50 space-y-4 overflow-y-auto">
      {state.items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-gray-800">สินค้าซื้อปกติ</h2>
          </div>
          {state.items.map(renderRegularItemCard)}
        </div>
      )}

      {state.backOrderItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h2 className="text-sm font-semibold text-gray-800">สินค้าส่งตามทีหลัง</h2>
          </div>
          {state.backOrderItems.map(renderBackOrderItemCard)}
        </div>
      )}

      <BackOrderModal
        isOpen={backOrderModal.isOpen}
        onClose={closeBackOrderModal}
        item={backOrderModal.item}
      />
    </div>
  )
}

export default ShoppingCart