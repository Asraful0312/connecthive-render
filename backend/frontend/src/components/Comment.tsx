import { BsThreeDots } from "react-icons/bs";
import { Separator } from "./ui/separator";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { Reply } from "@/utils/types";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { Link } from "react-router-dom";

type Props = {
  reply: Reply;
  lastComment: boolean;
  handleDeleteComment: (commentId: string) => void;
  isCommentDeleting: boolean;
};

const Comment = ({
  reply,
  lastComment,
  handleDeleteComment,
  isCommentDeleting,
}: Props) => {
  const user = useRecoilValue(userAtom);
  if (!reply) {
    return null;
  }

  return (
    <div className="flex py-2 my-2 gap-4 w-full">
      <Link to={`/${reply?.username}`}>
        <img
          src={reply?.userProfilePic || "/images/user.jpg"}
          alt={reply?.username || "User"}
          className="size-7"
        />
      </Link>
      <div className="flex gap-2 flex-col w-full">
        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center">
            <p className="text-sm font-bold">{reply?.username}</p>
            <img
              className="size-4 ml-1"
              src={
                reply?.username === "asrafulislam"
                  ? "/images/verify-2.png"
                  : "/images/verify.png"
              }
              alt="verify icon"
            />
          </div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger
                disabled={isCommentDeleting}
                className={`bg-transparent border-none ${
                  isCommentDeleting ? "opacity-70" : "opacity-100"
                }`}
              >
                <button>
                  <BsThreeDots />
                </button>
              </MenubarTrigger>
              {user?._id === reply.userId && (
                <MenubarContent>
                  <MenubarItem>
                    <button
                      className="w-full text-start disabled:opacity-70"
                      onClick={() => handleDeleteComment(reply._id)}
                    >
                      Delete
                    </button>
                  </MenubarItem>
                </MenubarContent>
              )}
            </MenubarMenu>
          </Menubar>
        </div>
        <p className="mb-2">{reply?.text}</p>
        {!lastComment && <Separator className="mt-2" />}
      </div>
    </div>
  );
};

export default Comment;
