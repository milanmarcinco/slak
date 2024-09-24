export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Channel {
  id: number;
  title: string;
  unread?: boolean;
}

export interface Message {
  id: number;
  author: User;
  content: string;
}
