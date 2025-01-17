import { conversationAtom, selectedConversation } from "@/atoms/messageAtom";
import Conversation from "@/components/Conversation";
import EmptyMessage from "@/components/EmptyMessage";

import MessageContent from "@/components/MessageContent";
import MobileConversations from "@/components/MobileConversations";
import ConversationSkeleton from "@/components/skeletons/ConversersationSkeleton";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/lib/config";
import { ConversationType } from "@/utils/types";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { toast } from "sonner";

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const selectConversation = useRecoilValue(selectedConversation);
  const [conversations, setConversations] = useRecoilState<
    ConversationType[] | undefined
  >(conversationAtom);

  useEffect(() => {
    const getConversations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/messages/conversations`, {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        if (data.error) {
          setIsLoading(false);
          toast.error(data.error);
          return;
        }
        setIsLoading(false);

        setConversations(data);
      } catch (error) {
        setIsLoading(false);

        console.log(error);
      }
    };

    getConversations();
  }, [setConversations]);

  let content;
  if (isLoading) {
    content = (
      <>
        <ConversationSkeleton />
        <ConversationSkeleton />
        <ConversationSkeleton />
        <ConversationSkeleton />
        <ConversationSkeleton />
      </>
    );
  } else if (!isLoading && conversations?.length === 0) {
    content = (
      <p className="text-center text-gray-500">No conversations found.</p>
    );
  } else if (!isLoading && conversations && conversations?.length > 0) {
    content = conversations?.map((conversation) => (
      <Conversation key={conversation._id} conversation={conversation} />
    ));
  }

  return (
    <div className="flex w-full gap-7">
      {/* conversations */}
      <div className="hidden md:block md:basis-[30%] h-[470px] overflow-y-scroll custom-scroll px-2">
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
        <div className="mt-4 ">{content}</div>
      </div>

      {/* messages and mobile conversation ui */}
      <div className="w-full md:basis-[70%]">
        <div className="block md:hidden">
          <MobileConversations />
        </div>

        {selectConversation?._id ? <MessageContent /> : <EmptyMessage />}
      </div>
    </div>
  );
};

export default ChatPage;
