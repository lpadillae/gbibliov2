import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchBookMetadata } from "@/lib/metadata";

function mockJsonResponse(data: any) {
  return {
    ok: true,
    json: async () => data,
  } as Response;
}

describe("fetchBookMetadata", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back from Google to Open Library and returns normalized metadata", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo) => {
      const url = typeof input === "string" ? input : input.url;

      if (url.includes("googleapis.com/books")) {
        return mockJsonResponse({ items: [] });
      }

      if (url.includes("openlibrary.org/api/books")) {
        return mockJsonResponse({
          "ISBN:9789500427098": {
            title: "Los Conjurados",
            authors: [{ name: "Jorge Luis Borges" }],
            notes: "Short stories collection.",
            number_of_pages: 94,
            cover: { medium: "https://covers.openlibrary.org/b/id/3344616-M.jpg" },
          },
        });
      }

      return { ok: false } as Response;
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchBookMetadata("978-950-0427098");
    expect(result?.title).toBe("Los Conjurados");
    expect(result?.author).toBe("Jorge Luis Borges");
    expect(result?.isbn).toBe("9789500427098");
    expect(result?.pageCount).toBe(94);
    expect(result?.source).toBe("openlibrary");
    expect(result?.description).toBe("Short stories collection.");
  });
});
