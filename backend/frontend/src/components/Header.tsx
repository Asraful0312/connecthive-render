import { Link } from "react-router-dom";
import Switch from "./ui/Switch";
import LogoutButton from "./LogoutButton";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "@/atoms/userAtom";

import { FaRegUserCircle } from "react-icons/fa";
import { buttonVariants } from "./ui/enhancedButton";
import authScreenAtom from "@/atoms/authAtom";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  return (
    <header className="pt-4 mb-6 flex items-center justify-between">
      <Link title="logo" className="text-2xl font-bold" to="/">
        Connect <span className="text-xs text-purple-500">Hive</span>
      </Link>
      <div className="flex items-center gap-2">
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
