/**
 * Generic extract entrypoint.
 *
 * Picks an adapter based on RECORDER_ADAPTER (default: "fathom"), then
 * runs the same dedup-and-checkpoint loop regardless of recorder.
 *
 * State (sync-state.json) is shared across adapters — if you switch
 * recorders, delete or move the existing sync-state.json first so the
 * downloaded_ids set isn't mistakenly applied to a different namespace.
 */

import { config } from "dotenv";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { loadAdapter } from "../adapters/index.js";
import type { Meeting, SyncState } from "./lib/types.js";
import { RAW_DIR, SYNC_STATE_PATH } from "./lib/paths.js";

config();

mkdirSync(RAW_DIR, { recursive: true });

function loadSyncState(): SyncState {
  if (existsSync(SYNC_STATE_PATH)) {
    return JSON.parse(readFileSync(SYNC_STATE_PATH, "utf-8"));
  }
  return {
    last_sync_at: null,
    last_cursor: null,
    downloaded_ids: [],
    total_downloaded: 0,
  };
}

function saveSyncState(state: SyncState): void {
  writeFileSync(SYNC_STATE_PATH, JSON.stringify(state, null, 2));
}

function saveMeeting(meeting: Meeting): void {
  const filePath = join(RAW_DIR, `${meeting.recording_id}.json`);
  writeFileSync(filePath, JSON.stringify(meeting, null, 2));
}

async function main() {
  const adapter = await loadAdapter();
  const state = loadSyncState();
  const existingIds = new Set(state.downloaded_ids);

  const isIncremental = !!state.last_sync_at;
  const syncStartedAt = new Date().toISOString();

  console.log(
    `Adapter: ${adapter.name} | ` +
      (isIncremental
        ? `incremental sync (after ${state.last_sync_at})`
        : "full sync")
  );

  let pageNum = 0;
  let newMeetings = 0;
  let skipped = 0;

  for await (const page of adapter.extract({
    sinceISO: isIncremental ? state.last_sync_at : null,
    cursor: state.last_cursor,
  })) {
    pageNum++;
    process.stdout.write(`  Page ${pageNum}...`);

    for (const meeting of page.meetings) {
      if (existingIds.has(meeting.recording_id)) {
        skipped++;
        continue;
      }
      saveMeeting(meeting);
      existingIds.add(meeting.recording_id);
      newMeetings++;
    }

    console.log(
      ` ${page.meetings.length} meetings (${newMeetings} new total, ${skipped} skipped)`
    );

    state.downloaded_ids = [...existingIds];
    state.total_downloaded = existingIds.size;
    state.last_cursor = page.nextCursor;
    saveSyncState(state);
  }

  state.last_sync_at = syncStartedAt;
  state.last_cursor = null;
  saveSyncState(state);

  console.log(
    `\nDone. ${newMeetings} new meetings via ${adapter.name}. ${state.total_downloaded} total on disk.`
  );
}

main().catch((err) => {
  console.error("Extraction failed:", err);
  process.exit(1);
});
