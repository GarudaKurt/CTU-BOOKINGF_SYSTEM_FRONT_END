import { useAuth } from "@/app/context/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/app/signin"); // fixed typo "sigin"
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Optional: render nothing while redirecting
  return null;
};

export default PrivateRoute;
