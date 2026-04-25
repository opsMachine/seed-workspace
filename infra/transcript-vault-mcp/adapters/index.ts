/**
 * Recorder adapter dispatcher.
 *
 * Selects which adapter to use based on the RECORDER_ADAPTER env var
 * (default: "fathom"). Each adapter conforms to the RecorderAdapter
 * interface defined here.
 *
 * To add a new recorder, see ./README.md.
 */

import type { Meeting } from "../src/lib/types.js";

export interface RecorderAdapter {
  /** Display name; used in logs. */
  name: string;

  /**
   * Pull meetings created after `sinceISO` (or all meetings if null),
   * resuming from `cursor` if non-null. Yields one page at a time so
   * the caller can checkpoint after each page.
   */
  extract(params: {
    sinceISO: string | null;
    cursor: string | null;
  }): AsyncGenerator<{
    meetings: Meeting[];
    nextCursor: string | null;
  }>;
}

export async function loadAdapter(): Promise<RecorderAdapter> {
  const name = (process.env.RECORDER_ADAPTER ?? "fathom").trim().toLowerCase();

  switch (name) {
    case "fathom": {
      const mod = await import("./fathom.js");
      return mod.default;
    }
    case "otter":
    case "granola":
    case "fireflies":
      throw new Error(
        `Adapter "${name}" is shipped as a stub. Rename adapters/${name}.ts.stub → adapters/${name}.ts and finish the implementation. See adapters/README.md.`
      );
    default:
      throw new Error(
        `Unknown RECORDER_ADAPTER="${name}". Known: fathom, otter, granola, fireflies (and your own).`
      );
  }
}
