import Link from "next/link";
import Image from "next/image";
import { Product } from "@/entities/product/model";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="group-hover:scale-105 transition-transform duration-300"
            priority
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discountPercentage.toFixed(0)}% OFF
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{product.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
            {product.brand}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">${discountPrice.toFixed(2)}</span>
              {product.discountPercentage > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {product.stock} 남음
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
