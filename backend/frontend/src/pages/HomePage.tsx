import postsAtom from "@/atoms/postAtom";
import UserPostSkeleton from "@/components/skeletons/UserPostSkeleton";
import UserPost from "@/components/UserPost";
import { Post } from "@/utils/types";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_REACT_BACKEND_BASE_URL;

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
        console.log("DATA ", data);
      } catch (error) {
        setLoading(false);
        console.log("", error);
      }
    };

    getFeedPost();
  }, [setPosts]);

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
    content = <p>No posts to display. Please follow someone to get posts.</p>;
  } else if (!loading && posts.length > 0) {
    content = posts.map((post: Post) => (
      <div className="" key={post._id}>
        <UserPost post={post} />
      </div>
    ));
  }

  return <>{content}</>;
};

export default HomePage;
