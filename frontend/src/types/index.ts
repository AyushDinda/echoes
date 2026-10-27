export type AtmosphereType = 'subtle' | 'creepy' | 'gothic' | 'full_horror';
export type StoryLength = 'short' | 'medium' | 'long';
export type EndingStyle = 'ambiguous' | 'bittersweet' | 'twist' | 'hopeful';

export interface AiStatus {
  connected: boolean;
  model: string;
  mock_mode: boolean;
  message: string;
  available_models: string[];
}

export interface SessionEntry {
  id: string;
  session_id: string;
  command_text: string;
  commentary: string;
  atmosphere: AtmosphereType;
  is_mock: boolean;
  created_at: string;
}

export interface Story {
  id: string;
  session_id?: string;
  title: string;
  narrative: string;
  length: StoryLength;
  atmosphere: AtmosphereType;
  inspiration_type: 'session' | 'custom';
  inspiration_prompt?: string;
  ending_style: EndingStyle;
  is_mock: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  title: string;
  atmosphere: AtmosphereType;
  narrative_notes?: string;
  created_at: string;
  updated_at: string;
  entries: SessionEntry[];
  stories: Story[];
}

export interface SessionListItem {
  id: string;
  title: string;
  atmosphere: AtmosphereType;
  created_at: string;
  updated_at: string;
  command_count: number;
  has_story: boolean;
  latest_story_title?: string;
}

export interface CommentResponse {
  entry_id: string;
  session_id: string;
  command: string;
  commentary: string;
  atmosphere: AtmosphereType;
  is_mock: boolean;
  created_at: string;
}
