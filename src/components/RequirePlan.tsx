import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { hasAccess, getUser, type User } from "@/lib/auth";

type RequirePlanProps = {
  children: ReactNode;
  requiredPlan: User["plan"];
  fallback?: ReactNode;
};

export const RequirePlan = ({ children, requiredPlan, fallback }: RequirePlanProps) => {
  const location = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to={`/register?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!hasAccess(user, requiredPlan)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/paywall" replace />;
  }

  return <>{children}</>;
};

export const usePlanAccess = () => {
  const user = getUser();
  return {
    user,
    canAccessBasic: hasAccess(user, "basic"),
    canAccessExpert: hasAccess(user, "expert"),
    plan: user?.plan || "free",
    isActive: user ? true : false,
  };
};
