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
import UserProfileAvatar from "./UserProfileAvatar";

type Props = {
  reply: Reply;
};

const Comment = ({ reply }: Props) => {
  if (!reply) {
    return null;
  }

  return (
    <div className="flex py-2 my-2 gap-4 w-full">
      <UserProfileAvatar
        imageUrl={reply?.userProfilePic || ""}
        alt={reply?.username || "User"}
        className="size-7"
      />
      <div className="flex gap-2 flex-col w-full">
        <div className="flex w-full items-center justify-between">
          <p className="text-sm font-bold">{reply?.username}</p>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="bg-transparent border-none">
                <button>
                  <BsThreeDots />
                </button>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Delete</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <p className="mb-2">{reply?.text}</p>
        <Separator className="mt-2" />
      </div>
    </div>
  );
};

export default Comment;
