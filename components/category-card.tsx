import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/types/category"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-4 text-center">
          <h3 className="font-medium">{category.name}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}
