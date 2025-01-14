import postsAtom from "@/atoms/postAtom";
import UserPostSkeleton from "@/components/skeletons/UserPostSkeleton";
import UserSkeleton from "@/components/skeletons/UserSkeleton";
import UserHeader from "@/components/UserHeader";
import UserPost from "@/components/UserPost";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { BASE_URL } from "@/lib/config";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

// Define the User interface

const UserPage = () => {
  // Initialize user state with the User type or null
  const { user, loading } = useGetUserProfile();

  const { username } = useParams();

  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const baseUrl = BASE_URL;

  useEffect(() => {
    const getUserPosts = async () => {
      setIsPosting(true);
      try {
        const res = await fetch(`${baseUrl}/api/posts/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          setIsPosting(false);
          setPosts([]);

          toast.error(data.error);
          return;
        }
        setIsPosting(false);
        setPosts(data);
      } catch (error) {
        setPosts([]);
        setIsPosting(false);
        console.log(error);
      }
    };

    getUserPosts();
  }, [baseUrl, setPosts, username]);

  let content;
  if (loading) {
    content = <UserSkeleton />;
  } else if (!loading && !user) {
    content = <p className="text-center text-red-500">User not found!</p>;
  } else if (!loading && user) {
    content = <UserHeader user={user} />;
  }

  let renderPost;
  if (isPosting) {
    renderPost = (
      <>
        <UserPostSkeleton />
        <UserPostSkeleton />
        <UserPostSkeleton />
        <UserPostSkeleton />
      </>
    );
  } else if (!isPosting && posts?.length === 0) {
    renderPost = <p className="text-center mt-4">No posts to display.</p>;
  } else if (!isPosting && posts && posts.length > 0) {
    renderPost = (
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <UserPost post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    );
  }

  return (
    <>
      {content}
      {renderPost}
    </>
  );
};

export default UserPage;
