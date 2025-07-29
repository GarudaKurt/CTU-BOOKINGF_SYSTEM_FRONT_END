import { Head } from "next/document";
import { useAuth } from "@/app/context/useAuth";

import { useRouter } from "next/navigation";
const privateRoute = ({ children }) => {
  const navigate = useRouter();
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (isAuthenticated) {
    return children;
  } else {
    navigate.push("/app/sigin");
  }
};
export default privateRoute;
