import userAtom from "@/atoms/userAtom";
import { Post } from "@/utils/types";
import { RefreshCcw, Send } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { TextShimmer } from "./ui/text-shimmer";
import postsAtom from "@/atoms/postAtom";
import { BASE_URL } from "@/lib/config";

type Props = {
  post: Post;
};

const Actions = ({ post }: Props) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const baseUrl = BASE_URL;

  const handleLikeAndUnlike = async () => {
    if (!user) return toast.info("You must be logged in to like a post");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`${baseUrl}/api/posts/like/` + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);

      if (!liked) {
        // add the id of the current user to post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });

        setPosts(updatedPosts);
      } else {
        // remove the id of the current user from post.likes array
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }

      setLiked(!liked);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div onClick={(e) => e.preventDefault()} className="flex gap-2">
      <div className="flex items-center gap-2">
        <button
          disabled={isLiking}
          className="disabled:opacity-70"
          onClick={handleLikeAndUnlike}
        >
          {liked ? (
            <FaHeart className={`size-4 text-pink-500`} />
          ) : (
            <FaRegHeart className="size-4" />
          )}
        </button>

        <button>
          <RefreshCcw className={`size-4`} />
        </button>
        <button>
          <Send className={`size-4`} />
        </button>

        {isLiking && (
          <TextShimmer className="text-xs">Please wait...</TextShimmer>
        )}
      </div>

      <div className="flex items-center gap-2">
        <p className="text-sm text-light-gray">
          {post?.replies.length}{" "}
          {post?.replies.length > 1 ? "replies" : "reply"}
        </p>
        <div className="size-[4px] rounded-full bg-light-gray" />
        <p className="text-sm text-light-gray">
          {post?.likes.length} {post?.likes.length > 1 ? "likes" : "like"}
        </p>
      </div>
    </div>
  );
};

export default Actions;
