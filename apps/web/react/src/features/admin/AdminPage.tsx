import { useEffect, useState } from 'react';
import { User } from '@ddd-store/users';
import { Product, CreateProductData } from '@ddd-store/catalog';
import { Session } from '@ddd-store/shared';
import {
  adminPage,
  ADMIN_TABS,
  emptyProductForm,
  type AdminTab,
} from '@ddd-store/web-shared/admin';
import { useContainer } from '../../di/ContainerContext';

export function AdminPage() {
  const {
    listAllUsersUseCase,
    listAllSessionsUseCase,
    getProductsUseCase,
    createProductUseCase,
    updateProductUseCase,
    deleteProductUseCase,
  } = useContainer();

  const [tab, setTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductData>({ ...emptyProductForm });

  const loadData = async () => {
    const [u, s, p] = await Promise.all([
      listAllUsersUseCase.execute(),
      listAllSessionsUseCase.execute(),
      getProductsUseCase.execute(),
    ]);
    setUsers(u);
    setSessions(s);
    setProducts(p);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProduct = async () => {
    if (editingId) {
      await updateProductUseCase.execute(editingId, form);
    } else {
      await createProductUseCase.execute(form);
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyProductForm });
    await loadData();
  };

  const handleEdit = (product: Product) => {
    const json = product.toJSON();
    setForm({
      title: json.title,
      description: json.description,
      price: json.price,
      image: json.image,
      category: json.category,
    });
    setEditingId(product.getId());
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await deleteProductUseCase.execute(id);
      await loadData();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{adminPage.title}</h1>

      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {ADMIN_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-sm font-medium capitalize border-b-2 -mb-px ${
              tab === t
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.getId()}>
                  <td className="px-4 py-3">{u.getName()}</td>
                  <td className="px-4 py-3">{u.getEmail()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.isAdmin() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.getRole().getValue()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'sessions' && (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between">
                <span className="font-medium">
                  {s.getDeviceLabel()} — {s.deviceType}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    s.isActive() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {s.isActive() ? 'Active' : 'Expired'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">User: {s.userId}</p>
              <p className="text-sm text-gray-500">Last active: {s.lastActivityAt.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Products</h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
              <h3 className="font-semibold">{editingId ? 'Edit Product' : 'New Product'}</h3>
              {(['title', 'description', 'image', 'category'] as const).map((field) => (
                <input
                  key={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              ))}
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProduct}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Save
                </button>
                <button onClick={() => setShowForm(false)} className="text-gray-600 px-4 py-2 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p.getId()}>
                    <td className="px-4 py-3">{p.getTitle()}</td>
                    <td className="px-4 py-3">{p.getCategory()}</td>
                    <td className="px-4 py-3">{p.getPrice().format()}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 text-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.getId())} className="text-red-600 text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
