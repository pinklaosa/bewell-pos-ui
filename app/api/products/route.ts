import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

interface Product {
  no: number;
  productId: string;
  productName: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export async function GET(): Promise<
  NextResponse<Product[] | { error: string }>
> {
  try {
    const filePath = path.join(process.cwd(), "data", "bewell-product.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const products = JSON.parse(fileContents);
    return NextResponse.json(products.productList as Product[]);
  } catch (error) {
    console.error("Error reading products file:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}
