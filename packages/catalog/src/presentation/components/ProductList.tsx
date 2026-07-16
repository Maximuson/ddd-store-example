import { Product } from '../../domain/entities/Product';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.getId()}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <img
        src={product.getImage()}
        alt={product.getTitle()}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className="text-xs font-medium text-blue-600 uppercase">{product.getCategory()}</span>
        <h3 className="text-lg font-semibold text-gray-900 mt-1">{product.getTitle()}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.getDescription()}</p>
        <p className="text-xl font-bold text-gray-900 mt-2">{product.getPrice().format()}</p>
      </div>
    </Link>
  );
}

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductList({ products, isLoading }: ProductListProps) {
  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">No products found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.getId()} product={product} />
      ))}
    </div>
  );
}
