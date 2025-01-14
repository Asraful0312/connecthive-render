import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { BASE_URL } from "@/lib/config";
import { Comment } from "@/utils/types";

interface IProps {
  postId: string;
  setComments: (newComments: Comment[]) => void;
}

const CreateComment = ({ postId, setComments }: IProps) => {
  const user = useRecoilValue(userAtom);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");

  const handleReply = async () => {
    if (!user) return toast.info("You must be logged in to reply to a post");
    if (isReplying) return;
    if (reply === "") return toast.info("Cannot add empty reply!");
    setIsReplying(true);
    try {
      const res = await fetch(`${BASE_URL}/api/posts/reply/` + postId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return toast.error(data.error);

      console.log("data", data);

      setComments(data?.replies.reverse());
      toast.success("Reply posted successfully");

      setReply("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsReplying(false);
    }
  };
  return (
    <>
      <div className="mb-5">
        <div className="space-y-2">
          <Label htmlFor="input-26">Enter your comment</Label>
          <div className="relative">
            <Input
              id="input-26"
              className="peer pe-9 shadow-none"
              placeholder="Comment..."
              onChange={(e) => setReply(e.target.value)}
              value={reply}
              type="search"
              onKeyDown={(e) => {
                if (isReplying) {
                  return;
                }
                if (e.key === "Enter") {
                  handleReply();
                }
              }}
              disabled={isReplying}
            />
            <button
              onClick={handleReply}
              disabled={isReplying}
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="button"
            >
              {isReplying ? (
                <Loader2 className="size-4 shrink-0 animate-spin" />
              ) : (
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateComment;
