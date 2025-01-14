import { Avatar, AvatarImage } from "./ui/avatar";

type Props = {
  ownMessage: boolean;
};

const Message = ({ ownMessage }: Props) => {
  return (
    <div>
      {ownMessage ? (
        <div className={`flex gap-2 justify-end w-full`}>
          <p
            className={`max-w-[280px] ${
              ownMessage
                ? "bg-purple-500 p-2 rounded-md dark:text-white text-white"
                : ""
            }`}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quis
            esse, eveniet blanditiis corporis animi!
          </p>
          <Avatar>
            <AvatarImage src={"/images/user.jpg"} alt={"Avatar"} />
          </Avatar>
        </div>
      ) : (
        <div className="flex gap-2 justify-start w-full">
          <Avatar>
            <AvatarImage src={"/images/user.jpg"} alt={"Avatar"} />
          </Avatar>
          <p
            className={`max-w-[280px] ${
              !ownMessage
                ? "dark:bg-[#27272a] bg-[#f4f4f5] p-2 rounded-md dark:text-white text-dark"
                : ""
            }`}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa quis
            esse, eveniet blanditiis corporis animi!
          </p>
        </div>
      )}
    </div>
  );
};

export default Message;
