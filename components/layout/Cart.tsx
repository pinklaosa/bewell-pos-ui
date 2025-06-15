import ShoppingCart from "../feature/ShoppingCart";
import Summary from "./Summary";

const Cart = () => {
  return (
    <div className="flex flex-col h-full min-h-screen md:min-h-0 bg-white">
      
      
      <div className="flex-1 overflow-y-auto p-4 min-h-[60%] md:min-h-[60%]">
        <ShoppingCart />
      </div>
      
      <div className="flex-shrink-0 border-t bg-gray-50">
        <Summary />
      </div>
    </div>
  );
};

export default Cart;