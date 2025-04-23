import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"
import CategoryCard from "@/components/category-card"
import { categories } from "@/lib/categories"
import LimitedTimeDeal from "@/components/limited-time-deal"

export default function Home() {
  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4)

  // Get featured categories (first 4)
  const featuredCategories = categories.slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-black">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="z-10 max-w-lg text-center md:text-left">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                Next-Gen Tech at Your Fingertips
              </h1>
              <p className="mb-8 text-lg text-gray-300">
                Discover the latest electronics and gadgets with exclusive deals and free shipping.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link href="/deals">View Deals</Link>
                </Button>
              </div>
            </div>
            <div className="relative z-10 w-full max-w-md">
              <img
                src="/tech-display.png"
                alt="Latest Electronics"
                className="rounded-lg shadow-2xl"
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-black/70"></div>
      </section>

      {/* Featured Categories */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
            <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {featuredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Products</h2>
            <Link href="/products" className="text-sm font-medium text-primary hover:underline">
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Limited Time Deals</h2>
            <Link href="/deals" className="text-sm font-medium text-primary hover:underline">
              View all deals
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter((product) => product.discount > 0)
              .slice(0, 4)
              .map((product, index) => {
                // Create end times staggered over the next few days
                const endTime = new Date()
                endTime.setHours(endTime.getHours() + 24 * (index + 1))

                return <LimitedTimeDeal key={product.id} product={product} endTime={endTime} />
              })}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            <div className="max-w-lg text-center md:text-left">
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">Summer Sale is Live!</h2>
              <p className="mb-8 text-lg">Get up to 40% off on selected electronics. Limited time offer.</p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/deals">Shop the Sale</Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="/electronics-discount-display.png"
                alt="Summer Sale"
                className="rounded-lg shadow-lg"
                width={400}
                height={300}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-lg bg-muted p-8 shadow-md">
            <div className="text-center">
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">Stay Updated</h2>
              <p className="mb-8 text-muted-foreground">
                Subscribe to our newsletter for exclusive deals and tech news.
              </p>
              <form className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row sm:gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" className="whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
