import { Link } from "react-router-dom";
import Switch from "./ui/Switch";
import LogoutButton from "./LogoutButton";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "@/atoms/userAtom";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { buttonVariants } from "./ui/enhancedButton";
import authScreenAtom from "@/atoms/authAtom";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ADMIN_FOLLOWERS, BASE_URL } from "@/lib/config";
import { User } from "@/utils/types";
import { useClickOutside, useDebouncedValue } from "@mantine/hooks";
import { Input } from "./ui/input";
import SearchCardSkeleton from "./skeletons/SearchCardSkeleton";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [users, setUsers] = useState<User[] | undefined>([]);
  const [error, setError] = useState("");
  const [debounced] = useDebouncedValue(searchTerm, 500);
  const [loading, setLoading] = useState(false);
  const ref = useClickOutside(() => setIsSearch(false));

  //debounce value
  useEffect(() => {
    const searchUser = async () => {
      setLoading(true);
      if (!debounced) {
        setLoading(false);
        setUsers([]);
        setSearchTerm("");
        return;
      }
      try {
        const rse = await fetch(
          `${BASE_URL}/api/users/search?term=${searchTerm}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await rse.json();
        if (data.error) {
          setLoading(false);

          setError(data.error);
          return;
        }
        setLoading(false);

        setUsers(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    searchUser();
  }, [debounced]);

  let content;
  if (loading) {
    content = (
      <>
        <SearchCardSkeleton />
        <SearchCardSkeleton />
        <SearchCardSkeleton />
        <SearchCardSkeleton />
        <SearchCardSkeleton />
      </>
    );
  } else if (!loading && error) {
    content = <p className="text-center text-red-500">{error}</p>;
  } else if (!loading && !error && users?.length === 0) {
    content = <p className="text-center text-gray-500">No users found.</p>;
  } else if (!loading && !error && users && users?.length > 0) {
    content = users?.map((user) => (
      <Link
        onClick={() => {
          setIsSearch(false);
          setUsers([]);
          setSearchTerm("");
        }}
        key={user?._id}
        className=" flex items-start gap-2"
        to={`/${user?.username}`}
      >
        <img
          className="size-7 rounded-full border border-blue-400"
          src={user?.profilePic || "/images/user.jpg"}
          alt={user?.username}
        />

        <div>
          <h2>{user?.username}</h2>
          <p className="text-light-gray text-xs">
            {user?.username === "asrafulislam"
              ? typeof user.followers === "number" &&
                ADMIN_FOLLOWERS.toLocaleString()
              : user.followers.toLocaleString()}{" "}
            {typeof user.followers === "number" && user?.followers > 1
              ? "followers"
              : "follower"}
          </p>
        </div>
      </Link>
    ));
  }

  console.log(users);

  return (
    <header className="pt-4 mb-6 flex items-center justify-between">
      <Link title="logo" className="text-2xl font-bold" to="/">
        Connect <span className="text-xs text-purple-500">Hive</span>
      </Link>
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => {
            setIsSearch((prev) => !prev);
            setUsers([]);
            setSearchTerm("");
          }}
        >
          {isSearch ? <X className="size-5" /> : <Search className="size-5" />}
        </button>

        <div
          ref={ref}
          className={`absolute border right-0 top-10 rounded-md w-[250px] md:w-[420px] h-[330px] bg-white dark:bg-dark p-3 z-[1000] transition-all duration-300 ${
            isSearch
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 translate-y-3 invisible"
          }`}
        >
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <div className="space-y-3 mt-3">{content}</div>
        </div>

        {user ? (
          <LogoutButton />
        ) : (
          <Link
            className={buttonVariants({
              variant: "link",
              effect: "hoverUnderline",
            })}
            onClick={() => setAuthScreen("login")}
            to="/auth"
          >
            Login
          </Link>
        )}

        <Link className="shrink-0" to="/chat">
          <LuMessageCircleMore className="shrink-0 size-5" title="chat" />
        </Link>

        <Switch />
        {user && (
          <Link to={`/${user.username}`}>
            <FaRegUserCircle className="size-5 shrink-0 ml-2" />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
