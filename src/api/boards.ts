import { get, post, put, del } from './client.ts';
import type { ApiResult, TrelloBoard, TrelloList, TrelloCard, TrelloUser, TrelloLabel, TrelloChecklist, TrelloCustomField } from '../types/index.ts';

export type BoardFilter = 'all' | 'closed' | 'members' | 'open' | 'organization' | 'public' | 'starred';

export interface CreateBoardOptions {
  name: string;
  desc?: string;
  idOrganization?: string;
  defaultLists?: boolean;
  defaultLabels?: boolean;
  prefs_permissionLevel?: 'org' | 'private' | 'public';
  prefs_background?: string;
  idBoardSource?: string;
  keepFromSource?: 'cards' | 'none';
}

export async function getBoards(
  filter: BoardFilter = 'all'
): Promise<ApiResult<TrelloBoard[]>> {
  return get<TrelloBoard[]>(
    `/members/me/boards?filter=${filter}&fields=id,name,desc,closed,url,shortUrl,idOrganization`
  );
}

export async function getBoard(boardId: string): Promise<ApiResult<TrelloBoard>> {
  return get<TrelloBoard>(`/boards/${boardId}?fields=id,name,desc,closed,url,shortUrl,idOrganization`);
}

export async function createBoard(options: CreateBoardOptions): Promise<ApiResult<TrelloBoard>> {
  const params = new URLSearchParams();
  params.set('name', options.name);
  if (options.desc !== undefined) params.set('desc', options.desc);
  if (options.idOrganization !== undefined) params.set('idOrganization', options.idOrganization);
  if (options.defaultLists !== undefined) params.set('defaultLists', String(options.defaultLists));
  if (options.defaultLabels !== undefined) params.set('defaultLabels', String(options.defaultLabels));
  if (options.prefs_permissionLevel !== undefined) params.set('prefs_permissionLevel', options.prefs_permissionLevel);
  if (options.prefs_background !== undefined) params.set('prefs_background', options.prefs_background);
  if (options.idBoardSource !== undefined) params.set('idBoardSource', options.idBoardSource);
  if (options.keepFromSource !== undefined) params.set('keepFromSource', options.keepFromSource);
  return post<TrelloBoard>(`/boards/?${params.toString()}`);
}

export interface UpdateBoardOptions {
  name?: string;
  desc?: string;
  closed?: boolean;
  idOrganization?: string;
  prefs_permissionLevel?: 'org' | 'private' | 'public';
  prefs_background?: string;
  prefs_selfJoin?: boolean;
  prefs_cardCovers?: boolean;
  prefs_voting?: 'disabled' | 'members' | 'observers' | 'org' | 'public';
  prefs_comments?: 'disabled' | 'members' | 'observers' | 'org' | 'public';
  prefs_invitations?: 'admins' | 'members';
}

export async function updateBoard(boardId: string, options: UpdateBoardOptions): Promise<ApiResult<TrelloBoard>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.desc !== undefined) params.set('desc', options.desc);
  if (options.closed !== undefined) params.set('closed', String(options.closed));
  if (options.idOrganization !== undefined) params.set('idOrganization', options.idOrganization);
  if (options.prefs_permissionLevel !== undefined) params.set('prefs/permissionLevel', options.prefs_permissionLevel);
  if (options.prefs_background !== undefined) params.set('prefs/background', options.prefs_background);
  if (options.prefs_selfJoin !== undefined) params.set('prefs/selfJoin', String(options.prefs_selfJoin));
  if (options.prefs_cardCovers !== undefined) params.set('prefs/cardCovers', String(options.prefs_cardCovers));
  if (options.prefs_voting !== undefined) params.set('prefs/voting', options.prefs_voting);
  if (options.prefs_comments !== undefined) params.set('prefs/comments', options.prefs_comments);
  if (options.prefs_invitations !== undefined) params.set('prefs/invitations', options.prefs_invitations);
  return put<TrelloBoard>(`/boards/${boardId}?${params.toString()}`);
}

export async function deleteBoard(boardId: string): Promise<ApiResult<void>> {
  return del<void>(`/boards/${boardId}`);
}

export async function getBoardLists(boardId: string, filter?: string): Promise<ApiResult<TrelloList[]>> {
  const params = filter ? `?filter=${filter}` : '';
  return get<TrelloList[]>(`/boards/${boardId}/lists${params}`);
}

export async function getBoardCards(boardId: string): Promise<ApiResult<TrelloCard[]>> {
  return get<TrelloCard[]>(`/boards/${boardId}/cards`);
}

export async function getBoardMembers(boardId: string): Promise<ApiResult<TrelloUser[]>> {
  return get<TrelloUser[]>(`/boards/${boardId}/members`);
}

export async function getBoardLabels(boardId: string): Promise<ApiResult<TrelloLabel[]>> {
  return get<TrelloLabel[]>(`/boards/${boardId}/labels`);
}

export async function getBoardChecklists(boardId: string): Promise<ApiResult<TrelloChecklist[]>> {
  return get<TrelloChecklist[]>(`/boards/${boardId}/checklists`);
}

export async function getBoardCustomFields(boardId: string): Promise<ApiResult<TrelloCustomField[]>> {
  return get<TrelloCustomField[]>(`/boards/${boardId}/customFields`);
}
