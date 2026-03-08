import { get, post, put, del } from './client.ts';
import type { ApiResult, TrelloChecklist, TrelloCheckItem } from '../types/index.ts';

export interface CreateChecklistOptions {
  idCard: string;
  name?: string;
  pos?: 'top' | 'bottom' | number;
  idChecklistSource?: string;
}

export interface UpdateChecklistOptions {
  name?: string;
  pos?: 'top' | 'bottom' | number;
}

export interface CreateCheckItemOptions {
  name: string;
  pos?: 'top' | 'bottom' | number;
  checked?: boolean;
  due?: string;
  idMember?: string;
}

export interface UpdateCheckItemOptions {
  name?: string;
  state?: 'complete' | 'incomplete';
  pos?: 'top' | 'bottom' | number;
  due?: string;
  idMember?: string;
}

export async function getChecklist(checklistId: string): Promise<ApiResult<TrelloChecklist>> {
  return get<TrelloChecklist>(`/checklists/${checklistId}`);
}

export async function createChecklist(options: CreateChecklistOptions): Promise<ApiResult<TrelloChecklist>> {
  const params = new URLSearchParams();
  params.set('idCard', options.idCard);
  if (options.name !== undefined) params.set('name', options.name);
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  if (options.idChecklistSource !== undefined) params.set('idChecklistSource', options.idChecklistSource);
  return post<TrelloChecklist>(`/checklists?${params.toString()}`);
}

export async function updateChecklist(checklistId: string, options: UpdateChecklistOptions): Promise<ApiResult<TrelloChecklist>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  return put<TrelloChecklist>(`/checklists/${checklistId}?${params.toString()}`);
}

export async function deleteChecklist(checklistId: string): Promise<ApiResult<void>> {
  return del<void>(`/checklists/${checklistId}`);
}

export async function getCheckItems(checklistId: string): Promise<ApiResult<TrelloCheckItem[]>> {
  return get<TrelloCheckItem[]>(`/checklists/${checklistId}/checkItems`);
}

export async function createCheckItem(checklistId: string, options: CreateCheckItemOptions): Promise<ApiResult<TrelloCheckItem>> {
  const params = new URLSearchParams();
  params.set('name', options.name);
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  if (options.checked !== undefined) params.set('checked', String(options.checked));
  if (options.due !== undefined) params.set('due', options.due);
  if (options.idMember !== undefined) params.set('idMember', options.idMember);
  return post<TrelloCheckItem>(`/checklists/${checklistId}/checkItems?${params.toString()}`);
}

export async function deleteCheckItem(checklistId: string, checkItemId: string): Promise<ApiResult<void>> {
  return del<void>(`/checklists/${checklistId}/checkItems/${checkItemId}`);
}

export async function updateCheckItem(cardId: string, checkItemId: string, options: UpdateCheckItemOptions): Promise<ApiResult<TrelloCheckItem>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.state !== undefined) params.set('state', options.state);
  if (options.pos !== undefined) params.set('pos', String(options.pos));
  if (options.due !== undefined) params.set('due', options.due);
  if (options.idMember !== undefined) params.set('idMember', options.idMember);
  return put<TrelloCheckItem>(`/cards/${cardId}/checkItem/${checkItemId}?${params.toString()}`);
}
