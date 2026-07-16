import { Link } from 'react-router-dom';
import type { ProductCardProps } from '@ddd-store/web-shared/catalog';

export function ProductCard({ product, href }: ProductCardProps) {
  return (
    <Link
      to={href}
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
