/**
 * Fathom adapter — pulls meetings from the Fathom REST API.
 *
 * Requires:
 *   FATHOM_API_KEY  — issue from https://app.fathom.video/settings/integrations
 *
 * Endpoint: https://api.fathom.ai/external/v1/meetings
 * Rate limit: 60/min — we throttle to 55/min and back off on 429.
 */

import pThrottle from "p-throttle";
import type { Meeting, MeetingListResponse } from "../src/lib/types.js";
import type { RecorderAdapter } from "./index.js";

const BASE_URL = "https://api.fathom.ai/external/v1";

function createFathomClient(apiKey: string) {
  const throttle = pThrottle({ limit: 55, interval: 60_000 });

  const throttledFetch = throttle(async (url: string) => {
    const res = await fetch(url, { headers: { "X-Api-Key": apiKey } });

    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 10_000;
      console.log(`  Rate limited. Waiting ${waitMs / 1000}s...`);
      await new Promise((r) => setTimeout(r, waitMs));
      return fetch(url, { headers: { "X-Api-Key": apiKey } });
    }

    if (!res.ok) {
      throw new Error(`Fathom API ${res.status}: ${await res.text()}`);
    }

    return res;
  });

  async function listMeetings(params: {
    cursor?: string;
    createdAfter?: string;
    includeTranscript?: boolean;
    includeSummary?: boolean;
  }): Promise<MeetingListResponse> {
    const url = new URL(`${BASE_URL}/meetings`);
    if (params.cursor) url.searchParams.set("cursor", params.cursor);
    if (params.createdAfter)
      url.searchParams.set("created_after", params.createdAfter);
    if (params.includeTranscript)
      url.searchParams.set("include_transcript", "true");
    if (params.includeSummary)
      url.searchParams.set("include_summary", "true");

    const res = await throttledFetch(url.toString());
    return (await res.json()) as MeetingListResponse;
  }

  return { listMeetings };
}

const adapter: RecorderAdapter = {
  name: "fathom",

  async *extract({ sinceISO, cursor }) {
    const apiKey = process.env.FATHOM_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing FATHOM_API_KEY in .env (required by adapters/fathom.ts)"
      );
    }

    const client = createFathomClient(apiKey);
    let next: string | undefined = cursor ?? undefined;

    do {
      const response = await client.listMeetings({
        cursor: next,
        createdAfter: sinceISO ?? undefined,
        includeTranscript: true,
        includeSummary: true,
      });

      yield {
        meetings: response.items as Meeting[],
        nextCursor: response.next_cursor,
      };

      next = response.next_cursor ?? undefined;
    } while (next);
  },
};

export default adapter;
