import AppBar from "@/components/layout/AppBar";

const ProductsPage = () => {
  return (
    <>
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Product management content will go here.</p>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;