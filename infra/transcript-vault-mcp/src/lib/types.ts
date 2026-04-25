/**
 * Canonical schema produced by every recorder adapter.
 *
 * Originally derived from the Fathom REST API response shape; treat it
 * as the contract every `adapters/<recorder>.ts` must fill. If your
 * recorder's API returns a different structure, map it into this shape
 * inside the adapter — DO NOT add provider conditionals downstream.
 *
 * See adapters/README.md for the per-field requirements.
 */

export interface TranscriptSpeaker {
  name: string | null;
  email: string | null;
}

export interface TranscriptItem {
  speaker: TranscriptSpeaker;
  text: string;
  timestamp: string;
}

export interface CalendarInvitee {
  name: string | null;
  email: string;
  is_organizer: boolean;
}

export interface RecordedBy {
  name: string;
  email: string;
  team: string | null;
}

export interface MeetingSummary {
  template_name: string;
  markdown_formatted: string;
}

export interface Meeting {
  recording_id: number;
  title: string;
  meeting_title: string | null;
  url: string;
  share_url: string;
  created_at: string;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
  recording_start_time: string;
  recording_end_time: string;
  calendar_invitees_domains_type?: string | null;
  transcript_language: string;
  recorded_by: RecordedBy;
  calendar_invitees: CalendarInvitee[];
  transcript?: TranscriptItem[];
  default_summary?: MeetingSummary | null;
  action_items?: unknown;
}

export interface MeetingListResponse {
  limit: number;
  next_cursor: string | null;
  items: Meeting[];
}

export interface SyncState {
  last_sync_at: string | null;
  last_cursor: string | null;
  downloaded_ids: number[];
  total_downloaded: number;
}
