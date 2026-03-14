import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchBookOpinions } from "@/lib/opinions";

function mockJsonResponse(data: any) {
  return {
    ok: true,
    json: async () => data,
  } as Response;
}

describe("fetchBookOpinions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns Open Library ratings and shelves when works are resolved via edition", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = typeof input === "string" ? input : input.url;

      if (url.includes("openlibrary.org/api/books")) {
        return mockJsonResponse({
          "ISBN:9789500427098": {
            key: "/books/OL12953857M",
          },
        });
      }

      if (url.includes("openlibrary.org/books/OL12953857M.json")) {
        return mockJsonResponse({
          works: [{ key: "/works/OL104883W" }],
        });
      }

      if (url.includes("openlibrary.org/works/OL104883W/ratings.json")) {
        return mockJsonResponse({
          summary: { average: 3.0, count: 2 },
        });
      }

      if (url.includes("openlibrary.org/works/OL104883W/bookshelves.json")) {
        return mockJsonResponse({
          counts: { want_to_read: 1, currently_reading: 0, already_read: 3 },
        });
      }

      if (url.includes("googleapis.com/books")) {
        return mockJsonResponse({ items: [] });
      }

      return { ok: false } as Response;
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchBookOpinions("9789500427098");
    expect(result).toBeTruthy();
    expect(result?.sources[0].source).toBe("openlibrary");
    expect(result?.sources[0].averageRating).toBe(3.0);
    expect(result?.sources[0].ratingsCount).toBe(2);
    expect(result?.sources[0].shelfCounts?.[0]).toEqual({ name: "already_read", count: 3 });
  });
});
