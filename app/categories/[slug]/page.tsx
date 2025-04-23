import { notFound } from "next/navigation"
import { categories } from "@/lib/categories"
import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  // Get products for this category
  const categoryProducts = products.filter((product) => product.category.toLowerCase() === category.name.toLowerCase())

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <Link href="/categories" className="text-muted-foreground hover:text-foreground">
          Categories
        </Link>
        <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{category.name}</span>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <aside className="w-full md:w-64">
          <ProductFilters />
        </aside>
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          <Separator className="my-4" />

          {categoryProducts.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <h2 className="text-lg font-medium">No products found</h2>
              <p className="mt-2 text-muted-foreground">We couldn't find any products in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
