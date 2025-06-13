import Button from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">W</h1>
          <h2 className="text-3xl font-bold">Welcome to W</h2>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            W POS is a point of sale system for your business.
          </p>
        </div>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    </div>
  );
}
