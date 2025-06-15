export const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };