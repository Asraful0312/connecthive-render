export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  followers: string[];
  following: string[];
  bio: string;
  createdAt: string;
  __v: number;
};

export type Post = {
  _id: string;
  postedBy: string;
  text: string;
  img: {
    url: string;
    public_id: string;
  };
  likes: string[];
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Reply = {
  userId: string;
  text: string;
  userProfilePic: string;
  username: string;
  _id: string;
};

export type Comment = {
  userId: string;
  text: string;
  userProfilePic: string;
  username: string;
  _id: string;
};
