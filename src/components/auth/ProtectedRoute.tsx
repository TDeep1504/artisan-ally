import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  children: React.ReactNode;
  requiredRole?: "buyer" | "business_buyer" | "seller" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && !roles.includes(requiredRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
