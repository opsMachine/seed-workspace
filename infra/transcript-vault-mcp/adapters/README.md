# Recorder adapters

The transcript-vault is recorder-agnostic past the extract step. Everything downstream — `transform.ts`, `embed.ts`, `mcp-server.ts`, `prep-*.ts`, `apply-labels.ts` — operates on a single canonical schema (the `Meeting` type in [`../src/lib/types.ts`](../src/lib/types.ts)).

To support a new recorder, write one adapter that maps your recorder's API to that schema. That's it.

## Contract

An adapter is a TypeScript module that default-exports an object matching this shape:

```ts
export interface RecorderAdapter {
  /**
   * Display name (used in logs).
   */
  name: string;

  /**
   * Pull every meeting created since `sinceISO` (or all meetings if null).
   * Yields meetings one page at a time so the caller can checkpoint cursor
   * state without buffering the whole corpus in memory.
   *
   * Each yielded Meeting MUST conform to `src/lib/types.ts#Meeting`.
   * If your recorder doesn't expose a numeric ID, hash a stable string
   * (e.g. provider id + start time) into a number.
   */
  extract(params: {
    sinceISO: string | null;
    cursor: string | null;
  }): AsyncGenerator<{
    meetings: Meeting[];
    nextCursor: string | null;
  }>;
}
```

## Active adapter

The active adapter is selected by `RECORDER_ADAPTER` in `.env` (default: `fathom`). The dispatcher in [`index.ts`](index.ts) imports the matching file:

```
RECORDER_ADAPTER=fathom    →  adapters/fathom.ts     (shipped, working)
RECORDER_ADAPTER=otter     →  adapters/otter.ts      (rename .stub → .ts and finish)
RECORDER_ADAPTER=granola   →  adapters/granola.ts    (rename .stub → .ts and finish)
RECORDER_ADAPTER=fireflies →  adapters/fireflies.ts  (rename .stub → .ts and finish)
```

## Writing a new adapter

1. Copy one of the `.stub` files to `<recorder>.ts`.
2. Look up your recorder's "list meetings" / "list recordings" endpoint and pagination model.
3. Look up how to fetch the transcript + summary + participants per meeting (sometimes one call, sometimes one + one).
4. Map each meeting to the canonical `Meeting` shape. Required fields:
   - `recording_id` (number) — your provider's id, hashed if it's a string
   - `title` (string)
   - `url` (string) — direct link to the meeting page in your provider
   - `created_at`, `recording_start_time`, `recording_end_time` (ISO 8601 strings)
   - `transcript_language` (e.g. `"en"`)
   - `recorded_by` ({ name, email, team? })
   - `calendar_invitees` (array of { name, email, is_organizer })
   - `transcript` (array of { speaker: { name, email }, text, timestamp })
   - `default_summary` ({ template_name, markdown_formatted })
5. Set `RECORDER_ADAPTER=<recorder>` in `.env`.
6. Run `npm run extract` against a small window first (e.g. set `MAX_PAGES=1` if you add it).

## Why this design

The transcript-vault is most of the value: SQLite + FTS5 + LanceDB + the four MCP workflow prompts (`client_persona`, `sales_coaching`, `content_from_meetings`, `account_prep`) all run on the canonical schema. The recorder is the smallest, most replaceable piece. Don't pollute the downstream code with provider conditionals — just write a clean adapter and let the rest stay generic.
