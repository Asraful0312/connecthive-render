import postsAtom from "@/atoms/postAtom";
import userAtom from "@/atoms/userAtom";
import { Post } from "@/utils/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const useDeletePost = (post: Post) => {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const baseUrl = "https://connecthive-render.onrender.com";

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) {
        setIsDeleting(false);
        return;
      }

      const res = await fetch(`${baseUrl}/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        setIsDeleting(false);
        toast.error(data.error);
        return;
      }
      setIsDeleting(false);
      setPosts((prev) => prev.filter((p: Post) => p._id !== post._id));
      navigate(`/${currentUser.username}`);
      toast.success("Post deleted successfully!");
    } catch (error) {
      setIsDeleting(false);

      console.log(error);
    }
  };

  return { handleDeletePost, isDeleting, posts };
};

export default useDeletePost;
