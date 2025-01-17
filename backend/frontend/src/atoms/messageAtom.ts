import { ConversationType } from "@/utils/types";
import { atom } from "recoil";

export const conversationAtom = atom<ConversationType[] | undefined>({
  key: "conversationAtom",
  default: [],
});

export const selectedConversation = atom({
  key: "selectedConversation",
  default: {
    _id: "",
    userId: "",
    username: "",
    profilePic: "",
  },
});
