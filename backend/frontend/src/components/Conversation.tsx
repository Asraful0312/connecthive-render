import { BsCheck2All } from "react-icons/bs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ConversationType } from "@/utils/types";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";
import { selectedConversation } from "@/atoms/messageAtom";

type Props = {
  conversation: ConversationType;
};

const Conversation = ({ conversation }: Props) => {
  const currentUser = useRecoilValue(userAtom);
  const [selectConversation, setSelectConversation] =
    useRecoilState(selectedConversation);
  const { lastMessage, participants, _id } = conversation || {};
  const newParticipant = participants[0] || [];

  console.log("selected", selectConversation);

  return (
    <div
      onClick={() =>
        setSelectConversation({
          _id,
          username: newParticipant?.username,
          profilePic: newParticipant?.profilePic,
          userId: newParticipant._id,
        })
      }
      className={`flex items-start gap-2 py-2 px-1 mt-1 rounded-md  ${
        selectConversation._id === _id
          ? "bg-gray-100 dark:bg-stone-900 "
          : "hover:bg-gray-100 dark:hover:bg-stone-900"
      }`}
    >
      <div className={`relative inline-block`}>
        <Avatar>
          <AvatarImage
            src={newParticipant?.profilePic || "/images/user.jpg"}
            alt={newParticipant?.username || "avatar"}
          />
        </Avatar>

        <span className="absolute bottom-1 right-0 block size-2 rounded-full bg-green-500 ring-2 ring-white" />
      </div>
      <div>
        <div className="flex w-full items-center">
          <p className="text-sm font-bold">{newParticipant?.username}</p>
          <img
            className="size-4 ml-1"
            src={
              newParticipant?.username === "asrafulislam"
                ? "/images/verify-2.png"
                : "/images/verify.png"
            }
            alt="verify icon"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-stone-400 line-clamp-2 flex items-center gap-1">
          {currentUser._id === lastMessage.sender && (
            <BsCheck2All className="size-3 text-purple-600 dark:text-purple-400" />
          )}
          {lastMessage?.text}
        </p>
      </div>
    </div>
  );
};

export default Conversation;
