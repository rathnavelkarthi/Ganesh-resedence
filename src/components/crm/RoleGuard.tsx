import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, Role } from '../../context/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasPermission(allowedRoles)) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[var(--color-ocean-600)] text-white rounded-xl font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
