export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
}

export interface Channel {
  id: number;
  title: string;
}

export interface Message {
  id: number;
  author: User;
  content: string;
}
