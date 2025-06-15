"use client"

import React, { useState } from "react"
import { X } from "lucide-react"
import QuantitySelector from "../ui/QuantitySelector"
import { useCart } from "../../context/Cart"

interface BackOrderModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    category?: string
    description?: string
    stock?: number
  } | null
}

const BackOrderModal: React.FC<BackOrderModalProps> = ({
  isOpen,
  onClose,
  item
}) => {
  const { addBackOrderItem, getTotalItemQuantity, getAvailableStock } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [availableStock, setAvailableStock] = useState(0)
  const [currentlyUsed, setCurrentlyUsed] = useState(0)

  React.useEffect(() => {
    if (item) {
      const totalUsed = getTotalItemQuantity(item.id)
      const available = getAvailableStock(item.id, item.stock || 0)
      
      setCurrentlyUsed(totalUsed)
      setAvailableStock(available)
      setQuantity(Math.min(item.quantity || 1, available))
    }
  }, [item, getTotalItemQuantity, getAvailableStock])

  if (!isOpen || !item) return null

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("th-TH").format(price)
  }

  const handleConfirm = () => {
    if (item && quantity > 0 && quantity <= availableStock) {
      addBackOrderItem({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock || 0,
        image: item.image,
        category: item.category,
        description: item.description
      }, quantity)
    }
    onClose()
  }

  const handleClose = () => {
    setQuantity(1)
    onClose()
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.min(newQuantity, availableStock))
  }

  return (
    <div className="relative">
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">ยืนยันสั่งตามหลัง</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="ปิด"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-[100px] h-[80px] bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
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

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-800 mb-2 leading-tight">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{item.id}</p>
              {item.category && (
                <p className="text-xs text-gray-400 mb-2">{item.category}</p>
              )}
              <div className="text-lg font-semibold text-gray-800 mb-2">
                ฿ {formatPrice(item.price)}
              </div>
              
              <div className="text-xs space-y-1 mb-3">
                <div className="flex justify-between text-gray-600">
                  <span>สต็อกทั้งหมด:</span>
                  <span>{item.stock || 0} ชิ้น</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ใช้ไปแล้ว:</span>
                  <span>{currentlyUsed} ชิ้น</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className={availableStock > 0 ? 'text-green-600' : 'text-red-600'}>
                    สามารถสั่งได้:
                  </span>
                  <span className={availableStock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {availableStock} ชิ้น
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">จำนวนที่ต้องการสั่งตามหลัง:</label>
                  <QuantitySelector 
                    size="md"
                    initialValue={quantity}
                    onChange={handleQuantityChange}
                    max={availableStock}
                  />
                </div>
                
                <div className="text-sm text-gray-500 bg-orange-50 p-2 rounded">
                  <p>• สินค้าส่งตามทีหลังจะไม่รวม VAT</p>
                  <p>• ไม่ได้รับส่วนลดท้ายบิล</p>
                  <p>• สามารถมีรายการซ้ำกับสินค้าปกติได้</p>
                  {availableStock === 0 && (
                    <p className="text-red-600 font-medium mt-1">⚠️ สินค้าหมดแล้ว ไม่สามารถสั่งเพิ่มได้</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            disabled={quantity <= 0 || availableStock <= 0}
            className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {availableStock > 0 ? 'ยืนยันสั่งตามหลัง' : 'สินค้าหมด'}
          </button>
        </div>
      </div>
    </div>
    <div className="absolute w-full h-full bg-gray-900 bg-opacity-50 backdrop-blur-sm z-40"></div>
    </div>
  )
}

export default BackOrderModal 