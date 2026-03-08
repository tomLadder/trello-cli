import { get, post, put } from './client.ts';
import type { ApiResult, TrelloList, TrelloCard } from '../types/index.ts';

export interface CreateListOptions {
  name: string;
  idBoard: string;
  pos?: 'top' | 'bottom' | number;
}

export interface UpdateListOptions {
  name?: string;
  closed?: boolean;
  pos?: 'top' | 'bottom' | number;
}

export async function getList(listId: string): Promise<ApiResult<TrelloList>> {
  return get<TrelloList>(`/lists/${listId}?fields=id,name,closed,idBoard,pos`);
}

export async function createList(options: CreateListOptions): Promise<ApiResult<TrelloList>> {
  const params = new URLSearchParams();
  params.set('name', options.name);
  params.set('idBoard', options.idBoard);
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  return post<TrelloList>(`/lists?${params.toString()}`);
}

export async function updateList(listId: string, options: UpdateListOptions): Promise<ApiResult<TrelloList>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.closed !== undefined) params.set('closed', String(options.closed));
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  return put<TrelloList>(`/lists/${listId}?${params.toString()}`);
}

export async function archiveAllCards(listId: string): Promise<ApiResult<void>> {
  return post<void>(`/lists/${listId}/archiveAllCards`);
}

export async function moveAllCards(listId: string, idBoard: string, idList: string): Promise<ApiResult<void>> {
  const params = new URLSearchParams();
  params.set('idBoard', idBoard);
  params.set('idList', idList);
  return post<void>(`/lists/${listId}/moveAllCards?${params.toString()}`);
}

export async function getListCards(listId: string): Promise<ApiResult<TrelloCard[]>> {
  return get<TrelloCard[]>(`/lists/${listId}/cards`);
}
