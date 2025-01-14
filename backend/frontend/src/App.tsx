import { Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfile from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import PrivateRoute from "./components/PrivateRoute";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const user = useRecoilValue(userAtom);
  const location = useLocation();

  return (
    <main className="bg-white text-black dark:bg-dark transition-colors duration-200 dark:text-white min-h-screen pb-10">
      <Toaster richColors />
      <div className={`w-full mx-auto px-5 max-w-[620px]`}>
        <Header />
      </div>
      <div
        className={`w-full mx-auto px-5 ${
          location.pathname === "/chat" ? "max-w-[750px]" : "max-w-[620px]"
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/update"
            element={
              <PrivateRoute>
                <UpdateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </div>
      {user && <CreatePost />}
    </main>
  );
};

export default App;
