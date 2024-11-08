export interface ApiToken {
  type: 'bearer';
  token: string;
  expires_at?: string;
  expires_in?: number;
}

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirmation: string;

  nickName: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
