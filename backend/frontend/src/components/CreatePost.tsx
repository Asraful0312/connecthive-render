import { Image, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEvent, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { toast } from "sonner";
import { TextMorph } from "./ui/text-morph";
import { BorderTrail } from "./ui/border-trail";
import { TextShimmer } from "./ui/text-shimmer";
import { EnhancedButton } from "./ui/enhancedButton";
import postsAtom from "@/atoms/postAtom";
import { BASE_URL } from "@/lib/config";
import { useNavigate, useParams } from "react-router-dom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postText, setPostText] = useState("");
  const [selectedFile, setSelectedFile] = useState<
    string | ArrayBuffer | null | File
  >(null);
  const [loading, setLoading] = useState(false);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // New state for dialog
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const baseUrl = BASE_URL;
  const { username } = useParams();
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setSelectedFile(base64String); // Send this to your backend
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    if (text.length > MAX_CHAR) {
      const truncatedText = text.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(text);
      setRemainingChar(MAX_CHAR - text.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/posts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: currentUser._id,
          text: postText,
          img: selectedFile,
        }),
        credentials: "include",
      });
      const data = await res.json();

      if (data.error) {
        setLoading(false);
        toast.error(data.error);
        return;
      }
      if (user.username !== username) {
        navigate(`/${user.username}`);
      }
      setPosts([data, ...posts]);
      setLoading(false);
      toast.success("Post created successfully");
      setPostText("");
      setImagePreview(null);
      setSelectedFile(null);

      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="fixed bottom-10 right-10">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <EnhancedButton
            onClick={() => setIsDialogOpen(true)}
            className="font-semibold flex items-center gap-1"
            effect="shine"
            size="icon"
          >
            <Plus className="shrink-0 size-7" />
          </EnhancedButton>
        </DialogTrigger>
        <BorderTrail
          style={{
            boxShadow:
              "0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)",
          }}
          size={100}
        />
        <DialogContent className="sm:max-w-[625px] max-h-screen">
          {loading && (
            <TextShimmer
              className="font-mono text-sm ml-4 text-center"
              duration={1}
            >
              Please wait...
            </TextShimmer>
          )}
          <DialogHeader>
            <DialogTitle className="text-zinc-900 dark:text-white">
              Create a post
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              Enter text or image to post.
            </DialogDescription>
          </DialogHeader>
          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreatePost();
            }}
          >
            <Textarea
              onChange={handleTextChange}
              rows={3}
              value={postText}
              placeholder="Enter your post text..."
            />
            <div className="flex justify-end">
              <p className="text-xs text-black dark:text-gray-400 mt-1">
                <span
                  className={`${remainingChar === 0 ? "text-red-500" : ""}`}
                >
                  {remainingChar}
                </span>
                /{MAX_CHAR}
              </p>
            </div>

            <div className="mt-4">
              <Label htmlFor="avatar" className="cursor-pointer inline-block">
                <Image className="text-black dark:text-white" />
              </Label>
              <Input
                id="avatar"
                name="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />

              {imagePreview && (
                <figure className="relative mt-4">
                  <Button
                    onClick={removeImage}
                    className="size-5 absolute right-2 top-2"
                    size="icon"
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </Button>
                  <img
                    className="w-full object-cover rounded-md max-h-[200px]"
                    src={imagePreview}
                    alt="Selected Preview"
                  />
                </figure>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <Button
                disabled={loading}
                type="submit"
                className="font-semibold"
              >
                <TextMorph>{loading ? "Posting..." : "Post"}</TextMorph>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
