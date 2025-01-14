import postsAtom from "@/atoms/postAtom";
import userAtom from "@/atoms/userAtom";
import UserFollowCardSkeleton from "@/components/skeletons/UserFollowCardSkeleton";
import UserPostSkeleton from "@/components/skeletons/UserPostSkeleton";
import UserFollowCard from "@/components/UserFollowCard";
import UserPost from "@/components/UserPost";
import { BASE_URL } from "@/lib/config";
import { Post, User } from "@/utils/types";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestedUserData, setSuggestedUserData] = useState<
    User[] | undefined
  >([]);
  const user = useRecoilValue(userAtom);
  const baseUrl = BASE_URL;

  useEffect(() => {
    setLoading(true);
    const getFeedPost = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/posts/feed`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (data.error) {
          setLoading(false);
          return;
        }
        setLoading(false);
        setPosts(data);
      } catch (error) {
        setLoading(false);
        console.log("", error);
      }
    };

    const getSuggestedUsers = async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/users/suggest/${user?._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        setSuggestLoading(false);

        if (data.error) {
          setSuggestLoading(false);
          setSuggestedUserData([]);
          toast.error(data.error);
          console.log(data.error);
          return;
        }
        setSuggestedUserData(data);
      } catch (error) {
        setSuggestLoading(false);
        console.log("", error);
      }
    };
    getFeedPost();

    if (user && user?._id) {
      getSuggestedUsers();
    }
  }, [baseUrl, setPosts, user, user._id]);

  let content;
  if (loading) {
    content = (
      <>
        <UserPostSkeleton />
        <UserPostSkeleton />
        <UserPostSkeleton />
      </>
    );
  } else if (!loading && posts.length === 0) {
    content = (
      <p className="text-center mt-4">
        No posts to display. Please follow someone to get posts.
      </p>
    );
  } else if (!loading && posts.length > 0) {
    content = posts.map((post: Post) => (
      <div className="" key={post._id}>
        <UserPost post={post} />
      </div>
    ));
  }

  let suggestContent;
  if (suggestLoading) {
    suggestContent = (
      <div className="space-y-3">
        <UserFollowCardSkeleton />
        <UserFollowCardSkeleton />
        <UserFollowCardSkeleton />
        <UserFollowCardSkeleton />
        <UserFollowCardSkeleton />
      </div>
    );
  } else if (
    !suggestLoading &&
    suggestedUserData &&
    suggestedUserData?.length > 0
  ) {
    suggestContent = suggestedUserData?.map((user: User) => (
      <div className="space-y-3" key={user._id}>
        <UserFollowCard user={user} />
      </div>
    ));
  }

  return (
    <>
      {suggestContent}
      {content}
    </>
  );
};

export default HomePage;
