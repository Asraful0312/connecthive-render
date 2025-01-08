import { User } from "@/utils/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { username } = useParams();
  const baseUrl = import.meta.env.VITE_REACT_BACKEND_BASE_URL;

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/users/profile/${username}`, {
          method: "GET",
          credentials: "include", // For handling JWT authentication
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.error) {
          setLoading(false);
          toast.error(data.error);
          return;
        }
        setLoading(false);
        setUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    getUser();
  }, [username]);

  return { loading, user };
};

export default useGetUserProfile;
