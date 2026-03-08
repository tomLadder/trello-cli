import { get } from './client.ts';
import type { ApiResult, TrelloBoard } from '../types/index.ts';

export type BoardFilter = 'all' | 'closed' | 'members' | 'open' | 'organization' | 'public' | 'starred';

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
