import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";
import userAtom from "@/atoms/userAtom";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);
  const baseUrl = import.meta.env.VITE_REACT_BACKEND_BASE_URL;

  const handleLogout = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      localStorage.removeItem("user-data");
      setUser(null);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Button
      onClick={handleLogout}
      className="rounded-full"
      variant="ghost"
      size="icon"
    >
      <LogOut />
    </Button>
  );
};

export default LogoutButton;
