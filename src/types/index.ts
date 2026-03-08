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
  shortUrl?: string;
  idOrganization?: string;
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
  isTemplate?: boolean;
}

export interface TrelloLabel {
  id: string;
  name: string;
  color: string;
}

export interface TrelloCheckItem {
  id: string;
  name: string;
  state: 'complete' | 'incomplete';
  pos: number;
  due?: string;
  idMember?: string;
  idChecklist: string;
}

export interface TrelloChecklist {
  id: string;
  name: string;
  idBoard: string;
  idCard: string;
  pos: number;
  checkItems: TrelloCheckItem[];
}

export interface TrelloComment {
  id: string;
  data: {
    text: string;
  };
  date: string;
  memberCreator: {
    id: string;
    username: string;
    fullName: string;
  };
}

export interface TrelloAttachment {
  id: string;
  name: string;
  url: string;
  bytes: number;
  date: string;
  mimeType?: string;
  isUpload: boolean;
}

export interface TrelloCustomField {
  id: string;
  idModel: string;
  modelType: string;
  name: string;
  type: 'checkbox' | 'list' | 'number' | 'text' | 'date';
  pos: number;
  display: {
    cardFront: boolean;
  };
  options?: TrelloCustomFieldOption[];
}

export interface TrelloCustomFieldOption {
  id: string;
  idCustomField: string;
  value: {
    text: string;
  };
  color?: string;
  pos: number;
}

export interface TrelloCustomFieldItem {
  id: string;
  idCustomField: string;
  idModel: string;
  modelType: string;
  value?: {
    text?: string;
    number?: string;
    checked?: string;
    date?: string;
  };
  idValue?: string;
}
