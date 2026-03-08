import { get, post, put, del } from './client.ts';
import type { ApiResult, TrelloLabel } from '../types/index.ts';

export interface CreateLabelOptions {
  name: string;
  color: string;
  idBoard: string;
}

export interface UpdateLabelOptions {
  name?: string;
  color?: string;
}

export async function getLabel(labelId: string): Promise<ApiResult<TrelloLabel>> {
  return get<TrelloLabel>(`/labels/${labelId}`);
}

export async function createLabel(options: CreateLabelOptions): Promise<ApiResult<TrelloLabel>> {
  const params = new URLSearchParams();
  params.set('name', options.name);
  params.set('color', options.color);
  params.set('idBoard', options.idBoard);
  return post<TrelloLabel>(`/labels?${params.toString()}`);
}

export async function updateLabel(labelId: string, options: UpdateLabelOptions): Promise<ApiResult<TrelloLabel>> {
  const params = new URLSearchParams();
  if (options.name !== undefined) params.set('name', options.name);
  if (options.color !== undefined) params.set('color', options.color);
  return put<TrelloLabel>(`/labels/${labelId}?${params.toString()}`);
}

export async function deleteLabel(labelId: string): Promise<ApiResult<void>> {
  return del<void>(`/labels/${labelId}`);
}
