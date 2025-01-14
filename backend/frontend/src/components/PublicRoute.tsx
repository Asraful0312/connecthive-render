import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useRecoilValue(userAtom);

  return !user ? children : <Navigate to="/auth" />;
};

export default PublicRoute;
