import { get } from './client.ts';
import type { ApiResult, TrelloBoard, TrelloCard, TrelloUser } from '../types/index.ts';

export interface SearchOptions {
  query: string;
  idBoards?: string;
  idOrganizations?: string;
  modelTypes?: string;
  cards_limit?: number;
  cards_page?: number;
  boards_limit?: number;
  partial?: boolean;
}

export interface SearchResult {
  cards: TrelloCard[];
  boards: TrelloBoard[];
}

export interface SearchMembersOptions {
  query: string;
  limit?: number;
  idBoard?: string;
  idOrganization?: string;
}

export async function search(options: SearchOptions): Promise<ApiResult<SearchResult>> {
  const params = new URLSearchParams();
  params.set('query', options.query);
  if (options.idBoards !== undefined) params.set('idBoards', options.idBoards);
  if (options.idOrganizations !== undefined) params.set('idOrganizations', options.idOrganizations);
  if (options.modelTypes !== undefined) params.set('modelTypes', options.modelTypes);
  if (options.cards_limit !== undefined) params.set('cards_limit', String(options.cards_limit));
  if (options.cards_page !== undefined) params.set('cards_page', String(options.cards_page));
  if (options.boards_limit !== undefined) params.set('boards_limit', String(options.boards_limit));
  if (options.partial !== undefined) params.set('partial', String(options.partial));
  return get<SearchResult>(`/search?${params.toString()}`);
}

export async function searchMembers(options: SearchMembersOptions): Promise<ApiResult<TrelloUser[]>> {
  const params = new URLSearchParams();
  params.set('query', options.query);
  if (options.limit !== undefined) params.set('limit', String(options.limit));
  if (options.idBoard !== undefined) params.set('idBoard', options.idBoard);
  if (options.idOrganization !== undefined) params.set('idOrganization', options.idOrganization);
  return get<TrelloUser[]>(`/search/members/?${params.toString()}`);
}
