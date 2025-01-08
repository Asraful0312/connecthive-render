import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";
import authScreenAtom from "./../atoms/authAtom";
import { useRecoilValue } from "recoil";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LoginForm /> : <SignupForm />}</>;
};

export default AuthPage;
