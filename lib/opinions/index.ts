export interface OpinionSource {
  source: "openlibrary" | "google";
  averageRating?: number;
  ratingsCount?: number;
  shelfCounts?: Array<{ name: string; count: number }>;
}

export interface BookOpinions {
  isbn: string;
  sources: OpinionSource[];
}

async function fetchGoogleRatings(isbn: string): Promise<OpinionSource | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    const info = data.items[0].volumeInfo;
    if (!info.averageRating && !info.ratingsCount) return null;
    return {
      source: "google",
      averageRating: info.averageRating,
      ratingsCount: info.ratingsCount,
    };
  } catch (e) {
    console.error("Google Books ratings error:", e);
    return null;
  }
}

async function fetchOpenLibraryOpinions(isbn: string): Promise<OpinionSource | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const bookKey = `ISBN:${isbn}`;
    const book = data[bookKey];
    if (!book) return null;

    let workKey: string | undefined;
    if (book.works && book.works.length > 0) {
      workKey = book.works[0].key;
    } else if (book.key) {
      const editionRes = await fetch(`https://openlibrary.org${book.key}.json`, { next: { revalidate: 3600 } });
      if (editionRes.ok) {
        const edition = await editionRes.json();
        if (edition.works && edition.works.length > 0) {
          workKey = edition.works[0].key;
        }
      }
    } else if (book.identifiers?.openlibrary?.[0]) {
      const editionRes = await fetch(`https://openlibrary.org/books/${book.identifiers.openlibrary[0]}.json`, {
        next: { revalidate: 3600 },
      });
      if (editionRes.ok) {
        const edition = await editionRes.json();
        if (edition.works && edition.works.length > 0) {
          workKey = edition.works[0].key;
        }
      }
    }

    const workId = workKey?.split("/").pop();
    if (!workId) return null;

    const [ratingsRes, shelvesRes] = await Promise.all([
      fetch(`https://openlibrary.org/works/${workId}/ratings.json`, { next: { revalidate: 3600 } }),
      fetch(`https://openlibrary.org/works/${workId}/bookshelves.json`, { next: { revalidate: 3600 } }),
    ]);

    let averageRating: number | undefined;
    let ratingsCount: number | undefined;
    let shelfCounts: Array<{ name: string; count: number }> | undefined;

    if (ratingsRes.ok) {
      const ratings = await ratingsRes.json();
      averageRating = ratings.summary?.average;
      ratingsCount = ratings.summary?.count;
    }

    if (shelvesRes.ok) {
      const shelves = await shelvesRes.json();
      if (shelves.counts) {
        if (Array.isArray(shelves.counts)) {
          shelfCounts = shelves.counts
            .filter((c: any) => typeof c.name === "string" && typeof c.count === "number")
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 5)
            .map((c: any) => ({ name: c.name, count: c.count }));
        } else if (typeof shelves.counts === "object") {
          shelfCounts = Object.entries(shelves.counts)
            .filter(([, count]) => typeof count === "number")
            .map(([name, count]) => ({ name, count: count as number }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }
      }
    }

    if (!averageRating && !ratingsCount && !shelfCounts?.length) return null;

    return {
      source: "openlibrary",
      averageRating,
      ratingsCount,
      shelfCounts,
    };
  } catch (e) {
    console.error("Open Library opinions error:", e);
    return null;
  }
}

export async function fetchBookOpinions(isbn: string): Promise<BookOpinions | null> {
  const cleanIsbn = isbn.replace(/[- ]/g, "");

  const [openLibrary, google] = await Promise.all([
    fetchOpenLibraryOpinions(cleanIsbn),
    fetchGoogleRatings(cleanIsbn),
  ]);

  const sources = [openLibrary, google].filter(Boolean) as OpinionSource[];
  if (sources.length === 0) return null;

  return {
    isbn: cleanIsbn,
    sources,
  };
}
