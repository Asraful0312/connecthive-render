import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import { toast } from "sonner";
import { User } from "@/utils/types";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { Button } from "./ui/button";
import { useState } from "react";
import { TextMorph } from "./ui/text-morph";
import { TextShimmer } from "./ui/text-shimmer";
import UserProfileAvatar from "./UserProfileAvatar";
import { buttonVariants, EnhancedButton } from "./ui/enhancedButton";

type Props = {
  user: User;
};

const UserHeader = ({ user }: Props) => {
  const { _id, name, username, profilePic, bio, followers } = user || {};
  const currentUser = useRecoilValue(userAtom);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const baseUrl =
    import.meta.env.VITE_REACT_BACKEND_BASE_URL || "http://localhost:5000";

  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  const handleFollowAndUnfollow = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) {
        setIsUpdating(false);
        toast.error(data.error);
        return;
      }
      setIsFollowing(!isFollowing);

      if (isFollowing) {
        user.followers.pop();
      } else {
        user.followers.push(_id);
      }
      setIsUpdating(false);

      toast.success(data.message);
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            <div className="flex gap-2 items-center mt-2">
              <p className="text-sm">{username}</p>
              <p className="text-sm bg-gray-200 dark:bg-gray-secondary rounded-full px-2">
                connecthive.next
              </p>
            </div>
          </div>
          <div>
            {profilePic && (
              <UserProfileAvatar
                imageUrl={profilePic || "/images/user.jpg"}
                alt={username}
                className="size-16 md:size-20 rounded-full object-cover"
              />
            )}
          </div>
        </div>

        <div>
          <p className="text-lg">{bio}</p>
        </div>

        {currentUser?._id === _id ? (
          <Link
            to="/update"
            className={buttonVariants({
              variant: "secondary",
              effect: "gooeyLeft",
            })}
          >
            Update Profile
          </Link>
        ) : (
          <Button
            disabled={isUpdating}
            onClick={handleFollowAndUnfollow}
            variant="secondary"
          >
            <TextMorph>{isFollowing ? "Unfollow" : "Follow"}</TextMorph>
          </Button>
        )}

        {isUpdating && (
          <TextShimmer className="font-mono text-sm ml-4" duration={1}>
            Please wait...
          </TextShimmer>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-light-gray text-sm">
              {followers.length >= 1000
                ? `${followers.length}k`
                : followers.length}{" "}
              followers
            </p>
            <div className="size-[5px] bg-light-gray rounded-full" />

            <EnhancedButton
              className="text-light-gray"
              variant="link"
              effect="hoverUnderline"
            >
              instagram.com
            </EnhancedButton>
          </div>

          <div className="flex">
            <button className="rounded-full hover:bg-slate-100 dark:hover:bg-gray-secondary ease-in-out transition-colors duration-300 p-2">
              <BsInstagram className="size-6 shrink-0" />
            </button>

            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="bg-transparent border-none">
                  <button className="rounded-full hover:bg-slate-100 dark:hover:bg-gray-secondary ease-in-out transition-colors duration-300 p-2">
                    <CgMoreO className="size-6 shrink-0" />
                  </button>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={copyUrl}>Copy Link</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>

        <div className="flex w-full">
          <button className="basis-1/2 font-bold border-b border-black dark:border-white py-3">
            Posts
          </button>
          <button className="basis-1/2 font-bold border-b border-gray-200 dark:border-gray-500 text-light-gray py-3">
            Replies
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
