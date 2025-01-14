import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = useRecoilValue(userAtom);

  return user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
