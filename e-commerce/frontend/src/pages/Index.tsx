import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.png";

const features = [
  {
    icon: ShoppingBag,
    title: "Curated Selection",
    description: "Handpicked products that combine quality with style for everyday living.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Free delivery on orders over $50. Get your items within 2-3 business days.",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "Your data is protected with industry-standard encryption and security.",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Modern lifestyle products"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Shop Smarter, Live Better
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Discover a curated collection of premium products designed for modern living.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
