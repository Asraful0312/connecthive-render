import { User } from "@/utils/types";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { ADMIN_FOLLOWERS, BASE_URL } from "@/lib/config";
import { useState } from "react";
import { toast } from "sonner";
import { TextMorph } from "./ui/text-morph";
import { EnhancedButton } from "./ui/enhancedButton";

type Props = {
  user: User;
};

const UserFollowCard = ({ user }: Props) => {
  const currentUser = useRecoilValue(userAtom);
  const { _id, username, profilePic, followers } = user || {};
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  const handleFollowAndUnfollow = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/follow/${user._id}`, {
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
    <div className="flex items-start justify-between  p-2">
      <div className="flex items-start gap-2 ">
        <Link to={`/${username}`} className="shrink-0">
          <img
            className="rounded-full size-10"
            src={profilePic || "/images/user.jpg"}
            alt={username}
          />
        </Link>
        <div>
          <div className="flex w-full items-center">
            <p className="text-sm font-bold">{username}</p>
            <img
              className="size-4 ml-1"
              src={
                username === "asrafulislam"
                  ? "/images/verify-2.png"
                  : "/images/verify.png"
              }
              alt="verify icon"
            />
          </div>

          <p className="text-light-gray text-xs">
            {username === "asrafulislam"
              ? (ADMIN_FOLLOWERS + followers.length).toLocaleString()
              : followers.length >= 1000
              ? `${(followers.length / 1000).toFixed(1)}k`
              : followers.length.toLocaleString()}{" "}
            {followers.length > 1 ? "followers" : "follower"}
          </p>
        </div>
      </div>
      <EnhancedButton
        effect="shineHover"
        className="text-sm transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2"
        size="sm"
        disabled={isUpdating}
        onClick={handleFollowAndUnfollow}
      >
        <TextMorph className="text-xs">
          {isFollowing ? "Unfollow" : "Follow"}
        </TextMorph>
      </EnhancedButton>
    </div>
  );
};

export default UserFollowCard;
