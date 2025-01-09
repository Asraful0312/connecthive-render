import userAtom from "@/atoms/userAtom";
import { Post } from "@/utils/types";
import { ArrowRight, Loader2, RefreshCcw, Send } from "lucide-react";
import { useState } from "react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";
import { TextShimmer } from "./ui/text-shimmer";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import postsAtom from "@/atoms/postAtom";

type Props = {
  post: Post;
  setIsCommented: (value: number) => void;
};

const Actions = ({ post, setIsCommented }: Props) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const baseUrl = "https://connecthive-render.onrender.com";

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

  const handleReply = async () => {
    if (!user) return toast.info("You must be logged in to reply to a post");
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch(`${baseUrl}/api/posts/reply/` + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setIsCommented(
        posts.find((p) => p._id === post._id)?.replies.length ?? 0
      );
      setPosts(updatedPosts);
      toast.success("Reply posted successfully");
      setReply("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div onClick={(e) => e.preventDefault()} className="flex flex-col gap-2">
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

        <Drawer>
          <DrawerTrigger asChild>
            <button>
              <FaRegComment className={`size-4 `} />
            </button>
          </DrawerTrigger>
          <DrawerContent className="w-full max-w-[620px] min-h-52 mx-auto px-5">
            <div className="flex items-center gap-3">
              <p className="text-sm text-light-gray">
                {post?.likes.length} likes
              </p>
              <p className="text-sm text-light-gray">
                {post?.replies.length} Reply
              </p>
            </div>

            <div className="mb-5">
              <div className="space-y-2">
                <Label htmlFor="input-26">Enter your comment</Label>
                <div className="relative">
                  <Input
                    id="input-26"
                    className="peer pe-9"
                    placeholder="Comment..."
                    onChange={(e) => setReply(e.target.value)}
                    value={reply}
                    type="search"
                    onKeyDown={(e) => {
                      if (isReplying) {
                        return;
                      }
                      if (e.key === "Enter") {
                        handleReply();
                      }
                    }}
                    disabled={isReplying}
                  />
                  <button
                    onClick={handleReply}
                    disabled={isReplying}
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="button"
                  >
                    {isReplying ? (
                      <Loader2 className="size-4 shrink-0 animate-spin" />
                    ) : (
                      <ArrowRight
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

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
