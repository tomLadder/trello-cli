import { getAuth } from '../store/config.ts';
import type { ApiResult } from '../types/index.ts';

const BASE_URL = 'https://api.trello.com/1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const auth = await getAuth();

  if (!auth) {
    return { success: false, error: 'Not authenticated' };
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('key', auth.apiKey);
  url.searchParams.set('token', auth.token);

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function get<T>(endpoint: string): Promise<ApiResult<T>> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function post<T>(
  endpoint: string,
  body?: object
): Promise<ApiResult<T>> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function put<T>(
  endpoint: string,
  body?: object
): Promise<ApiResult<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T>(endpoint: string): Promise<ApiResult<T>> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}
