import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Switch = () => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("theme") ?? "false")
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "false");
    }
  }, [darkMode]);
  return (
    <div className="toggle-switch flex items-center justify-center">
      <button
        onClick={() => setDarkMode((prev: boolean) => !prev)}
        className={``}
      >
        {darkMode ? (
          <Sun className="size-5 shrink-0 text-yellow-400" />
        ) : (
          <Moon className="size-5 shrink-0" />
        )}
      </button>
    </div>
  );
};

export default Switch;
