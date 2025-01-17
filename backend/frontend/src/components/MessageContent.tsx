import Message from "./Message";
import MessageInput from "./MessageInput";
import { Avatar, AvatarImage } from "./ui/avatar";

const MessageContent = () => {
  const isMessageLoading = false;
  return (
    <div>
      {/* message header */}
      <div className="p-2 border-b w-full flex gap-2">
        <Avatar className="size-8">
          <AvatarImage className="" src={"/images/user.jpg"} alt={"Avatar"} />
        </Avatar>

        <div className="flex w-full items-center">
          <p className="text-sm font-bold">Asraful Islam</p>
          <img
            className="size-4 ml-1"
            src="/images/verify-2.png"
            alt="verify icon"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-4 h-[60dvh] overflow-y-scroll px-3 w-full custom-scroll ">
        {isMessageLoading &&
          [...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`flex gap-2 items-start rounded-md animate-pulse ${
                index % 2 === 0 ? "self-start" : "self-end"
              }`}
            >
              {index % 2 === 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-stone-500"></div>
              )}

              <div className="flex-1 space-y-2">
                <div className="h-3 w-[200px] bg-gray-300 dark:bg-stone-500 rounded-md"></div>
                <div className="h-3 w-[200px] bg-gray-300 dark:bg-stone-500 rounded-md"></div>
              </div>

              {index % 2 !== 0 && (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-stone-500"></div>
              )}
            </div>
          ))}

        <Message ownMessage={false} />
        <Message ownMessage={false} />
        <Message ownMessage />
        <Message ownMessage={false} />

        <Message ownMessage />
        <Message ownMessage />
        <Message ownMessage />
      </div>

      <MessageInput />
    </div>
  );
};

export default MessageContent;
