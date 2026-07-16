import type { ProfileCardProps } from '@ddd-store/web-shared/users';

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-gray-500">Name</dt>
          <dd className="text-gray-900 font-medium">{user.getName()}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Email</dt>
          <dd className="text-gray-900">{user.getEmail()}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Role</dt>
          <dd>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.isAdmin() ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.getRole().getValue()}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
