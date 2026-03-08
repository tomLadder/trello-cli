import { get, post, put, del } from './client.ts';
import type { ApiResult, TrelloCard, TrelloComment, TrelloAttachment, TrelloUser } from '../types/index.ts';

export interface CreateCardOptions {
  name: string;
  idList: string;
  desc?: string;
  due?: string;
  idLabels?: string;
  idMembers?: string;
}

export interface UpdateCardOptions {
  name?: string;
  desc?: string;
  closed?: boolean;
  idList?: string;
  due?: string;
  dueComplete?: boolean;
  isTemplate?: boolean;
}

export async function getCard(cardId: string): Promise<ApiResult<TrelloCard>> {
  return get<TrelloCard>(`/cards/${cardId}?fields=id,name,desc,closed,idList,idBoard,url,due,labels,isTemplate`);
}

export async function createCard(options: CreateCardOptions): Promise<ApiResult<TrelloCard>> {
  const params = new URLSearchParams();
  params.set('name', options.name);
  params.set('idList', options.idList);
  if (options.desc !== undefined) params.set('desc', options.desc);
  if (options.due !== undefined) params.set('due', options.due);
  if (options.idLabels !== undefined) params.set('idLabels', options.idLabels);
  if (options.idMembers !== undefined) params.set('idMembers', options.idMembers);
  return post<TrelloCard>(`/cards?${params.toString()}`);
}

export async function updateCard(cardId: string, options: UpdateCardOptions): Promise<ApiResult<TrelloCard>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.desc !== undefined) params.set('desc', options.desc);
  if (options.closed !== undefined) params.set('closed', String(options.closed));
  if (options.idList !== undefined) params.set('idList', options.idList);
  if (options.due !== undefined) params.set('due', options.due);
  if (options.dueComplete !== undefined) params.set('dueComplete', String(options.dueComplete));
  if (options.isTemplate !== undefined) params.set('isTemplate', String(options.isTemplate));
  return put<TrelloCard>(`/cards/${cardId}?${params.toString()}`);
}

export async function deleteCard(cardId: string): Promise<ApiResult<void>> {
  return del<void>(`/cards/${cardId}`);
}

// --- Comments ---

export async function getCardComments(cardId: string): Promise<ApiResult<TrelloComment[]>> {
  return get<TrelloComment[]>(`/cards/${cardId}/actions?filter=commentCard`);
}

export async function addCardComment(cardId: string, text: string): Promise<ApiResult<TrelloComment>> {
  const params = new URLSearchParams();
  params.set('text', text);
  return post<TrelloComment>(`/cards/${cardId}/actions/comments?${params.toString()}`);
}

export async function updateCardComment(cardId: string, actionId: string, text: string): Promise<ApiResult<TrelloComment>> {
  const params = new URLSearchParams();
  params.set('text', text);
  return put<TrelloComment>(`/cards/${cardId}/actions/${actionId}/comments?${params.toString()}`);
}

export async function deleteCardComment(cardId: string, actionId: string): Promise<ApiResult<void>> {
  return del<void>(`/cards/${cardId}/actions/${actionId}/comments`);
}

// --- Attachments ---

export async function getCardAttachments(cardId: string): Promise<ApiResult<TrelloAttachment[]>> {
  return get<TrelloAttachment[]>(`/cards/${cardId}/attachments`);
}

export async function addCardAttachment(cardId: string, options: { name?: string; url: string; setCover?: boolean }): Promise<ApiResult<TrelloAttachment>> {
  const params = new URLSearchParams();
  params.set('url', options.url);
  if (options.name !== undefined) params.set('name', options.name);
  if (options.setCover !== undefined) params.set('setCover', String(options.setCover));
  return post<TrelloAttachment>(`/cards/${cardId}/attachments?${params.toString()}`);
}

export async function deleteCardAttachment(cardId: string, attachmentId: string): Promise<ApiResult<void>> {
  return del<void>(`/cards/${cardId}/attachments/${attachmentId}`);
}

// --- Members ---

export async function getCardMembers(cardId: string): Promise<ApiResult<TrelloUser[]>> {
  return get<TrelloUser[]>(`/cards/${cardId}/members`);
}

export async function addCardMember(cardId: string, memberId: string): Promise<ApiResult<void>> {
  const params = new URLSearchParams();
  params.set('value', memberId);
  return post<void>(`/cards/${cardId}/idMembers?${params.toString()}`);
}

export async function removeCardMember(cardId: string, memberId: string): Promise<ApiResult<void>> {
  return del<void>(`/cards/${cardId}/idMembers/${memberId}`);
}

// --- Labels ---

export async function addCardLabel(cardId: string, labelId: string): Promise<ApiResult<void>> {
  const params = new URLSearchParams();
  params.set('value', labelId);
  return post<void>(`/cards/${cardId}/idLabels?${params.toString()}`);
}

export async function removeCardLabel(cardId: string, labelId: string): Promise<ApiResult<void>> {
  return del<void>(`/cards/${cardId}/idLabels/${labelId}`);
}
