import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    rolesAllowed: string[];
    currentRole?: string;
    children: ReactNode;
}

const ProtectedRoute = ({ rolesAllowed, currentRole, children }: ProtectedRouteProps) => {
    if (currentRole === undefined) {
        return <Navigate to="/unauthorized" replace />;
    }
    if (!rolesAllowed.includes(currentRole)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;