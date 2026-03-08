import type { ApiResult, TrelloUser } from '../types/index.ts';
import { setAuth, clearAuth, getAuth } from '../store/config.ts';

const BASE_URL = 'https://api.trello.com/1';

export async function login(
  apiKey: string,
  token: string
): Promise<ApiResult<TrelloUser>> {
  try {
    // Verify credentials by fetching user info
    const url = `${BASE_URL}/members/me?key=${apiKey}&token=${token}`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || 'Invalid credentials' };
    }

    const user: TrelloUser = await response.json();

    // Save credentials
    await setAuth({ apiKey, token });

    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function logout(): Promise<void> {
  await clearAuth();
}

export async function getMe(): Promise<ApiResult<TrelloUser>> {
  const auth = await getAuth();

  if (!auth) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const url = `${BASE_URL}/members/me?key=${auth.apiKey}&token=${auth.token}`;
    const response = await fetch(url);

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch user info' };
    }

    const user: TrelloUser = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
