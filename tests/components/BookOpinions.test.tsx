import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BookOpinions } from "@/components/books/BookOpinions";

vi.mock("@/lib/opinions", () => ({
  fetchBookOpinions: vi.fn().mockResolvedValue({
    isbn: "9789500427098",
    sources: [
      {
        source: "openlibrary",
        averageRating: 3.0,
        ratingsCount: 2,
        shelfCounts: [
          { name: "already_read", count: 3 },
          { name: "want_to_read", count: 1 },
        ],
      },
    ],
  }),
}));

describe("BookOpinions", () => {
  it("renders external opinions when available", async () => {
    const element = await BookOpinions({ isbn: "9789500427098" });
    render(element as React.ReactElement);

    expect(screen.getByText("Community opinions")).toBeInTheDocument();
    expect(screen.getByText("Open Library")).toBeInTheDocument();
    expect(screen.getByText("3.0")).toBeInTheDocument();
    expect(screen.getByText("2 ratings")).toBeInTheDocument();
    expect(screen.getByText("already_read: 3")).toBeInTheDocument();
  });
});
