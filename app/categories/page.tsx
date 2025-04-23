import Link from "next/link"
import { categories } from "@/lib/categories"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Product Categories</h1>
        <p className="text-lg text-muted-foreground">Browse our collection by category</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`}>
            <Card className="h-full overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="flex flex-col p-6">
                <div className="mb-4 flex-1 space-y-2">
                  <h3 className="text-xl font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <Button className="w-full" variant="outline">
                  View Products
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
