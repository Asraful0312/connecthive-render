import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { Post, User } from "@/utils/types";
import { formatDistanceToNow } from "date-fns";
import UserPostSkeleton from "./skeletons/UserPostSkeleton";
import useDeletePost from "@/hooks/useDeletePost";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { TextShimmer } from "./ui/text-shimmer";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/config";
import { FaRegComment } from "react-icons/fa";

type Props = {
  post: Post;
};

const UserPost = ({ post }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const currentUser = useRecoilValue(userAtom);
  const { handleDeletePost, isDeleting } = useDeletePost(post);
  const [isLoading, setIsLoading] = useState(false);
  const { postedBy, img, text, replies, createdAt } = post || {};

  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/users/profile/` + postedBy, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          setIsLoading(false);
          toast(data.error);
          return;
        }
        setUser(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
        setUser(null);
      }
    };

    getUser();
  }, [postedBy]);

  if (isLoading) {
    return <UserPostSkeleton />;
  }

  if (!post) {
    return null;
  }

  return (
    <div className="pt-8">
      {isDeleting && (
        <div className="flex justify-center">
          <TextShimmer className="text-xs text-center">
            Please wait...
          </TextShimmer>
        </div>
      )}
      <div className="">
        <div className="flex py-5 pb-4 gap-3">
          <div className="flex flex-col items-center">
            <Link to={`/${postedBy}`}>
              <Avatar className="size-12 md:size-14">
                <AvatarImage
                  src={user?.profilePic || "images/user.jpg"}
                  alt="mark"
                />
              </Avatar>
            </Link>

            {/* line */}

            <div className="h-full w-[1px] bg-light-gray my-2" />

            <div className="relative w-full">
              {replies?.length === 0 && <p className="text-center">😒</p>}

              {/* {newReplies && newReplies[0] && (
                <Avatar className="size-7 absolute bottom-0 left-0 md:left-1 p-[2px]">
                  <AvatarImage
                    src={newReplies[0].userProfilePic || "/images/user.jpg"}
                    alt={newReplies[0].username}
                  />
                </Avatar>
              )}

              {newReplies && newReplies[2] && (
                <Avatar className="size-7 absolute top-0 left-[15px] p-[2px]">
                  <AvatarImage
                    src={newReplies[2].userProfilePic || "/images/user.jpg"}
                    alt={newReplies[2].username}
                  />
                </Avatar>
              )} */}

              {/* {newReplies && newReplies[1] && (
                <Avatar className="size-7 absolute bottom-0 right-[-5px] p-[2px]">
                  <AvatarImage
                    src={newReplies[1].userProfilePic || "/images/user.jpg"}
                    alt={newReplies[1].username}
                  />
                </Avatar>
              )} */}
            </div>
          </div>

          <div className="flex gap-2 flex-col w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex w-full items-center">
                <Link to={`/${postedBy}`} className="text-sm font-bold">
                  {user?.name}
                </Link>
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
              <div
                onClick={(e) => e.preventDefault()}
                className="flex gap-4 items-center w-full justify-end"
              >
                <p className="text-sm text-light-gray">
                  {formatDistanceToNow(createdAt)} ago
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
                    {currentUser?._id === postedBy && (
                      <MenubarContent>
                        <MenubarItem>
                          <button
                            className="w-full text-start disabled:opacity-70"
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

            <Link to={`/${postedBy}/post/${post._id}`} className="text-sm">
              {text}
            </Link>

            {img && (
              <Link
                to={`/${postedBy}/post/${post._id}`}
                className="rounded-md border border-[#dbdbdb] overflow-hidden"
              >
                <img
                  className="w-full"
                  src={typeof img === "string" ? img : img?.url}
                  alt={text}
                />
              </Link>
            )}

            <div className="flex my-1">
              <div className="flex items-center">
                {post.replies.slice(0, 3).map((reply, index) => (
                  <Avatar
                    className={`size-7 border-2 border-purple-500 ${
                      index === 0
                        ? ""
                        : index === 1
                        ? "-translate-x-[50%]"
                        : "-translate-x-[100%]"
                    }`}
                  >
                    <AvatarImage src={reply.userProfilePic} alt={"profile"} />
                  </Avatar>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-2">
                <Link to={`/${postedBy}/post/${post._id}`}>
                  <FaRegComment className={`size-4 `} />
                </Link>
                <Actions post={post} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPost;
