import Conversation from "@/components/Conversation";

import MessageContent from "@/components/MessageContent";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="flex w-full gap-7">
      {/* conversations */}
      <div className="hidden md:block md:basis-[30%] h-[470px] overflow-y-scroll custom-scroll">
        <h2 className="font-semibold mb-2">Your Conversations</h2>
        <form className="w-full">
          <div className="space-y-2">
            <div className="relative">
              <Input
                className="peer pe-9 ps-9"
                placeholder="Search..."
                type="search"
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Search size={16} strokeWidth={2} />
              </div>
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Submit search"
                type="submit"
              >
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>
        <div className="mt-4 ">
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
        </div>
      </div>

      {/* messages */}
      <div className="w-full md:basis-[70%]">
        {/* <EmptyMessage /> */}
        <MessageContent />
      </div>
    </div>
  );
};

export default ChatPage;
