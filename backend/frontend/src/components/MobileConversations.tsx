import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowRight, Menu, Search } from "lucide-react";
import Conversation from "./Conversation";
import { Input } from "./ui/input";
import { useRecoilValue } from "recoil";
import { conversationAtom } from "@/atoms/messageAtom";

const MobileConversations = () => {
  const conversations = useRecoilValue(conversationAtom);

  return (
    <Sheet>
      <SheetTrigger className="">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-scroll">
        <form className="w-full mt-6">
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
        <div className="mt-4 overflow-y-scroll">
          {conversations?.length === 0 && <p>No conversations found</p>}
          {conversations?.map((conversation) => (
            <Conversation key={conversation._id} conversation={conversation} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileConversations;
