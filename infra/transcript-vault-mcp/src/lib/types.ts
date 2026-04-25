/**
 * Canonical schema produced by every recorder adapter.
 *
 * Originally derived from the Fathom REST API response shape; treat it
 * as the contract every `adapters/<recorder>.ts` must fill. If your
 * recorder's API returns a different structure, map it into this shape
 * inside the adapter — DO NOT add provider conditionals downstream.
 *
 * Per-field requirements (in adapters/README.md too):
 *
 *   recording_id  REQUIRED, number. Used as the on-disk filename
 *                 (`data/raw/<id>.json`, `vault/Meetings/<id>.md`).
 *                 If your recorder uses a string ID, hash it to a
 *                 stable number (cyrb53 / fnv1a / whatever).
 *
 *   title         REQUIRED. Display title for the meeting.
 *   url           REQUIRED. Direct link to the meeting in your provider's UI.
 *   created_at    REQUIRED ISO-8601 UTC. Used for chronological ordering.
 *   recording_*_time  REQUIRED ISO-8601 UTC.
 *   transcript_language  REQUIRED, BCP-47 (e.g. "en", "en-US").
 *   recorded_by   REQUIRED. The person who owned the recording.
 *   calendar_invitees   REQUIRED (may be empty array).
 *
 *   share_url     OPTIONAL. Public-share-link variant of `url`. If your
 *                 recorder doesn't have a separate share link, set equal
 *                 to `url` or leave undefined.
 *   meeting_title OPTIONAL. Calendar event title (often differs from
 *                 the recorder-assigned title). Falls back to `title`.
 *   default_summary  OPTIONAL. If your recorder produces a summary,
 *                    pass it through. Otherwise leave undefined and the
 *                    summary-related MCP prompts will degrade gracefully.
 *   transcript    OPTIONAL but strongly recommended. The whole point.
 *   action_items  OPTIONAL, recorder-specific blob. Stored as-is.
 *   scheduled_*_time, calendar_invitees_domains_type — OPTIONAL.
 *
 *   _raw          OPTIONAL. Adapters may stash the original recorder
 *                 response here (untyped) for debugging or future use.
 *                 Downstream code MUST NOT read from `_raw`.
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
  // REQUIRED
  recording_id: number;
  title: string;
  url: string;
  created_at: string;
  recording_start_time: string;
  recording_end_time: string;
  transcript_language: string;
  recorded_by: RecordedBy;
  calendar_invitees: CalendarInvitee[];

  // OPTIONAL — adapters fill what their recorder provides
  meeting_title?: string | null;
  share_url?: string;
  scheduled_start_time?: string | null;
  scheduled_end_time?: string | null;
  calendar_invitees_domains_type?: string | null;
  transcript?: TranscriptItem[];
  default_summary?: MeetingSummary | null;
  action_items?: unknown;

  // ESCAPE HATCH — adapters MAY stash original response here.
  // Downstream code MUST NOT read from this.
  _raw?: unknown;
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
