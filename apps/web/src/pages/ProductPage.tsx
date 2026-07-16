import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useActor } from '@xstate/react';
import { createProductMachine } from '@ddd-store/catalog';
import { useContainer } from '../di/ContainerContext';

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { getProductByIdUseCase } = useContainer();
  const machine = useMemo(() => createProductMachine(getProductByIdUseCase), [getProductByIdUseCase]);
  const [state, send] = useActor(machine);

  useEffect(() => {
    if (id) send({ type: 'FETCH', id });
  }, [id, send]);

  if (state.matches('loading') || state.matches('idle')) {
    return <div className="text-center py-12 text-gray-500">Loading product...</div>;
  }

  if (state.matches('error')) {
    return (
      <div>
        <Link to="/catalog" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to catalog
        </Link>
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">{state.context.error}</div>
      </div>
    );
  }

  const product = state.context.product!;
  return (
    <div>
      <Link to="/catalog" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to catalog
      </Link>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
        <img src={product.getImage()} alt={product.getTitle()} className="w-full h-80 object-cover" />
        <div className="p-8">
          <span className="text-sm font-medium text-blue-600 uppercase">{product.getCategory()}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.getTitle()}</h1>
          <p className="text-3xl font-bold text-gray-900 mt-4">{product.getPrice().format()}</p>
          <p className="text-gray-600 mt-6 leading-relaxed">{product.getDescription()}</p>
          <p className="text-sm text-gray-400 mt-4">
            Added {product.getCreatedAt().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
