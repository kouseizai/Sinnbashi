export type Channel = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  verified?: boolean;
};

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  uploadedAt: string;
  channelId: string;
  description: string;
  likes: string;
  category: string;
};

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: string;
  replies?: number;
  pinned?: boolean;
  creatorHearted?: boolean;
  isCreator?: boolean;
  verified?: boolean;
};

export type Short = {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
};
