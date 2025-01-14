import { IoMdSend } from "react-icons/io";
import { Input } from "./ui/input";

const MessageInput = () => {
  return (
    <form className="mt-1">
      <div className="relative">
        <Input className="pe-9" placeholder="Write your message" type="text" />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg border border-transparent text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Subscribe"
        >
          <IoMdSend
            className="text-purple-500"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
