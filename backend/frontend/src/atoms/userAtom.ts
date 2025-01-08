import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
  default: localStorage.getItem("user-data")
    ? JSON.parse(localStorage.getItem("user-data")!)
    : null,
});

export default userAtom;
