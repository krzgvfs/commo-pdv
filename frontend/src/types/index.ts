export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  groups: string[];
  [key: string]: any;
}