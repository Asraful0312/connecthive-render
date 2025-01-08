import { Navigate, Route, Routes } from "react-router-dom";
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

const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <main className="bg-white text-black dark:bg-dark transition-colors duration-200 dark:text-white min-h-screen pb-10">
      <Toaster richColors />
      <div className="w-full max-w-[620px] mx-auto px-5">
        <Header />

        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfile /> : <Navigate to="/auth" />}
          />
          <Route path="/auth" element={user ? <HomePage /> : <AuthPage />} />

          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;
