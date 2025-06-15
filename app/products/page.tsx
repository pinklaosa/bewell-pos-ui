import AppBar from "@/components/layout/AppBar";
import Cart from "@/components/layout/Cart";
import ProductList from "@/components/layout/ProductList";
import { CartProvider } from "@/context/Cart";

const ProductsPage = () => {
  return (
    <>
    <CartProvider>
      <AppBar />
      <div className="mx-auto p-5 h-[calc(100vh-64px-64px)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
              <ProductList />
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <Cart />
            </div>
          </div>
        </div>
      </div>
      </CartProvider>
    </>
  );
};

export default ProductsPage;
