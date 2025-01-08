import { Post } from "@/utils/types";
import { atom } from "recoil";

const postsAtom = atom<Post[]>({
  key: "postsAtom",
  default: [],
});

export default postsAtom;
