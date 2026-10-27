import {
  AiStatus,
  Session,
  SessionListItem,
  CommentResponse,
  Story,
  AtmosphereType,
  StoryLength,
  EndingStyle
} from '../types';

const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const data = await res.json();
        if (data.detail) errMsg = data.detail;
        else if (data.message) errMsg = data.message;
      } catch {
        // use default error message
      }
      throw new ApiError(errMsg, res.status);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Unable to connect to backend server. Ensure the FastAPI backend is running.',
      0
    );
  }
}

export const api = {
  getHealth: () => request<{ status: string; service: string; timestamp: string }>('/health'),

  getAiStatus: () => request<AiStatus>('/ai/status'),

  createSession: (title?: string, atmosphere: AtmosphereType = 'creepy') =>
    request<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title, atmosphere }),
    }),

  listSessions: () => request<SessionListItem[]>('/sessions'),

  getSession: (id: string) => request<Session>(`/sessions/${id}`),

  deleteSession: (id: string) =>
    request<{ status: string; message: string }>(`/sessions/${id}`, {
      method: 'DELETE',
    }),

  clearSessionHistory: (id: string) =>
    request<{ status: string; message: string }>(`/sessions/${id}/history`, {
      method: 'DELETE',
    }),

  clearAllHistory: () =>
    request<{ status: string; message: string }>('/history', {
      method: 'DELETE',
    }),

  submitCommand: (sessionId: string, command: string, atmosphere?: AtmosphereType) =>
    request<CommentResponse>(`/sessions/${sessionId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ command, atmosphere }),
    }),

  generateStory: (
    sessionId: string,
    params: {
      length: StoryLength;
      atmosphere?: AtmosphereType;
      inspiration_type: 'session' | 'custom';
      custom_theme?: string;
      ending_style: EndingStyle;
    }
  ) =>
    request<Story>(`/sessions/${sessionId}/story`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};
