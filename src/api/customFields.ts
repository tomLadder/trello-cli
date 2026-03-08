import { get, post, put, del } from './client.ts';
import type { ApiResult, TrelloCustomField, TrelloCustomFieldOption, TrelloCustomFieldItem } from '../types/index.ts';

// --- Custom Field Definition Interfaces ---

export interface CreateCustomFieldOptions {
  idModel: string;
  name: string;
  type: 'checkbox' | 'list' | 'number' | 'text' | 'date';
  pos?: 'top' | 'bottom' | number;
  display_cardFront?: boolean;
}

export interface UpdateCustomFieldOptions {
  name?: string;
  pos?: 'top' | 'bottom' | number;
  'display/cardFront'?: boolean;
}

// --- Custom Field Definitions ---

export async function getCustomField(id: string): Promise<ApiResult<TrelloCustomField>> {
  return get<TrelloCustomField>(`/customFields/${id}`);
}

export async function createCustomField(options: CreateCustomFieldOptions): Promise<ApiResult<TrelloCustomField>> {
  const body = {
    idModel: options.idModel,
    modelType: 'board',
    name: options.name,
    type: options.type,
    pos: options.pos || 'bottom',
    display_cardFront: options.display_cardFront ?? true,
  };
  return post<TrelloCustomField>('/customFields', body);
}

export async function updateCustomField(id: string, options: UpdateCustomFieldOptions): Promise<ApiResult<TrelloCustomField>> {
  const body: Record<string, unknown> = {};
  if (options.name !== undefined) body.name = options.name;
  if (options.pos !== undefined) body.pos = options.pos;
  if (options['display/cardFront'] !== undefined) body['display/cardFront'] = options['display/cardFront'];
  return put<TrelloCustomField>(`/customFields/${id}`, body);
}

export async function deleteCustomField(id: string): Promise<ApiResult<void>> {
  return del<void>(`/customFields/${id}`);
}

// --- Custom Field Options (for dropdown/list type) ---

export async function getCustomFieldOptions(id: string): Promise<ApiResult<TrelloCustomFieldOption[]>> {
  return get<TrelloCustomFieldOption[]>(`/customFields/${id}/options`);
}

export async function addCustomFieldOption(
  id: string,
  value: string,
  color?: string,
  pos?: 'top' | 'bottom' | number
): Promise<ApiResult<TrelloCustomFieldOption>> {
  const body: Record<string, unknown> = {
    value: { text: value },
  };
  if (color !== undefined) body.color = color;
  if (pos !== undefined) body.pos = pos;
  else body.pos = 'bottom';
  return post<TrelloCustomFieldOption>(`/customFields/${id}/options`, body);
}

export async function deleteCustomFieldOption(id: string, optionId: string): Promise<ApiResult<void>> {
  return del<void>(`/customFields/${id}/options/${optionId}`);
}

// --- Card Custom Field Values ---

export async function getCardCustomFieldItems(cardId: string): Promise<ApiResult<TrelloCustomFieldItem[]>> {
  return get<TrelloCustomFieldItem[]>(`/cards/${cardId}/customFieldItems`);
}

export async function setCardCustomFieldValue(
  cardId: string,
  customFieldId: string,
  value: { text?: string; number?: string; checked?: string; date?: string } | { idValue: string }
): Promise<ApiResult<TrelloCustomFieldItem>> {
  let body: object;
  if ('idValue' in value) {
    body = { idValue: value.idValue };
  } else {
    body = { value };
  }
  return put<TrelloCustomFieldItem>(`/cards/${cardId}/customField/${customFieldId}/item`, body);
}
