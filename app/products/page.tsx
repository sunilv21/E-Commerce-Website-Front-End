import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Separator } from "@/components/ui/separator"

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        <aside className="w-full md:w-64 md:flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters />
          </div>
        </aside>
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">All Products</h1>
            <p className="text-lg text-muted-foreground">Browse our collection of high-quality electronics</p>
          </div>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
