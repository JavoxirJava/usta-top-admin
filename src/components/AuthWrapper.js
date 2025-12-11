// components/AuthWrapper.js
'use client';

import useAuth from '@/hooks/useAuth';

export default function AuthWrapper({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner">
          <div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
