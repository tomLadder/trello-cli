export interface AuthSession {
  apiKey: string;
  token: string;
}

export interface Config {
  auth?: AuthSession;
  settings: {
    outputFormat: 'pretty' | 'json';
  };
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TrelloUser {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  url: string;
}

export interface TrelloList {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
}

export interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  closed: boolean;
  idList: string;
  idBoard: string;
  url: string;
  due?: string;
  labels: TrelloLabel[];
}

export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}
