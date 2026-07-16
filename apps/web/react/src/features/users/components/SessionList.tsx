import type { SessionListProps } from '@ddd-store/web-shared/users';

export function SessionList({
  sessions,
  currentUserAgent,
  onTerminate,
  isTerminating,
}: SessionListProps) {
  const isCurrentSession = (userAgent: string) => userAgent === currentUserAgent;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Active Sessions</h2>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              isCurrentSession(session.userAgent) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {session.getDeviceLabel()} {session.deviceType === 'WEB' ? '— Web' : '— Mobile'}
                </span>
                {isCurrentSession(session.userAgent) && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Current device
                  </span>
                )}
                {session.isActive() && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Created: {session.createdAt.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                Last active: {session.lastActivityAt.toLocaleString()}
              </p>
              {session.expiresAt && (
                <p className="text-sm text-gray-500">Expires: {session.expiresAt.toLocaleString()}</p>
              )}
            </div>
            {!isCurrentSession(session.userAgent) && (
              <button
                onClick={() => onTerminate(session.id)}
                disabled={isTerminating === session.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {isTerminating === session.id ? 'Terminating...' : 'Terminate'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
