import { Avatar, AvatarImage } from "./ui/avatar";

const Conversation = () => {
  return (
    <div className="flex items-start gap-2 py-2 px-1 rounded-md hover:bg-gray-100 dark:hover:bg-stone-900">
      <div className={`relative inline-block`}>
        <Avatar>
          <AvatarImage src={"/images/user.jpg"} alt={"Avatar"} />
        </Avatar>

        <span className="absolute bottom-1 right-0 block size-2 rounded-full bg-green-500 ring-2 ring-white" />
      </div>
      <div>
        <div className="flex w-full items-center">
          <p className="text-sm font-bold">Asraful Islam</p>
          <img
            className="size-4 ml-1"
            src="/images/verify-2.png"
            alt="verify icon"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-stone-400 line-clamp-2">
          hey i am asraful do you remember me?
        </p>
      </div>
    </div>
  );
};

export default Conversation;
