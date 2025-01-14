import postsAtom from "@/atoms/postAtom";
import userAtom from "@/atoms/userAtom";
import Actions from "@/components/Actions";
import Comment from "@/components/Comment";
import CreateComment from "@/components/CreateComment";
import PostPageSkeleton from "@/components/skeletons/PostPageSkeleton";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { TextShimmer } from "@/components/ui/text-shimmer";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { BASE_URL } from "@/lib/config";
import { Comment as CommentType } from "@/utils/types";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isDeleting, setIsDeleting] = useState(false);
  const { pid } = useParams();
  const [comments, setComments] = useState<CommentType[] | undefined>([]);
  const currentUser = useRecoilValue(userAtom);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const navigate = useNavigate();
  const baseUrl = BASE_URL;

  const currentPost = posts[0];

  // GET POST
  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`${baseUrl}/api/posts/${pid}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          return;
        }

        setComments(data?.replies?.reverse());

        setPosts([data]);
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [baseUrl, pid, setPosts]);

  // delete post
  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      if (!window.confirm("Are you sure you want to delete this post?"))
        return setIsDeleting(false);

      const res = await fetch(`${baseUrl}/api/posts/${currentPost._id}`, {
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

      toast.success("Post deleted");
      navigate(`/${user?.username}`);
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsCommentDeleting(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/posts/reply/${currentPost._id}/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.error) {
        setIsCommentDeleting(false);
        toast.error(data.error);
        return;
      }
      setIsCommentDeleting(false);

      setComments(comments?.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      setIsCommentDeleting(false);

      console.log(error);
    }
  };

  if (!user && loading) {
    return <PostPageSkeleton />;
  }

  if (!currentPost) return null;

  return (
    <div className="">
      {isDeleting && (
        <div className="flex justify-center">
          <TextShimmer className="text-xs text-center">
            Please wait...
          </TextShimmer>
        </div>
      )}
      <div className="flex gap-2 flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-start gap-3">
            <Link className="shrink-0" to={`/${user?.username}`}>
              <img
                className="size-12 rounded-full shrink-0"
                src={user?.profilePic}
                alt={user?.username}
              />
            </Link>

            <div className="flex w-full items-center">
              <p className="text-sm font-bold">{user?.name}</p>
              <img
                className="size-4 ml-1"
                src={
                  user?.username === "asrafulislam"
                    ? "/images/verify-2.png"
                    : "/images/verify.png"
                }
                alt="verify icon"
              />
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-sm text-light-gray">
              {currentPost.createdAt &&
                formatDistanceToNow(new Date(currentPost.createdAt))}{" "}
              ago
            </p>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger
                  disabled={isDeleting}
                  className="bg-transparent border-none disabled:opacity-70"
                >
                  <button>
                    <BsThreeDots />
                  </button>
                </MenubarTrigger>
                {currentUser?._id === currentPost?.postedBy && (
                  <MenubarContent>
                    <MenubarItem>
                      <button
                        className="disabled:opacity-70 w-full text-start"
                        disabled={isDeleting}
                        onClick={handleDeletePost}
                      >
                        Delete
                      </button>
                    </MenubarItem>
                  </MenubarContent>
                )}
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        <p className="text-sm w-full">{currentPost.text}</p>

        {currentPost.img && (
          <div className="rounded-md border border-[#dbdbdb] overflow-hidden">
            <img
              className="w-full"
              src={
                typeof currentPost.img === "string"
                  ? currentPost.img
                  : currentPost.img.url
              }
              alt={currentPost.text}
            />
          </div>
        )}

        <div className="flex gap-2 my-1">
          <Actions post={currentPost} />
        </div>
      </div>

      <Separator className="my-4" />

      <CreateComment postId={currentPost?._id} setComments={setComments} />

      <Separator className="my-4" />

      <AnimatePresence>
        {comments?.map((reply, index) => (
          <motion.div
            key={reply?._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Comment
              key={reply?._id}
              reply={reply}
              handleDeleteComment={handleDeleteComment}
              lastComment={index === comments.length - 1}
              isCommentDeleting={isCommentDeleting}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PostPage;
