'use client';

import { useState, useMemo } from 'react';
import { useCart } from '../../context/Cart';

const Summary = () => {
  const { state, getDiscountAmount, calculateDiscountedPrice } = useCart();
  const [billDiscountValue, setBillDiscountValue] = useState<string>('');
  const [billDiscountType, setBillDiscountType] = useState<'baht' | 'percent'>('baht');

  const calculations = useMemo(() => {
    const regularItems = state.items;
    const backOrderItems = state.backOrderItems;

    let regularSubtotal = 0;
    const regularItemSummaries: Array<{
      name: string;
      quantity: number;
      originalPrice: number;
      discountAmount: number;
      finalPrice: number;
    }> = [];

    regularItems.forEach(item => {
      const originalItemTotal = item.price * item.quantity;
      const discountAmount = getDiscountAmount(item.price, item.quantity, item.id);
      const finalItemPrice = calculateDiscountedPrice(item.price, item.quantity, item.id);
      
      regularSubtotal += finalItemPrice;
      
      regularItemSummaries.push({
        name: item.name,
        quantity: item.quantity,
        originalPrice: originalItemTotal,
        discountAmount: discountAmount,
        finalPrice: finalItemPrice
      });
    });

    const backOrderSubtotal = state.backOrderTotalAmount;
    const backOrderItemSummaries: Array<{
      name: string;
      quantity: number;
      originalPrice: number;
      discountAmount: number;
      finalPrice: number;
    }> = [];

    backOrderItems.forEach(item => {
      const originalItemTotal = item.price * item.quantity;
      const discountAmount = 0;
      const finalItemPrice = originalItemTotal - discountAmount;
      
      backOrderItemSummaries.push({
        name: item.name,
        quantity: item.quantity,
        originalPrice: originalItemTotal,
        discountAmount: discountAmount,
        finalPrice: finalItemPrice
      });
    });

    const vat = regularSubtotal * 0.07;
    
    const totalBeforeBillDiscount = regularSubtotal + vat;
    
    let billDiscountAmount = 0;
    const billDiscountNum = parseFloat(billDiscountValue) || 0;
    
    if (billDiscountNum > 0) {
      if (billDiscountType === 'percent') {
        billDiscountAmount = Math.min(totalBeforeBillDiscount * (billDiscountNum / 100), totalBeforeBillDiscount);
      } else {
        billDiscountAmount = Math.min(billDiscountNum, totalBeforeBillDiscount);
      }
    }
    
    const regularFinalTotal = totalBeforeBillDiscount - billDiscountAmount;
    const grandTotal = regularFinalTotal + backOrderSubtotal;
    
    return {
      regularItemSummaries,
      backOrderItemSummaries,
      regularSubtotal,
      backOrderSubtotal,
      vat,
      totalBeforeBillDiscount,
      billDiscountAmount,
      regularFinalTotal: Math.max(0, regularFinalTotal),
      grandTotal: Math.max(0, grandTotal),
      hasRegularItems: regularItems.length > 0,
      hasBackOrderItems: backOrderItems.length > 0
    };
  }, [state.items, state.backOrderItems, state.backOrderTotalAmount, state.discounts, billDiscountValue, billDiscountType, getDiscountAmount, calculateDiscountedPrice]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleBillDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBillDiscountValue(value);
    }
  };

  if (state.items.length === 0 && state.backOrderItems.length === 0) {
    return (
      <div className="h-[300px] flex flex-col justify-center items-center p-4 bg-white border-t border-gray-200">
        <div className="text-gray-500 text-center">
          <p>ไม่มีสินค้าในตะกร้า</p>
          <p className="text-sm mt-1">กรุณาเลือกสินค้าเพื่อดำเนินการ</p>
        </div>
      </div>
    );
  }



  return (
    <div className="h-[450px] flex flex-col justify-between p-4 bg-white border-t border-gray-200 overflow-y-auto">
      <div className="space-y-4">
        {calculations.hasRegularItems && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800">สินค้าซื้อปกติ</h3>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              {calculations.regularItemSummaries.some(item => item.discountAmount > 0) && (
                <div className="space-y-1 mb-2">
                  <div className="text-xs text-gray-600 font-medium">ส่วนลดรายสินค้า:</div>
                  {calculations.regularItemSummaries.map((item, index) => (
                    item.discountAmount > 0 && (
                      <div key={index} className="text-xs flex justify-between text-gray-600">
                        <span className="truncate mr-2">{item.name} (x{item.quantity})</span>
                        <span className="text-red-600">-฿{formatCurrency(item.discountAmount)}</span>
                      </div>
                    )
                  ))}
                  <div className="border-t border-blue-200 pt-1 mt-1">
                    <div className="text-xs flex justify-between font-medium">
                      <span className="text-gray-700">รวมส่วนลดสินค้า:</span>
                      <span className="text-red-600">-฿{formatCurrency(calculations.regularItemSummaries.reduce((sum, item) => sum + item.discountAmount, 0))}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-700">ยอดรวมสินค้า (หลังหักส่วนลด)</span>
                <span className="font-medium">฿{formatCurrency(calculations.regularSubtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">VAT 7%</span>
                <span className="font-medium">฿{formatCurrency(calculations.vat)}</span>
              </div>
              
              <div className="flex justify-between text-sm font-medium border-t border-blue-200 pt-2">
                <span className="text-gray-800">ยอดรวม + VAT</span>
                <span className="text-gray-800">฿{formatCurrency(calculations.totalBeforeBillDiscount)}</span>
              </div>

              <div className="border-t border-blue-200 pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700">ส่วนลดท้ายบิล</span>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      className="w-16 h-7 border rounded px-2 text-xs text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      value={billDiscountValue}
                      onChange={handleBillDiscountChange}
                    />
                    <select 
                      className="h-7 border rounded px-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      aria-label="Bill Discount Type"
                      value={billDiscountType}
                      onChange={(e) => setBillDiscountType(e.target.value as 'baht' | 'percent')}
                    >
                      <option value="baht">฿</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>
                
                {calculations.billDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-600 mb-2">
                    <span>ส่วนลดท้ายบิล</span>
                    <span>-฿{formatCurrency(calculations.billDiscountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-semibold border-t border-blue-200 pt-2">
                  <span className="text-blue-800">ยอดชำระสินค้าปกติ</span>
                  <span className="text-blue-800">฿{formatCurrency(calculations.regularFinalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {calculations.hasBackOrderItems && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-gray-800">สินค้าส่งตามทีหลัง</h3>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">ยอดรวมสินค้า</span>
                <span className="font-medium">฿{formatCurrency(calculations.backOrderSubtotal)}</span>
              </div>
              
              <div className="text-xs text-orange-600 italic">
                * สินค้าส่งตามทีหลังไม่รวม VAT และส่วนลดท้ายบิล
              </div>
              
              <div className="flex justify-between text-sm font-semibold border-t border-orange-200 pt-2">
                <span className="text-orange-800">ยอดสินค้าส่งตามทีหลัง</span>
                <span className="text-orange-800">฿{formatCurrency(calculations.backOrderSubtotal)}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="border-t-2 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">ยอดรวมทั้งหมด</span>
            <span className="text-xl font-bold text-green-600">฿{formatCurrency(calculations.grandTotal)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            รวม VAT และส่วนลดทั้งหมดแล้ว
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
          เคลียร์ตะกร้า
        </button>
        <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          ชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default Summary;