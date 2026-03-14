import { describe, expect, it, vi, afterEach } from "vitest";
import { GET } from "@/app/api/metadata/route";

vi.mock("@/lib/auth", () => ({
  getAuthSession: vi.fn(),
}));

vi.mock("@/lib/metadata", () => ({
  fetchBookMetadata: vi.fn(),
}));

import { getAuthSession } from "@/lib/auth";
import { fetchBookMetadata } from "@/lib/metadata";

describe("GET /api/metadata", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    (getAuthSession as any).mockResolvedValue(null);
    const res = await GET(new Request("http://localhost/api/metadata?isbn=123"));
    expect(res.status).toBe(401);
  });

  it("returns 400 when isbn is missing", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    const res = await GET(new Request("http://localhost/api/metadata"));
    expect(res.status).toBe(400);
  });

  it("returns 200 when metadata is found", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    (fetchBookMetadata as any).mockResolvedValue({
      title: "El Principito",
      author: "Antoine de Saint-Exupéry",
      isbn: "9789500426404",
      source: "openlibrary",
    });

    const res = await GET(new Request("http://localhost/api/metadata?isbn=9789500426404"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.title).toBe("El Principito");
    expect(json.isbn).toBe("9789500426404");
  });
});
